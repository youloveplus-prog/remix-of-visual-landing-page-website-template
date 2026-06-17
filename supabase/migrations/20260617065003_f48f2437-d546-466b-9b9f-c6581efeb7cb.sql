
-- 1. Profiles table (canonical identity)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  username TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. Auto-create profile when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta JSONB := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  v_display TEXT := COALESCE(meta->>'display_name', meta->>'full_name', meta->>'name', split_part(NEW.email, '@', 1), 'User');
  v_username TEXT := COALESCE(meta->>'username', split_part(NEW.email, '@', 1), 'user_' || substr(NEW.id::text, 1, 8));
  v_avatar TEXT := COALESCE(meta->>'avatar_url', meta->>'picture');
BEGIN
  INSERT INTO public.profiles (id, display_name, username, avatar_url)
  VALUES (NEW.id, v_display, v_username, v_avatar)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- Backfill profiles for existing users
INSERT INTO public.profiles (id, display_name, username, avatar_url)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'display_name', u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1), 'User'),
  COALESCE(u.raw_user_meta_data->>'username', split_part(u.email, '@', 1), 'user_' || substr(u.id::text, 1, 8)),
  COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture')
FROM auth.users u
ON CONFLICT (id) DO NOTHING;

-- 3. Force community_posts identity columns to match the author's profile
CREATE OR REPLACE FUNCTION public.enforce_community_post_identity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  p RECORD;
BEGIN
  -- Always set user_id to the calling user on insert
  IF TG_OP = 'INSERT' THEN
    NEW.user_id := auth.uid();
  END IF;

  SELECT display_name, username, avatar_url
    INTO p
    FROM public.profiles
    WHERE id = NEW.user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No profile found for user %', NEW.user_id;
  END IF;

  NEW.display_name := p.display_name;
  NEW.username := p.username;
  NEW.avatar_url := p.avatar_url;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_identity_community_posts ON public.community_posts;
CREATE TRIGGER enforce_identity_community_posts
  BEFORE INSERT OR UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.enforce_community_post_identity();

-- 4. Realtime authorization: only authenticated users may subscribe
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can receive community feed broadcasts" ON realtime.messages;
CREATE POLICY "Authenticated users can receive community feed broadcasts"
  ON realtime.messages
  FOR SELECT
  TO authenticated
  USING (true);
