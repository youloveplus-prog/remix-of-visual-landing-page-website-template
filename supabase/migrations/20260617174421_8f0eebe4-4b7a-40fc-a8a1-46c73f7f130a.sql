CREATE TABLE public.product_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price NUMERIC,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_clicks_product_id ON public.product_clicks(product_id);
CREATE INDEX idx_product_clicks_slug ON public.product_clicks(product_slug);
CREATE INDEX idx_product_clicks_clicked_at ON public.product_clicks(clicked_at DESC);

GRANT INSERT ON public.product_clicks TO anon;
GRANT INSERT ON public.product_clicks TO authenticated;
GRANT SELECT ON public.product_clicks TO authenticated;
GRANT ALL ON public.product_clicks TO service_role;

ALTER TABLE public.product_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous and authenticated inserts"
  ON public.product_clicks
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated select"
  ON public.product_clicks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role full access"
  ON public.product_clicks
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
