ALTER TABLE public.product_reviews
  ADD CONSTRAINT product_reviews_user_profile_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;