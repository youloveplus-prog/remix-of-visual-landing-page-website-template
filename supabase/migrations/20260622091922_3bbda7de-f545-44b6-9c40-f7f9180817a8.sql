-- WISHLISTS (products.id is text)
CREATE TABLE IF NOT EXISTS public.wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wishlists TO authenticated;
GRANT ALL ON public.wishlists TO service_role;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wishlist self select" ON public.wishlists FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "wishlist self insert" ON public.wishlists FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wishlist self delete" ON public.wishlists FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id text,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;
GRANT ALL ON public.cart_items TO service_role;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cart self all" ON public.cart_items FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER cart_items_updated BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total numeric(12,2) NOT NULL DEFAULT 0,
  payment_method text,
  payment_status text NOT NULL DEFAULT 'pending',
  status text NOT NULL DEFAULT 'pending',
  shipping_address jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders self select" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "orders self insert" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders admin update" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id text REFERENCES public.products(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1,
  price numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items via parent select" ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND (o.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "order_items via parent insert" ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()));

CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  display_order integer NOT NULL DEFAULT 0,
  icon text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories read all" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories admin write" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tags TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tags TO authenticated;
GRANT ALL ON public.tags TO service_role;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tags read all" ON public.tags FOR SELECT USING (true);
CREATE POLICY "tags admin write" ON public.tags FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.learner_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  goal text,
  level text,
  interests text[],
  learning_style text,
  active_track_id uuid REFERENCES public.tracks(id) ON DELETE SET NULL,
  locale text NOT NULL DEFAULT 'en',
  onboarded_at timestamptz,
  last_active_at timestamptz,
  streak_days integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  xp integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.learner_profiles TO authenticated;
GRANT ALL ON public.learner_profiles TO service_role;
ALTER TABLE public.learner_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "learner self select" ON public.learner_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "learner self upsert" ON public.learner_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "learner self update" ON public.learner_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER learner_profiles_updated BEFORE UPDATE ON public.learner_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  unlocked_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.milestones TO authenticated;
GRANT ALL ON public.milestones TO service_role;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "milestones self select" ON public.milestones FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "milestones self insert" ON public.milestones FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'post',
  title text,
  body text,
  media_url text,
  thumbnail_url text,
  rating integer,
  product_id text REFERENCES public.products(id) ON DELETE SET NULL,
  is_pinned boolean NOT NULL DEFAULT false,
  likes integer NOT NULL DEFAULT 0,
  comments integer NOT NULL DEFAULT 0,
  shares integer NOT NULL DEFAULT 0,
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts read all" ON public.posts FOR SELECT USING (true);
CREATE POLICY "posts self insert" ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "posts self update" ON public.posts FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "posts self delete" ON public.posts FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER posts_updated BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.post_comments TO anon;
GRANT SELECT, INSERT, DELETE ON public.post_comments TO authenticated;
GRANT ALL ON public.post_comments TO service_role;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "post_comments read all" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "post_comments self insert" ON public.post_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "post_comments self delete" ON public.post_comments FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.user_followers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id <> following_id)
);
GRANT SELECT ON public.user_followers TO anon;
GRANT SELECT, INSERT, DELETE ON public.user_followers TO authenticated;
GRANT ALL ON public.user_followers TO service_role;
ALTER TABLE public.user_followers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "followers read all" ON public.user_followers FOR SELECT USING (true);
CREATE POLICY "followers self insert" ON public.user_followers FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "followers self delete" ON public.user_followers FOR DELETE TO authenticated USING (auth.uid() = follower_id);

CREATE TABLE IF NOT EXISTS public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE,
  kind text NOT NULL DEFAULT 'course',
  title text NOT NULL,
  description text,
  price numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  cover_url text,
  status text NOT NULL DEFAULT 'draft',
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  creator_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.content_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_items TO authenticated;
GRANT ALL ON public.content_items TO service_role;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content read published or admin" ON public.content_items FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "content admin write" ON public.content_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER content_items_updated BEFORE UPDATE ON public.content_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  title text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.course_modules TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_modules TO authenticated;
GRANT ALL ON public.course_modules TO service_role;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "modules read via item" ON public.course_modules FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.content_items ci WHERE ci.id = course_modules.content_item_id AND (ci.status = 'published' OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "modules admin write" ON public.course_modules FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.course_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  duration_min integer NOT NULL DEFAULT 0,
  video_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_preview boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.course_lessons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_lessons TO authenticated;
GRANT ALL ON public.course_lessons TO service_role;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lessons read via module" ON public.course_lessons FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.course_modules m
    JOIN public.content_items ci ON ci.id = m.content_item_id
    WHERE m.id = course_lessons.module_id AND (ci.status = 'published' OR public.has_role(auth.uid(), 'admin'))
  )
);
CREATE POLICY "lessons admin write" ON public.course_lessons FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.content_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  granted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_id)
);
GRANT SELECT, INSERT ON public.content_purchases TO authenticated;
GRANT ALL ON public.content_purchases TO service_role;
ALTER TABLE public.content_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "purchases self select" ON public.content_purchases FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "purchases self insert" ON public.content_purchases FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.content_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  kind text NOT NULL,
  storage_path text NOT NULL,
  is_preview boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_assets TO authenticated;
