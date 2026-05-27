-- Promotions: admin-created promo content shown across user pages
CREATE TYPE public.promo_placement AS ENUM (
  'home_hero',
  'home_strip',
  'shop_banner',
  'community_banner'
);

CREATE TABLE public.promotions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  cta_label TEXT,
  cta_url TEXT,
  placement public.promo_placement NOT NULL DEFAULT 'home_strip',
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GRANTs (required for PostgREST Data API)
GRANT SELECT ON public.promotions TO anon;
GRANT SELECT ON public.promotions TO authenticated;
GRANT ALL ON public.promotions TO service_role;

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Public read of currently-active promotions
CREATE POLICY "Active promotions viewable by all"
  ON public.promotions
  FOR SELECT
  USING (
    is_active = true
    AND (starts_at IS NULL OR starts_at <= now())
    AND (ends_at IS NULL OR ends_at >= now())
  );

-- Admins manage everything
CREATE POLICY "Admins manage promotions"
  ON public.promotions
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Reuse existing updated_at trigger function
CREATE TRIGGER update_promotions_updated_at
  BEFORE UPDATE ON public.promotions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_promotions_placement_active ON public.promotions (placement, is_active, position);

-- Storage bucket for promo images (public read via CDN, admin-only writes)
INSERT INTO storage.buckets (id, name, public)
VALUES ('promos', 'promos', true)
ON CONFLICT (id) DO NOTHING;

-- Admin write policies on storage.objects for the promos bucket
CREATE POLICY "Admins upload promos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'promos'
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  );

CREATE POLICY "Admins update promos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'promos'
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  );

CREATE POLICY "Admins delete promos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'promos'
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  );