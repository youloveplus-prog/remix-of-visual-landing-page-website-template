ALTER TABLE public.lesson_completions
  ADD COLUMN IF NOT EXISTS xp_awarded integer NOT NULL DEFAULT 10;