GRANT ALL ON public.content_assets TO service_role;
ALTER TABLE public.content_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assets preview public" ON public.content_assets FOR SELECT USING (
  is_preview = true OR public.has_role(auth.uid(), 'admin')
  OR EXISTS (SELECT 1 FROM public.content_purchases p WHERE p.item_id = content_assets.content_item_id AND p.user_id = auth.uid())
);
CREATE POLICY "assets admin write" ON public.content_assets FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.service_details (
  content_item_id uuid PRIMARY KEY REFERENCES public.content_items(id) ON DELETE CASCADE,
  scope text,
  deliverables jsonb NOT NULL DEFAULT '[]'::jsonb,
  turnaround_days integer,
  revisions integer,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_details TO authenticated;
GRANT SELECT ON public.service_details TO anon;
GRANT ALL ON public.service_details TO service_role;
ALTER TABLE public.service_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_details read public" ON public.service_details FOR SELECT USING (true);
CREATE POLICY "service_details admin write" ON public.service_details FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER service_details_updated BEFORE UPDATE ON public.service_details FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.creators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  display_name text NOT NULL,
  bio text,
  avatar_url text,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.creators TO anon;
GRANT SELECT, INSERT, UPDATE ON public.creators TO authenticated;
GRANT ALL ON public.creators TO service_role;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creators read all" ON public.creators FOR SELECT USING (true);
CREATE POLICY "creators self update" ON public.creators FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "creators admin insert" ON public.creators FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.live_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  host_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  scheduled_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  cover_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.live_sessions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.live_sessions TO authenticated;
GRANT ALL ON public.live_sessions TO service_role;
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "live read all" ON public.live_sessions FOR SELECT USING (true);
CREATE POLICY "live admin write" ON public.live_sessions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  cost integer NOT NULL DEFAULT 0,
  kind text NOT NULL DEFAULT 'badge',
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.rewards TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rewards TO authenticated;
GRANT ALL ON public.rewards TO service_role;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rewards read active or admin" ON public.rewards FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "rewards admin write" ON public.rewards FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings admin all" ON public.app_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text,
  target_id text,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit admin read" ON public.admin_audit_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "audit any insert" ON public.admin_audit_log FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  level text NOT NULL DEFAULT 'info',
  link text,
  audience text NOT NULL DEFAULT 'all',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_notifications TO authenticated;
GRANT ALL ON public.admin_notifications TO service_role;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications read all signed in" ON public.admin_notifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "notifications admin write" ON public.admin_notifications FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.user_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  kind text NOT NULL,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.user_activity_log TO anon;
GRANT SELECT, INSERT ON public.user_activity_log TO authenticated;
GRANT ALL ON public.user_activity_log TO service_role;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity self select" ON public.user_activity_log FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "activity any insert" ON public.user_activity_log FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.today_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE SET NULL,
  date date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, date)
);
GRANT SELECT, INSERT, UPDATE ON public.today_missions TO authenticated;
GRANT ALL ON public.today_missions TO service_role;
ALTER TABLE public.today_missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "missions self all" ON public.today_missions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.get_or_create_today_mission()
RETURNS public.today_missions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_today date := (now() AT TIME ZONE 'utc')::date;
  v_row public.today_missions;
  v_lesson uuid;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  SELECT * INTO v_row FROM public.today_missions WHERE user_id = v_user AND date = v_today;
  IF FOUND THEN RETURN v_row; END IF;
  SELECT l.id INTO v_lesson
  FROM public.lessons l
  JOIN public.learner_profiles lp ON lp.user_id = v_user AND lp.active_track_id = l.track_id
  ORDER BY l."order" ASC
  LIMIT 1;
  IF v_lesson IS NULL THEN
    SELECT id INTO v_lesson FROM public.lessons ORDER BY created_at ASC LIMIT 1;
  END IF;
  INSERT INTO public.today_missions (user_id, lesson_id, date)
    VALUES (v_user, v_lesson, v_today)
    RETURNING * INTO v_row;
  RETURN v_row;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_or_create_today_mission() TO authenticated;