
-- =========================================================
-- AI TUTOR core tables (the previous migration was never applied remotely)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.ai_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New chat',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_threads TO authenticated;
GRANT ALL ON public.ai_threads TO service_role;

ALTER TABLE public.ai_threads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own threads" ON public.ai_threads;
CREATE POLICY "Users manage own threads" ON public.ai_threads FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_ai_threads_updated ON public.ai_threads;
CREATE TRIGGER trg_ai_threads_updated BEFORE UPDATE ON public.ai_threads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.ai_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  parts JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_messages TO authenticated;
GRANT ALL ON public.ai_messages TO service_role;

ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own ai messages" ON public.ai_messages;
CREATE POLICY "Users manage own ai messages" ON public.ai_messages FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_ai_messages_thread ON public.ai_messages(thread_id, created_at);


-- =========================================================
-- Milestone 1: Socratic tutor foundation
-- =========================================================
CREATE TABLE IF NOT EXISTS public.curriculum_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  class_level TEXT,
  subject TEXT,
  chapter TEXT,
  skill TEXT,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.curriculum_topics TO anon;
GRANT SELECT ON public.curriculum_topics TO authenticated;
GRANT ALL ON public.curriculum_topics TO service_role;

ALTER TABLE public.curriculum_topics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Curriculum topics readable by everyone" ON public.curriculum_topics;
CREATE POLICY "Curriculum topics readable by everyone"
  ON public.curriculum_topics FOR SELECT USING (true);

DROP TRIGGER IF EXISTS trg_curriculum_topics_updated ON public.curriculum_topics;
CREATE TRIGGER trg_curriculum_topics_updated
  BEFORE UPDATE ON public.curriculum_topics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


ALTER TABLE public.ai_messages
  ADD COLUMN IF NOT EXISTS socratic_step TEXT
    CHECK (socratic_step IN ('understand','plan','try','check') OR socratic_step IS NULL),
  ADD COLUMN IF NOT EXISTS hint_level SMALLINT
    CHECK (hint_level IS NULL OR (hint_level >= 0 AND hint_level <= 5)),
  ADD COLUMN IF NOT EXISTS topic_id UUID REFERENCES public.curriculum_topics(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS topic_hint TEXT,
  ADD COLUMN IF NOT EXISTS attempt_payload JSONB;

CREATE INDEX IF NOT EXISTS idx_ai_messages_topic_id ON public.ai_messages(topic_id);

ALTER TABLE public.ai_threads
  ADD COLUMN IF NOT EXISTS active_topic_id UUID REFERENCES public.curriculum_topics(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS active_step TEXT
    CHECK (active_step IN ('understand','plan','try','check') OR active_step IS NULL),
  ADD COLUMN IF NOT EXISTS last_hint_level SMALLINT
    CHECK (last_hint_level IS NULL OR (last_hint_level >= 0 AND last_hint_level <= 5));
