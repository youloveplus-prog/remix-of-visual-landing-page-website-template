
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

REVOKE EXECUTE ON FUNCTION public.can_view_profile(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.can_view_profile(uuid, uuid) TO service_role;

REVOKE EXECUTE ON FUNCTION public.can_message_user(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.can_message_user(uuid, uuid) TO service_role;

REVOKE EXECUTE ON FUNCTION public.has_content_access(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_content_access(uuid, uuid) TO service_role;

REVOKE EXECUTE ON FUNCTION public.protect_pod_design_fields() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_post_immutable_fields() FROM PUBLIC, anon, authenticated;
