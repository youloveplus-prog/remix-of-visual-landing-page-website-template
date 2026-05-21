
-- 1.1: longest_streak column
ALTER TABLE public.learner_profiles
  ADD COLUMN IF NOT EXISTS longest_streak INTEGER NOT NULL DEFAULT 0;

UPDATE public.learner_profiles
  SET longest_streak = streak_days
  WHERE longest_streak < streak_days;

-- 6.2: rewards table
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'general',
  coins_required INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active rewards viewable by all"
  ON public.rewards FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins manage rewards"
  ON public.rewards FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE TRIGGER update_rewards_updated_at
  BEFORE UPDATE ON public.rewards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed a few default rewards
INSERT INTO public.rewards (title, description, type, coins_required, display_order) VALUES
  ('Free Course Unlock', 'Unlock any premium course for free', 'course', 500, 1),
  ('Mentor Session 15min', '15-minute 1-on-1 mentor session', 'mentor', 800, 2),
  ('Profile Badge', 'Exclusive verified learner badge', 'badge', 200, 3),
  ('Shop Discount 10%', '10% off any shop purchase', 'discount', 300, 4)
ON CONFLICT DO NOTHING;

-- 6.1: Allow trigger context to update protected coins/xp
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) THEN
    RETURN NEW;
  END IF;
  IF current_setting('app.grant_rewards', true) = 'on' THEN
    RETURN NEW;
  END IF;
  NEW.coins       := OLD.coins;
  NEW.trust_score := OLD.trust_score;
  NEW.is_verified := OLD.is_verified;
  NEW.is_banned   := OLD.is_banned;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.protect_learner_profile_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) THEN
    RETURN NEW;
  END IF;
  IF current_setting('app.grant_rewards', true) = 'on' THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' THEN
    NEW.xp             := OLD.xp;
    NEW.streak_days    := OLD.streak_days;
    NEW.last_active_at := OLD.last_active_at;
  ELSIF TG_OP = 'INSERT' THEN
    NEW.xp          := 0;
    NEW.streak_days := 0;
  END IF;
  RETURN NEW;
END;
$function$;

-- 6.1 + 1.1: Update lesson completion handler
CREATE OR REPLACE FUNCTION public.handle_lesson_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  prev_active DATE;
  current_streak INTEGER;
  current_longest INTEGER;
  new_streak INTEGER;
  active_tr UUID;
  total_in_track INTEGER;
  done_in_track INTEGER;
BEGIN
  PERFORM set_config('app.grant_rewards', 'on', true);

  INSERT INTO public.learner_profiles (user_id) VALUES (NEW.user_id)
    ON CONFLICT (user_id) DO NOTHING;

  SELECT last_active_at::date, streak_days, longest_streak, active_track_id
    INTO prev_active, current_streak, current_longest, active_tr
    FROM public.learner_profiles WHERE user_id = NEW.user_id;

  IF prev_active = CURRENT_DATE THEN
    new_streak := COALESCE(current_streak, 1);
  ELSIF prev_active = CURRENT_DATE - 1 THEN
    new_streak := COALESCE(current_streak, 0) + 1;
  ELSE
    new_streak := 1;
  END IF;

  UPDATE public.learner_profiles
    SET streak_days = new_streak,
        longest_streak = GREATEST(COALESCE(current_longest, 0), new_streak),
        last_active_at = now(),
        xp = xp + COALESCE(NEW.xp_awarded, 10)
    WHERE user_id = NEW.user_id;

  -- Award 5 coins per lesson completion
  UPDATE public.profiles
    SET coins = coins + 5
    WHERE id = NEW.user_id;

  UPDATE public.daily_missions
    SET completed = true
    WHERE user_id = NEW.user_id AND date = CURRENT_DATE AND lesson_id = NEW.lesson_id;

  INSERT INTO public.milestones (user_id, kind) VALUES (NEW.user_id, 'first_lesson')
    ON CONFLICT DO NOTHING;

  IF new_streak >= 7 THEN
    INSERT INTO public.milestones (user_id, kind) VALUES (NEW.user_id, 'streak_7')
      ON CONFLICT DO NOTHING;
  END IF;
  IF new_streak >= 30 THEN
    INSERT INTO public.milestones (user_id, kind) VALUES (NEW.user_id, 'streak_30')
      ON CONFLICT DO NOTHING;
  END IF;

  IF active_tr IS NOT NULL THEN
    SELECT COUNT(*) INTO total_in_track FROM public.lessons WHERE track_id = active_tr;
    SELECT COUNT(*) INTO done_in_track
      FROM public.lesson_completions lc
      JOIN public.lessons l ON l.id = lc.lesson_id
      WHERE lc.user_id = NEW.user_id AND l.track_id = active_tr;
    IF total_in_track > 0 AND done_in_track >= total_in_track THEN
      INSERT INTO public.milestones (user_id, kind) VALUES (NEW.user_id, 'track_complete')
        ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END; $function$;
