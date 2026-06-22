CREATE TABLE public.mentor_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL,
  mentor_name TEXT NOT NULL,
  subject TEXT,
  session_date DATE NOT NULL,
  session_slot TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'requested',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentor_bookings TO authenticated;
GRANT ALL ON public.mentor_bookings TO service_role;

ALTER TABLE public.mentor_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their bookings" ON public.mentor_bookings
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert their bookings" ON public.mentor_bookings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update their bookings" ON public.mentor_bookings
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete their bookings" ON public.mentor_bookings
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage bookings" ON public.mentor_bookings
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX mentor_bookings_user_idx ON public.mentor_bookings(user_id, created_at DESC);
CREATE INDEX mentor_bookings_mentor_idx ON public.mentor_bookings(mentor_id, session_date);

CREATE TRIGGER update_mentor_bookings_updated_at
  BEFORE UPDATE ON public.mentor_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();