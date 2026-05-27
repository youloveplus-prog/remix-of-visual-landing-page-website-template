
-- Spaced repetition items (per user + lesson, optional topic label)
CREATE TABLE public.revision_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL,
  topic TEXT,
  ease NUMERIC NOT NULL DEFAULT 2.5,
  interval_days INTEGER NOT NULL DEFAULT 1,
  repetitions INTEGER NOT NULL DEFAULT 0,
  last_grade SMALLINT,
  last_reviewed_at TIMESTAMPTZ,
  next_due_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.revision_items TO authenticated;
GRANT ALL ON public.revision_items TO service_role;

ALTER TABLE public.revision_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own revision items"
  ON public.revision_items
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_revision_items_due ON public.revision_items (user_id, next_due_at);

CREATE TRIGGER trg_revision_items_updated
  BEFORE UPDATE ON public.revision_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Quiz attempts (any MCQ / practice run; supports mastery + skill map)
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID,
  track_id UUID,
  topic TEXT,
  score_pct SMALLINT NOT NULL CHECK (score_pct BETWEEN 0 AND 100),
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
  source TEXT NOT NULL DEFAULT 'ai',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.quiz_attempts TO authenticated;
GRANT ALL ON public.quiz_attempts TO service_role;

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own quiz attempts"
  ON public.quiz_attempts
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own quiz attempts"
  ON public.quiz_attempts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins read all quiz attempts"
  ON public.quiz_attempts
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE INDEX idx_quiz_attempts_user_created ON public.quiz_attempts (user_id, created_at DESC);
CREATE INDEX idx_quiz_attempts_user_track ON public.quiz_attempts (user_id, track_id);

-- Schedule a revision item using SM-2 with quality grade 0..5
-- Auto-creates row on first call (e.g., right after lesson completion).
CREATE OR REPLACE FUNCTION public.schedule_revision(_lesson_id UUID, _grade SMALLINT)
RETURNS public.revision_items
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  row public.revision_items;
  new_ease NUMERIC;
  new_interval INTEGER;
  new_reps INTEGER;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _grade IS NULL OR _grade < 0 OR _grade > 5 THEN
    RAISE EXCEPTION 'Grade must be 0..5';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.lessons WHERE id = _lesson_id) THEN
    RAISE EXCEPTION 'Invalid lesson_id';
  END IF;

  SELECT * INTO row FROM public.revision_items
    WHERE user_id = uid AND lesson_id = _lesson_id FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO public.revision_items (user_id, lesson_id)
      VALUES (uid, _lesson_id) RETURNING * INTO row;
  END IF;

  new_ease := GREATEST(1.3, row.ease + (0.1 - (5 - _grade) * (0.08 + (5 - _grade) * 0.02)));

  IF _grade < 3 THEN
    new_reps := 0;
    new_interval := 1;
  ELSE
    new_reps := row.repetitions + 1;
    IF new_reps = 1 THEN new_interval := 1;
    ELSIF new_reps = 2 THEN new_interval := 3;
    ELSE new_interval := GREATEST(1, ROUND(row.interval_days * new_ease))::INTEGER;
    END IF;
  END IF;

  UPDATE public.revision_items
    SET ease = new_ease,
        interval_days = new_interval,
        repetitions = new_reps,
        last_grade = _grade,
        last_reviewed_at = now(),
        next_due_at = now() + (new_interval || ' days')::interval
    WHERE id = row.id
    RETURNING * INTO row;

  RETURN row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.schedule_revision(UUID, SMALLINT) TO authenticated;

-- Auto-enroll completed lessons into revision queue (first review in 1 day)
CREATE OR REPLACE FUNCTION public.auto_enroll_revision()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.revision_items (user_id, lesson_id, next_due_at, interval_days)
    VALUES (NEW.user_id, NEW.lesson_id, now() + interval '1 day', 1)
    ON CONFLICT (user_id, lesson_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_lesson_completion_enroll_revision
  AFTER INSERT ON public.lesson_completions
  FOR EACH ROW EXECUTE FUNCTION public.auto_enroll_revision();
