
-- 1) mentor_verifications: restrict SELECT to the mentor + admins
DROP POLICY IF EXISTS "Verifications readable by everyone" ON public.mentor_verifications;
CREATE POLICY "Mentor or admin can view verification"
  ON public.mentor_verifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = mentor_id OR public.has_role(auth.uid(), 'admin'));

-- 2) parent_links: block students from setting status='verified'
DROP POLICY IF EXISTS "Parties update own link" ON public.parent_links;

CREATE POLICY "Parent can update own link"
  ON public.parent_links
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = parent_user_id)
  WITH CHECK (auth.uid() = parent_user_id);

CREATE POLICY "Admins can update any parent link"
  ON public.parent_links
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.guard_parent_link_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'verified' AND NOT public.has_role(auth.uid(), 'admin') THEN
      RAISE EXCEPTION 'Only admins can set parent_links.status to verified';
    END IF;
  END IF;
  IF TG_OP = 'INSERT' AND NEW.status = 'verified' AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can create a verified parent_link';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_parent_link_status ON public.parent_links;
CREATE TRIGGER guard_parent_link_status
  BEFORE INSERT OR UPDATE ON public.parent_links
  FOR EACH ROW EXECUTE FUNCTION public.guard_parent_link_status();

-- 3) products: admins-only writes
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4) storage seed buckets: admins-only writes
DROP POLICY IF EXISTS "Authenticated upload seed buckets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update seed buckets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete seed buckets" ON storage.objects;

CREATE POLICY "Admins upload seed buckets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = ANY (ARRAY['seed-images','seed-videos'])
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins update seed buckets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = ANY (ARRAY['seed-images','seed-videos'])
    AND public.has_role(auth.uid(), 'admin')
  )
  WITH CHECK (
    bucket_id = ANY (ARRAY['seed-images','seed-videos'])
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins delete seed buckets"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = ANY (ARRAY['seed-images','seed-videos'])
    AND public.has_role(auth.uid(), 'admin')
  );

-- 5) Tighten SECURITY DEFINER function exposure
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_verified_parent_of(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.assign_default_user_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_community_post_identity() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_profile() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.guard_parent_link_status() FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.get_next_recommended_topic() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_next_recommended_topic() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.record_mastery_attempt(uuid, numeric, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_mastery_attempt(uuid, numeric, integer) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.increment_post_engagement(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.increment_post_engagement(uuid, text) TO authenticated;
