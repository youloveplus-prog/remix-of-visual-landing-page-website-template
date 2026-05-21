
-- 1. Protect privileged columns on pod_designs for non-admins
CREATE OR REPLACE FUNCTION public.protect_pod_design_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) THEN
    RETURN NEW;
  END IF;
  NEW.status            := OLD.status;
  NEW.approved_at       := OLD.approved_at;
  NEW.rejection_reason  := OLD.rejection_reason;
  NEW.sales_count       := OLD.sales_count;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_pod_design_fields ON public.pod_designs;
CREATE TRIGGER trg_protect_pod_design_fields
BEFORE UPDATE ON public.pod_designs
FOR EACH ROW EXECUTE FUNCTION public.protect_pod_design_fields();

-- 2. Create avatars bucket (referenced by ProfileHeader avatar/cover uploads)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg','image/png','image/gif','image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Avatars public read" ON storage.objects;
CREATE POLICY "Avatars public read" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users upload own avatar" ON storage.objects;
CREATE POLICY "Users upload own avatar" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users update own avatar" ON storage.objects;
CREATE POLICY "Users update own avatar" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users delete own avatar" ON storage.objects;
CREATE POLICY "Users delete own avatar" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 3. Remove broad SELECT policy on public home-banners bucket (CDN serves them publicly)
DROP POLICY IF EXISTS "Home banner images public read" ON storage.objects;

-- 4. Lock down award_lesson_completion (trigger function, not meant to be called directly)
REVOKE EXECUTE ON FUNCTION public.award_lesson_completion() FROM PUBLIC, anon, authenticated;
