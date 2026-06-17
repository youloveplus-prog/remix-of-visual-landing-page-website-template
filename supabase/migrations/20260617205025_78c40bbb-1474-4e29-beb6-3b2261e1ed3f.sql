-- ============================================================
-- M2: Skill graph + mastery
-- ============================================================

-- Prerequisites edge list
CREATE TABLE IF NOT EXISTS public.topic_prerequisites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES public.curriculum_topics(id) ON DELETE CASCADE,
  prerequisite_topic_id UUID NOT NULL REFERENCES public.curriculum_topics(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (topic_id, prerequisite_topic_id),
  CHECK (topic_id <> prerequisite_topic_id)
);

GRANT SELECT ON public.topic_prerequisites TO anon, authenticated;
GRANT ALL ON public.topic_prerequisites TO service_role;

ALTER TABLE public.topic_prerequisites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prereqs readable by everyone"
  ON public.topic_prerequisites FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_topic_prereqs_topic ON public.topic_prerequisites(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_prereqs_prereq ON public.topic_prerequisites(prerequisite_topic_id);


-- Per-learner mastery scores
CREATE TABLE IF NOT EXISTS public.learner_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.curriculum_topics(id) ON DELETE CASCADE,
  mastery_score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (mastery_score >= 0 AND mastery_score <= 100),
  attempts INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  hint_count INTEGER NOT NULL DEFAULT 0,
  last_practiced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, topic_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.learner_mastery TO authenticated;
GRANT ALL ON public.learner_mastery TO service_role;

ALTER TABLE public.learner_mastery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Learners view own mastery"
  ON public.learner_mastery FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Learners insert own mastery"
  ON public.learner_mastery FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Learners update own mastery"
  ON public.learner_mastery FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_learner_mastery_updated ON public.learner_mastery;
CREATE TRIGGER trg_learner_mastery_updated
  BEFORE UPDATE ON public.learner_mastery
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_learner_mastery_user ON public.learner_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_learner_mastery_topic ON public.learner_mastery(topic_id);


-- ============================================================
-- record_mastery_attempt: EMA-smoothed mastery update
-- outcome: numeric 0..1 (1 = correct unaided, 0.7 = correct w/ 1 hint, ...)
-- hint_level: int 0..5, used to decide hint_count + outcome dampening
-- ============================================================
CREATE OR REPLACE FUNCTION public.record_mastery_attempt(
  _topic_id UUID,
  _outcome NUMERIC,
  _hint_level INTEGER DEFAULT 0
)
RETURNS public.learner_mastery
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_alpha NUMERIC := 0.3; -- EMA weight on new signal
  v_outcome NUMERIC := GREATEST(0, LEAST(1, COALESCE(_outcome, 0)));
  v_row public.learner_mastery;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  IF _topic_id IS NULL THEN
    RAISE EXCEPTION 'topic_id required';
  END IF;

  INSERT INTO public.learner_mastery (user_id, topic_id, mastery_score, attempts, correct_count, hint_count, last_practiced_at)
  VALUES (
    v_user,
    _topic_id,
    v_outcome * 100,
    1,
    CASE WHEN v_outcome >= 0.9 THEN 1 ELSE 0 END,
    CASE WHEN COALESCE(_hint_level, 0) > 0 THEN 1 ELSE 0 END,
    now()
  )
  ON CONFLICT (user_id, topic_id) DO UPDATE
  SET mastery_score = ROUND(((1 - v_alpha) * public.learner_mastery.mastery_score + v_alpha * v_outcome * 100)::numeric, 2),
      attempts = public.learner_mastery.attempts + 1,
      correct_count = public.learner_mastery.correct_count + CASE WHEN v_outcome >= 0.9 THEN 1 ELSE 0 END,
      hint_count = public.learner_mastery.hint_count + CASE WHEN COALESCE(_hint_level, 0) > 0 THEN 1 ELSE 0 END,
      last_practiced_at = now(),
      updated_at = now()
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_mastery_attempt(UUID, NUMERIC, INTEGER) TO authenticated;


-- ============================================================
-- get_next_recommended_topic: weakest unlocked topic for current user
-- A topic is "unlocked" when every prerequisite has mastery_score >= 70
-- (or has no prerequisites at all).
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_next_recommended_topic()
RETURNS TABLE (
  topic_id UUID,
  slug TEXT,
  display_name TEXT,
  subject TEXT,
  chapter TEXT,
  mastery_score NUMERIC,
  reason TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  RETURN QUERY
  WITH topic_mastery AS (
    SELECT t.id, t.slug, t.display_name, t.subject, t.chapter,
           COALESCE(lm.mastery_score, 0) AS score
    FROM public.curriculum_topics t
    LEFT JOIN public.learner_mastery lm
      ON lm.topic_id = t.id AND lm.user_id = v_user
  ),
  unlocked AS (
    SELECT tm.*
    FROM topic_mastery tm
    WHERE NOT EXISTS (
      SELECT 1
      FROM public.topic_prerequisites tp
      LEFT JOIN public.learner_mastery lmp
        ON lmp.topic_id = tp.prerequisite_topic_id AND lmp.user_id = v_user
      WHERE tp.topic_id = tm.id
        AND COALESCE(lmp.mastery_score, 0) < 70
    )
  )
  SELECT u.id, u.slug, u.display_name, u.subject, u.chapter, u.score,
         CASE
           WHEN u.score = 0 THEN 'New topic ready for you'
           WHEN u.score < 50 THEN 'Needs more practice'
           ELSE 'Almost there'
         END AS reason
  FROM unlocked u
  WHERE u.score < 85
  ORDER BY u.score ASC, u.display_name ASC
  LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_next_recommended_topic() TO authenticated;