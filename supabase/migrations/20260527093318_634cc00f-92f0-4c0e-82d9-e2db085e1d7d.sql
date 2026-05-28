
-- Helper to safely revoke + regrant
-- Trigger-only / internal SECURITY DEFINER functions: revoke from PUBLIC, no regrant.
REVOKE EXECUTE ON FUNCTION public.protect_post_pin_field() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.protect_message_columns_on_recipient_update() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.protect_profile_privileged_fields() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.recalculate_order_total() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_lesson_completion() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.enforce_lesson_xp() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.award_lesson_completion() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.touch_last_seen() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.log_lesson_completion() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.log_order_placed() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.protect_pod_design_fields() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.protect_post_immutable_fields() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.enforce_order_item_price() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.protect_learner_profile_fields() FROM PUBLIC;

-- RLS-helper SECURITY DEFINER functions: revoke from PUBLIC, regrant to anon + authenticated
-- (RLS policies evaluate as the caller's role, so these must remain callable.)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.has_content_access(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_content_access(uuid, uuid) TO anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.can_view_profile(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_view_profile(uuid, uuid) TO anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.can_message_user(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_message_user(uuid, uuid) TO anon, authenticated;

-- User-callable RPCs: signed-in only.
REVOKE EXECUTE ON FUNCTION public.redeem_reward(text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.redeem_reward(text, integer) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_or_create_today_mission() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_or_create_today_mission() TO authenticated;
