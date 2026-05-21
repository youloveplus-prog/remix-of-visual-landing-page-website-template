ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS rating SMALLINT
  CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5));

COMMENT ON COLUMN public.posts.rating IS 'Star rating 1-5, only set when post type = review';