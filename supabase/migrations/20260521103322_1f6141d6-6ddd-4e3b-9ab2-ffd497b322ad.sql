ALTER TABLE public.learner_profiles
  ADD COLUMN IF NOT EXISTS longest_streak INTEGER NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.award_lesson_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  last_completion TIMESTAMPTZ;
  current_streak INTEGER;
  current_longest INTEGER;
  new_streak INTEGER;
BEGIN
  PERFORM set_config('app.grant_rewards', 'on', true);

  UPDATE public.learner_profiles
    SET xp = xp + 10
    WHERE user_id = NEW.user_id;

  UPDATE public.profiles
    SET coins = coins + 5
    WHERE id = NEW.user_id;

  SELECT completed_at INTO last_completion
    FROM public.lesson_completions
    WHERE user_id = NEW.user_id
      AND id != NEW.id
    ORDER BY completed_at DESC
    LIMIT 1;

  SELECT streak_days, longest_streak
    INTO current_streak, current_longest
    FROM public.learner_profiles
    WHERE user_id = NEW.user_id;

  IF last_completion IS NULL THEN
    new_streak := 1;
  ELSIF DATE(NEW.completed_at) = DATE(last_completion) THEN
    new_streak := current_streak;
  ELSIF DATE(NEW.completed_at) = DATE(last_completion) + INTERVAL '1 day' THEN
    new_streak := current_streak + 1;
  ELSE
    new_streak := 1;
  END IF;

  UPDATE public.learner_profiles
    SET streak_days = new_streak,
        longest_streak = GREATEST(new_streak, COALESCE(current_longest, 0))
    WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_lesson_completed ON public.lesson_completions;
CREATE TRIGGER on_lesson_completed
  AFTER INSERT ON public.lesson_completions
  FOR EACH ROW
  EXECUTE FUNCTION public.award_lesson_completion();