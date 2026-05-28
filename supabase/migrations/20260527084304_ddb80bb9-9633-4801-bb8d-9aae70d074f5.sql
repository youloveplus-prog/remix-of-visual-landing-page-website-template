
-- Enums
CREATE TYPE public.content_kind AS ENUM ('digital','course','service');
CREATE TYPE public.content_status AS ENUM ('draft','published','archived');
CREATE TYPE public.content_asset_kind AS ENUM ('video','image','pdf','audio','zip','other');
CREATE TYPE public.service_mode AS ENUM ('bookable','deliverable');

-- content_items
CREATE TABLE public.content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.content_kind NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  description_md TEXT,
  cover_url TEXT,
  gallery TEXT[] NOT NULL DEFAULT '{}',
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC,
  currency TEXT NOT NULL DEFAULT 'BDT',
  is_free BOOLEAN NOT NULL DEFAULT false,
  category TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  level TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  duration_min INTEGER NOT NULL DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  instructor_id UUID,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_content_items_kind_status ON public.content_items(kind, status);
CREATE INDEX idx_content_items_featured ON public.content_items(is_featured) WHERE is_featured = true;

GRANT SELECT ON public.content_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.content_items TO authenticated;
GRANT ALL ON public.content_items TO service_role;

ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published content viewable by all"
  ON public.content_items FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins manage content_items"
  ON public.content_items FOR ALL
  TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role));

CREATE TRIGGER trg_content_items_updated_at
  BEFORE UPDATE ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- course_modules
CREATE TABLE public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_course_modules_item ON public.course_modules(item_id, position);

GRANT SELECT ON public.course_modules TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.course_modules TO authenticated;
GRANT ALL ON public.course_modules TO service_role;

ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modules of published courses viewable"
  ON public.course_modules FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.content_items i WHERE i.id = item_id AND i.status='published'));

CREATE POLICY "Admins manage course_modules"
  ON public.course_modules FOR ALL
  TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role));

CREATE TRIGGER trg_course_modules_updated_at
  BEFORE UPDATE ON public.course_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- course_lessons
CREATE TABLE public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_md TEXT,
  video_asset_id UUID,
  duration_min INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  is_preview BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_course_lessons_module ON public.course_lessons(module_id, position);

GRANT SELECT ON public.course_lessons TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.course_lessons TO authenticated;
GRANT ALL ON public.course_lessons TO service_role;

ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons of published courses viewable"
  ON public.course_lessons FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.content_items i WHERE i.id = item_id AND i.status='published'));

CREATE POLICY "Admins manage course_lessons"
  ON public.course_lessons FOR ALL
  TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role));

CREATE TRIGGER trg_course_lessons_updated_at
  BEFORE UPDATE ON public.course_lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- service_details
CREATE TABLE public.service_details (
  item_id UUID PRIMARY KEY REFERENCES public.content_items(id) ON DELETE CASCADE,
  mode public.service_mode NOT NULL DEFAULT 'deliverable',
  delivery_days INTEGER NOT NULL DEFAULT 7,
  session_minutes INTEGER NOT NULL DEFAULT 60,
  max_revisions INTEGER NOT NULL DEFAULT 2,
  included JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.service_details TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.service_details TO authenticated;
GRANT ALL ON public.service_details TO service_role;

ALTER TABLE public.service_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service details viewable"
  ON public.service_details FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.content_items i WHERE i.id = item_id AND i.status='published'));

CREATE POLICY "Admins manage service_details"
  ON public.service_details FOR ALL
  TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role));

CREATE TRIGGER trg_service_details_updated_at
  BEFORE UPDATE ON public.service_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- content_purchases
CREATE TABLE public.content_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  order_id UUID,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, item_id)
);
CREATE INDEX idx_content_purchases_user ON public.content_purchases(user_id);

GRANT SELECT ON public.content_purchases TO authenticated;
GRANT ALL ON public.content_purchases TO service_role;

ALTER TABLE public.content_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own purchases"
  ON public.content_purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins view all purchases"
  ON public.content_purchases FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role));

CREATE POLICY "Admins manage purchases"
  ON public.content_purchases FOR ALL
  TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role));

-- Helper to check access
CREATE OR REPLACE FUNCTION public.has_content_access(_user_id UUID, _item_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    EXISTS (SELECT 1 FROM public.content_items i WHERE i.id = _item_id AND i.is_free = true AND i.status='published')
    OR EXISTS (SELECT 1 FROM public.content_purchases p WHERE p.user_id = _user_id AND p.item_id = _item_id AND (p.expires_at IS NULL OR p.expires_at > now()))
    OR public.has_role(_user_id,'admin'::app_role)
    OR public.has_role(_user_id,'super_admin'::app_role);
$$;

-- content_assets
CREATE TABLE public.content_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  kind public.content_asset_kind NOT NULL,
  url TEXT,
  storage_path TEXT,
  mime TEXT,
  size_bytes BIGINT,
  duration_sec INTEGER,
  position INTEGER NOT NULL DEFAULT 0,
  is_preview BOOLEAN NOT NULL DEFAULT false,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_content_assets_item ON public.content_assets(item_id, position);
CREATE INDEX idx_content_assets_lesson ON public.content_assets(lesson_id);

GRANT SELECT ON public.content_assets TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.content_assets TO authenticated;
GRANT ALL ON public.content_assets TO service_role;

ALTER TABLE public.content_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Preview assets viewable by all"
  ON public.content_assets FOR SELECT
  USING (
    is_preview = true
    AND EXISTS (SELECT 1 FROM public.content_items i WHERE i.id = item_id AND i.status='published')
  );

CREATE POLICY "Purchasers view assets"
  ON public.content_assets FOR SELECT
  TO authenticated
  USING (public.has_content_access(auth.uid(), item_id));

CREATE POLICY "Admins manage assets"
  ON public.content_assets FOR ALL
  TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role));

-- lesson_progress
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  seconds_watched INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);
CREATE INDEX idx_lesson_progress_user_item ON public.lesson_progress(user_id, item_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own lesson progress"
  ON public.lesson_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- service_bookings
CREATE TABLE public.service_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'new',
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_service_bookings_user ON public.service_bookings(user_id);
CREATE INDEX idx_service_bookings_item ON public.service_bookings(item_id);

GRANT SELECT, INSERT, UPDATE ON public.service_bookings TO authenticated;
GRANT ALL ON public.service_bookings TO service_role;

ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own bookings"
  ON public.service_bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users create own bookings"
  ON public.service_bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage bookings"
  ON public.service_bookings FOR ALL
  TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role));

CREATE TRIGGER trg_service_bookings_updated_at
  BEFORE UPDATE ON public.service_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('content-media','content-media', false)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('content-covers','content-covers', true)
  ON CONFLICT (id) DO NOTHING;

-- Storage policies: admins upload to either bucket
CREATE POLICY "Admins upload content-media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id IN ('content-media','content-covers')
    AND (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role))
  );

CREATE POLICY "Admins update content media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id IN ('content-media','content-covers')
    AND (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role))
  );

CREATE POLICY "Admins delete content media"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id IN ('content-media','content-covers')
    AND (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role))
  );

CREATE POLICY "Public read content covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'content-covers');

CREATE POLICY "Purchasers read content media via signed url issuance"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'content-media'
    AND (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role))
  );
