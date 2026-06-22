
-- 1) live_activity_settings (singleton)
CREATE TABLE public.live_activity_settings (
  id text PRIMARY KEY DEFAULT 'global',
  purchases_enabled boolean NOT NULL DEFAULT true,
  reviews_enabled boolean NOT NULL DEFAULT true,
  enrolments_enabled boolean NOT NULL DEFAULT true,
  milestones_enabled boolean NOT NULL DEFAULT true,
  toast_enabled boolean NOT NULL DEFAULT true,
  toast_interval_seconds integer NOT NULL DEFAULT 18 CHECK (toast_interval_seconds BETWEEN 5 AND 600),
  feed_window_hours integer NOT NULL DEFAULT 24 CHECK (feed_window_hours BETWEEN 1 AND 720),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

GRANT SELECT ON public.live_activity_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.live_activity_settings TO authenticated;
GRANT ALL ON public.live_activity_settings TO service_role;

ALTER TABLE public.live_activity_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read live activity settings"
  ON public.live_activity_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins manage live activity settings"
  ON public.live_activity_settings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_live_activity_settings_updated_at
  BEFORE UPDATE ON public.live_activity_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.live_activity_settings (id) VALUES ('global')
  ON CONFLICT (id) DO NOTHING;


-- 2) home_announcements
CREATE TABLE public.home_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  level text NOT NULL DEFAULT 'info' CHECK (level IN ('info','success','warning','promo')),
  link text,
  is_active boolean NOT NULL DEFAULT true,
  is_pinned boolean NOT NULL DEFAULT false,
  show_as_toast boolean NOT NULL DEFAULT false,
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.home_announcements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.home_announcements TO authenticated;
GRANT ALL ON public.home_announcements TO service_role;

ALTER TABLE public.home_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active announcements"
  ON public.home_announcements FOR SELECT
  USING (
    is_active = true
    AND (starts_at IS NULL OR starts_at <= now())
    AND (ends_at IS NULL OR ends_at > now())
  );

CREATE POLICY "Admins can read all announcements"
  ON public.home_announcements FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage announcements"
  ON public.home_announcements FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_home_announcements_updated_at
  BEFORE UPDATE ON public.home_announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX home_announcements_active_idx
  ON public.home_announcements (is_active, starts_at, ends_at);

ALTER TABLE public.home_announcements REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.home_announcements;
