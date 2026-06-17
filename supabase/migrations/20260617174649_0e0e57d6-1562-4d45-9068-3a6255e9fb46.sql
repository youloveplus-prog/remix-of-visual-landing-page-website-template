CREATE TABLE public.product_impressions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id text NOT NULL,
  product_slug text NOT NULL,
  product_name text NOT NULL,
  price numeric,
  max_visibility numeric NOT NULL DEFAULT 0,
  dwell_ms integer NOT NULL DEFAULT 0,
  viewport_w integer,
  viewport_h integer,
  observed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX product_impressions_product_id_idx ON public.product_impressions (product_id);
CREATE INDEX product_impressions_observed_at_idx ON public.product_impressions (observed_at DESC);

GRANT INSERT ON public.product_impressions TO anon, authenticated;
GRANT SELECT ON public.product_impressions TO authenticated;
GRANT ALL ON public.product_impressions TO service_role;

ALTER TABLE public.product_impressions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous and authenticated inserts"
  ON public.product_impressions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated select"
  ON public.product_impressions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role full access"
  ON public.product_impressions FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);