
-- 1) Profile website: enforce safe URL at DB level
ALTER TABLE public.profiles
  ADD CONSTRAINT website_url_safe
  CHECK (website IS NULL OR website = '' OR website ~* '^https?://.+');

-- 2) admin_notifications: allow recipients to read their notifications
CREATE POLICY "Audience reads notifications"
ON public.admin_notifications
FOR SELECT
TO authenticated
USING (
  audience = 'all'
  OR audience = 'authenticated'
  OR (audience = 'admins' AND (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'super_admin'::app_role)))
);

-- 3) content-media storage: purchasers can read media of items they own
CREATE POLICY "Purchasers read content media"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'content-media'
  AND EXISTS (
    SELECT 1 FROM public.content_assets a
    WHERE a.storage_path = storage.objects.name
      AND public.has_content_access(auth.uid(), a.item_id)
  )
);

-- 4) pod_designs: prevent self-approval. Attach existing protect function as trigger.
DROP TRIGGER IF EXISTS protect_pod_design_fields_trg ON public.pod_designs;
CREATE TRIGGER protect_pod_design_fields_trg
BEFORE UPDATE ON public.pod_designs
FOR EACH ROW EXECUTE FUNCTION public.protect_pod_design_fields();

-- 5) Revoke EXECUTE from anon on SECURITY DEFINER RPCs that require auth
REVOKE EXECUTE ON FUNCTION public.redeem_reward(text, integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.schedule_revision(uuid, smallint) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_or_create_today_mission() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_content_access(uuid, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.can_view_profile(uuid, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.can_message_user(uuid, uuid) FROM anon, public;

GRANT EXECUTE ON FUNCTION public.redeem_reward(text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.schedule_revision(uuid, smallint) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_or_create_today_mission() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_content_access(uuid, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_view_profile(uuid, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_message_user(uuid, uuid) TO authenticated, service_role;
