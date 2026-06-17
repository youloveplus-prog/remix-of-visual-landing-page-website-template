
-- Public read for seed buckets (signed URLs and listing work for anon + authenticated)
CREATE POLICY "Public read seed-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'seed-images');

CREATE POLICY "Public read seed-videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'seed-videos');

-- Authenticated users can manage objects in the two seed buckets
CREATE POLICY "Authenticated upload seed buckets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('seed-images','seed-videos'));

CREATE POLICY "Authenticated update seed buckets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('seed-images','seed-videos'))
  WITH CHECK (bucket_id IN ('seed-images','seed-videos'));

CREATE POLICY "Authenticated delete seed buckets"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('seed-images','seed-videos'));
