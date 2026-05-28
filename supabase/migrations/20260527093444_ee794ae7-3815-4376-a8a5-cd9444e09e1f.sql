
-- Trigger-maintained tsvector columns (works around IMMUTABLE constraint)

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS search_vec tsvector;
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS search_vec tsvector;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS search_vec tsvector;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS search_vec tsvector;

CREATE OR REPLACE FUNCTION public.products_search_vec_update() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.search_vec :=
    setweight(to_tsvector('simple'::regconfig, coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(NEW.description, '')), 'B');
  RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION public.content_items_search_vec_update() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.search_vec :=
    setweight(to_tsvector('simple'::regconfig, coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(NEW.summary, '')), 'B') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(array_to_string(NEW.tags, ' '), '')), 'C') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(NEW.category, '')), 'C');
  RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION public.mentors_search_vec_update() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.search_vec :=
    setweight(to_tsvector('simple'::regconfig, coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(array_to_string(NEW.subjects, ' '), '')), 'B') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(NEW.bio, '')), 'C');
  RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION public.posts_search_vec_update() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.search_vec := setweight(to_tsvector('simple'::regconfig, coalesce(NEW.content, '')), 'B');
  RETURN NEW;
END $$;

REVOKE EXECUTE ON FUNCTION public.products_search_vec_update() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.content_items_search_vec_update() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.mentors_search_vec_update() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.posts_search_vec_update() FROM PUBLIC;

DROP TRIGGER IF EXISTS trg_products_search_vec ON public.products;
CREATE TRIGGER trg_products_search_vec BEFORE INSERT OR UPDATE OF name, description ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.products_search_vec_update();

DROP TRIGGER IF EXISTS trg_content_items_search_vec ON public.content_items;
CREATE TRIGGER trg_content_items_search_vec BEFORE INSERT OR UPDATE OF title, summary, tags, category ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.content_items_search_vec_update();

DROP TRIGGER IF EXISTS trg_mentors_search_vec ON public.mentors;
CREATE TRIGGER trg_mentors_search_vec BEFORE INSERT OR UPDATE OF name, subjects, bio ON public.mentors
  FOR EACH ROW EXECUTE FUNCTION public.mentors_search_vec_update();

DROP TRIGGER IF EXISTS trg_posts_search_vec ON public.posts;
CREATE TRIGGER trg_posts_search_vec BEFORE INSERT OR UPDATE OF content ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.posts_search_vec_update();

-- Backfill existing rows
UPDATE public.products SET search_vec = NULL WHERE search_vec IS NULL;
UPDATE public.products SET name = name;
UPDATE public.content_items SET title = title;
UPDATE public.mentors SET name = name;
UPDATE public.posts SET content = content;

CREATE INDEX IF NOT EXISTS idx_products_search_vec ON public.products USING GIN (search_vec);
CREATE INDEX IF NOT EXISTS idx_content_items_search_vec ON public.content_items USING GIN (search_vec);
CREATE INDEX IF NOT EXISTS idx_mentors_search_vec ON public.mentors USING GIN (search_vec);
CREATE INDEX IF NOT EXISTS idx_posts_search_vec ON public.posts USING GIN (search_vec);

CREATE OR REPLACE FUNCTION public.global_search(q text, per_source int DEFAULT 5)
RETURNS TABLE (
  source text, id uuid, kind text, title text, slug text,
  image_url text, price numeric, is_free boolean, extra jsonb, score real
)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  WITH tsq AS (SELECT websearch_to_tsquery('simple'::regconfig, q) AS query)
  (SELECT 'product'::text, p.id, NULL::text, p.name, p.slug, p.image_url, p.price, false,
          '{}'::jsonb, ts_rank(p.search_vec, (SELECT query FROM tsq))
   FROM public.products p, tsq
   WHERE p.search_vec @@ tsq.query
   ORDER BY ts_rank(p.search_vec, (SELECT query FROM tsq)) DESC
   LIMIT per_source)
  UNION ALL
  (SELECT 'content'::text, c.id, c.kind::text, c.title, c.slug, c.cover_url, c.price, c.is_free,
          '{}'::jsonb, ts_rank(c.search_vec, (SELECT query FROM tsq))
   FROM public.content_items c, tsq
   WHERE c.status = 'published' AND c.search_vec @@ tsq.query
   ORDER BY ts_rank(c.search_vec, (SELECT query FROM tsq)) DESC
   LIMIT per_source * 3)
  UNION ALL
  (SELECT 'mentor'::text, m.id, NULL, m.name, m.slug, m.avatar_url, 0::numeric, false,
          jsonb_build_object('subjects', m.subjects),
          ts_rank(m.search_vec, (SELECT query FROM tsq))
   FROM public.mentors m, tsq
   WHERE m.is_active = true AND m.search_vec @@ tsq.query
   ORDER BY ts_rank(m.search_vec, (SELECT query FROM tsq)) DESC
   LIMIT per_source)
  UNION ALL
  (SELECT 'post'::text, po.id, NULL, left(coalesce(po.content, ''), 120), NULL::text,
          NULL::text, 0::numeric, false,
          jsonb_build_object('user_id', po.user_id),
          ts_rank(po.search_vec, (SELECT query FROM tsq))
   FROM public.posts po, tsq
   WHERE po.search_vec @@ tsq.query
   ORDER BY ts_rank(po.search_vec, (SELECT query FROM tsq)) DESC
   LIMIT per_source);
$$;

REVOKE EXECUTE ON FUNCTION public.global_search(text, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.global_search(text, int) TO anon, authenticated;
