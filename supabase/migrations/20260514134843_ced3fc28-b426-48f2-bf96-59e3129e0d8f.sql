
CREATE TABLE public.home_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  enabled boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  title_override text,
  subtitle_override text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.home_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Home sections viewable by all"
  ON public.home_sections FOR SELECT
  USING (true);

CREATE POLICY "Admins manage home sections"
  ON public.home_sections FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE TRIGGER trg_home_sections_updated_at
  BEFORE UPDATE ON public.home_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.home_sections (key, display_order) VALUES
  ('hero', 10),
  ('quick_actions', 20),
  ('quick_categories', 30),
  ('trending', 40),
  ('community', 50),
  ('how_it_works', 60),
  ('why_trust', 70),
  ('curated', 80),
  ('new_arrivals', 90),
  ('testimonials', 100),
  ('faq', 110),
  ('final_cta', 120)
ON CONFLICT (key) DO NOTHING;
