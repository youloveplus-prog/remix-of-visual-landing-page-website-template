REVOKE EXECUTE ON FUNCTION public.has_content_access(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_content_access(uuid, uuid) TO authenticated;

DROP POLICY IF EXISTS "Public read content covers" ON storage.objects;