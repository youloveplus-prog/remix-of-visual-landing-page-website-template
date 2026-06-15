
CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  display_name text NOT NULL,
  username text NOT NULL,
  avatar_url text,
  content text NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  product_id text,
  likes int NOT NULL DEFAULT 0,
  comments int NOT NULL DEFAULT 0,
  shares int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX community_posts_created_at_idx ON public.community_posts (created_at DESC);

GRANT SELECT ON public.community_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;
GRANT ALL ON public.community_posts TO service_role;

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read community posts"
  ON public.community_posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create their own posts"
  ON public.community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authors can update their own posts"
  ON public.community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone signed in can bump engagement counts"
  ON public.community_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authors can delete their own posts"
  ON public.community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_community_posts_updated_at
BEFORE UPDATE ON public.community_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.community_posts REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;

INSERT INTO public.community_posts (user_id, display_name, username, avatar_url, content, images, likes, comments, shares, created_at) VALUES
(gen_random_uuid(), 'Sarah Learns', 'sarah_learns', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop', 'Just finished the AI Masterclass on Asikon — the AI tutor cleared up every doubt I had! 🚀 #learning #ai', ARRAY['https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80'], 2400, 45, 12, now() - interval '2 hours'),
(gen_random_uuid(), 'Sophia Vance', 'sophia_v', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop', 'My weekly study haul: new books + the Python course. Asikon recommended all of these for my goals 📚💫', ARRAY['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=900&q=80','https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=900&q=80'], 1850, 89, 34, now() - interval '5 hours'),
(gen_random_uuid(), 'Rahim Study', 'rahim_study', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop', 'Day 30 of the AI roadmap — sharing my full setup, notes and prompt library 🧠', ARRAY['https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80','https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&q=80'], 3120, 142, 58, now() - interval '1 day'),
(gen_random_uuid(), 'Maya Chen', 'maya_codes', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop', 'Shipped my first AI app today! Huge thanks to the Asikon community for the feedback 🙌', ARRAY['https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&q=80'], 980, 67, 21, now() - interval '8 hours'),
(gen_random_uuid(), 'Daniel Park', 'dan_park', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop', 'Best prompt-engineering tips from this week''s live session — saving these forever ✍️', ARRAY['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&q=80'], 1420, 38, 17, now() - interval '12 hours'),
(gen_random_uuid(), 'Aisha Rahman', 'aisha_r', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop', 'The mentorship program changed how my daughter studies. Highly recommend the waitlist 🌟', ARRAY['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80'], 2210, 94, 41, now() - interval '18 hours');
