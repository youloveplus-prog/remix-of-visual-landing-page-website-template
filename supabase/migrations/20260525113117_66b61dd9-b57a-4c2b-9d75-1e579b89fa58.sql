
DO $$
DECLARE
  f record;
BEGIN
  FOR f IN
    SELECT n.nspname AS schema_name, p.proname AS fn_name,
           pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prosecdef = true
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM PUBLIC, anon',
                   f.schema_name, f.fn_name, f.args);
  END LOOP;
END $$;

-- Re-grant EXECUTE on user-callable RPCs (helpers used in RLS policies must remain callable by authenticated)
GRANT EXECUTE ON FUNCTION public.redeem_reward(text, integer)         TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_or_create_today_mission()        TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role)      TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_view_profile(uuid, uuid)         TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_message_user(uuid, uuid)         TO authenticated;
