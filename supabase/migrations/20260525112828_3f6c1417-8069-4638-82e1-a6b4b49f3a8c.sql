
-- 1. Fix redeem_reward: ignore caller-supplied coin amount, use authoritative price
CREATE OR REPLACE FUNCTION public.redeem_reward(_reward_key text, _coins integer DEFAULT NULL)
RETURNS public.reward_redemptions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  uid UUID := auth.uid();
  current_balance INTEGER;
  required_coins INTEGER;
  result public.reward_redemptions;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _reward_key IS NULL OR length(_reward_key) = 0 THEN RAISE EXCEPTION 'Invalid reward'; END IF;

  -- Look up authoritative price; ignore caller-supplied _coins
  SELECT coins_required INTO required_coins
    FROM public.rewards
    WHERE (id::text = _reward_key OR type = _reward_key)
      AND is_active = true
    ORDER BY display_order
    LIMIT 1
    FOR SHARE;

  IF required_coins IS NULL THEN RAISE EXCEPTION 'Reward not found or inactive'; END IF;
  IF required_coins <= 0 THEN RAISE EXCEPTION 'Invalid reward price'; END IF;

  SELECT coins INTO current_balance FROM public.profiles WHERE id = uid FOR UPDATE;
  IF current_balance IS NULL THEN RAISE EXCEPTION 'Profile not found'; END IF;
  IF current_balance < required_coins THEN RAISE EXCEPTION 'Insufficient coins'; END IF;

  PERFORM set_config('app.grant_rewards', 'on', true);
  UPDATE public.profiles SET coins = coins - required_coins WHERE id = uid;

  INSERT INTO public.reward_redemptions (user_id, reward_key, coins_spent)
    VALUES (uid, _reward_key, required_coins)
    RETURNING * INTO result;

  RETURN result;
END;
$function$;

-- 2. Protect post columns on update (prevent users from changing product_id/rating arbitrarily after creation)
CREATE OR REPLACE FUNCTION public.protect_post_immutable_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) THEN
    RETURN NEW;
  END IF;
  NEW.product_id := OLD.product_id;
  NEW.type       := OLD.type;
  NEW.user_id    := OLD.user_id;
  IF OLD.rating IS NOT NULL THEN
    NEW.rating := OLD.rating;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_post_immutable_fields_trg ON public.posts;
CREATE TRIGGER protect_post_immutable_fields_trg
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.protect_post_immutable_fields();

-- 3. Enforce privacy settings at RLS level for profiles and chats
CREATE OR REPLACE FUNCTION public.can_view_profile(_viewer uuid, _target uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT
    _viewer = _target
    OR public.has_role(_viewer, 'admin'::app_role)
    OR public.has_role(_viewer, 'super_admin'::app_role)
    OR COALESCE(
      (SELECT
         CASE profile_visibility
           WHEN 'public' THEN true
           WHEN 'followers' THEN EXISTS (
             SELECT 1 FROM public.user_followers
             WHERE follower_id = _viewer AND following_id = _target
           )
           WHEN 'private' THEN false
           ELSE true
         END
       FROM public.user_settings WHERE user_id = _target),
      true
    );
$$;

CREATE OR REPLACE FUNCTION public.can_message_user(_sender uuid, _target uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT
    _sender = _target
    OR COALESCE(
      (SELECT
         CASE allow_messages_from
           WHEN 'everyone' THEN true
           WHEN 'followers' THEN EXISTS (
             SELECT 1 FROM public.user_followers
             WHERE follower_id = _target AND following_id = _sender
           )
           WHEN 'none' THEN false
           ELSE true
         END
       FROM public.user_settings WHERE user_id = _target),
      true
    );
$$;

DROP POLICY IF EXISTS "Authenticated users view profiles" ON public.profiles;
CREATE POLICY "Authenticated users view profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.can_view_profile(auth.uid(), id));

DROP POLICY IF EXISTS "Users create chats" ON public.chats;
CREATE POLICY "Users create chats"
  ON public.chats
  FOR INSERT
  TO authenticated
  WITH CHECK (
    ((auth.uid() = participant_1) OR (auth.uid() = participant_2))
    AND public.can_message_user(auth.uid(),
      CASE WHEN auth.uid() = participant_1 THEN participant_2 ELSE participant_1 END)
  );

-- 4. Revoke EXECUTE on user-callable SECURITY DEFINER RPCs from anon
REVOKE EXECUTE ON FUNCTION public.redeem_reward(text, integer) FROM anon, public;
GRANT  EXECUTE ON FUNCTION public.redeem_reward(text, integer) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_or_create_today_mission() FROM anon, public;
GRANT  EXECUTE ON FUNCTION public.get_or_create_today_mission() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
GRANT  EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.can_view_profile(uuid, uuid) FROM anon, public;
GRANT  EXECUTE ON FUNCTION public.can_view_profile(uuid, uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.can_message_user(uuid, uuid) FROM anon, public;
GRANT  EXECUTE ON FUNCTION public.can_message_user(uuid, uuid) TO authenticated;
