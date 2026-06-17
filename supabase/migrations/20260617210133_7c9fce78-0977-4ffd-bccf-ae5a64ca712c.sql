-- Role infrastructure (was missing from live DB)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own roles" ON public.user_roles;
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

-- Auto-assign 'user' role on signup
CREATE OR REPLACE FUNCTION public.assign_default_user_role()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_assign_default_user_role ON auth.users;
CREATE TRIGGER trg_assign_default_user_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_default_user_role();

-- Backfill: anyone already in auth.users with no role gets 'user'; ceo gets 'admin'
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'user'::public.app_role FROM auth.users
ON CONFLICT DO NOTHING;
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users WHERE email = 'emysan.ceo@gmail.com'
ON CONFLICT DO NOTHING;


-- =====================================================
-- M3 trust layer tables
-- =====================================================

CREATE TABLE IF NOT EXISTS public.mentor_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','verified','rejected')),
  id_check BOOLEAN NOT NULL DEFAULT false,
  qualification_check BOOLEAN NOT NULL DEFAULT false,
  background_check BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.mentor_verifications TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.mentor_verifications TO authenticated;
GRANT ALL ON public.mentor_verifications TO service_role;
ALTER TABLE public.mentor_verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Verifications readable by everyone"
  ON public.mentor_verifications FOR SELECT USING (true);
CREATE POLICY "Admins insert verifications"
  ON public.mentor_verifications FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins update verifications"
  ON public.mentor_verifications FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins delete verifications"
  ON public.mentor_verifications FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE TRIGGER trg_mentor_verifications_updated
  BEFORE UPDATE ON public.mentor_verifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


CREATE TABLE IF NOT EXISTS public.parent_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL DEFAULT 'parent',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','verified','revoked')),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (parent_user_id, student_user_id),
  CHECK (parent_user_id <> student_user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.parent_links TO authenticated;
GRANT ALL ON public.parent_links TO service_role;
ALTER TABLE public.parent_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents and students see own links"
  ON public.parent_links FOR SELECT TO authenticated
  USING (auth.uid() = parent_user_id OR auth.uid() = student_user_id);
CREATE POLICY "Parents create own link requests"
  ON public.parent_links FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = parent_user_id);
CREATE POLICY "Parties update own link"
  ON public.parent_links FOR UPDATE TO authenticated
  USING (auth.uid() = parent_user_id OR auth.uid() = student_user_id)
  WITH CHECK (auth.uid() = parent_user_id OR auth.uid() = student_user_id);
CREATE TRIGGER trg_parent_links_updated
  BEFORE UPDATE ON public.parent_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_parent_links_parent ON public.parent_links(parent_user_id);
CREATE INDEX IF NOT EXISTS idx_parent_links_student ON public.parent_links(student_user_id);


CREATE OR REPLACE FUNCTION public.is_verified_parent_of(_student_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.parent_links
    WHERE parent_user_id = auth.uid()
      AND student_user_id = _student_user_id
      AND status = 'verified'
  );
$$;
GRANT EXECUTE ON FUNCTION public.is_verified_parent_of(UUID) TO authenticated;


CREATE TABLE IF NOT EXISTS public.mentor_session_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentor_id UUID,
  student_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes INTEGER,
  topics_covered TEXT[] NOT NULL DEFAULT '{}',
  strengths TEXT,
  growth_areas TEXT,
  homework TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentor_session_notes TO authenticated;
GRANT ALL ON public.mentor_session_notes TO service_role;
ALTER TABLE public.mentor_session_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mentor, parent, or admin reads notes"
  ON public.mentor_session_notes FOR SELECT TO authenticated
  USING (
    auth.uid() = mentor_user_id
    OR (student_user_id IS NOT NULL AND public.is_verified_parent_of(student_user_id))
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  );
CREATE POLICY "Mentors insert own notes"
  ON public.mentor_session_notes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = mentor_user_id);
CREATE POLICY "Mentors update own notes"
  ON public.mentor_session_notes FOR UPDATE TO authenticated
  USING (auth.uid() = mentor_user_id)
  WITH CHECK (auth.uid() = mentor_user_id);
CREATE POLICY "Mentors delete own notes"
  ON public.mentor_session_notes FOR DELETE TO authenticated
  USING (auth.uid() = mentor_user_id);
CREATE TRIGGER trg_session_notes_updated
  BEFORE UPDATE ON public.mentor_session_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_session_notes_mentor ON public.mentor_session_notes(mentor_user_id, session_date DESC);
CREATE INDEX IF NOT EXISTS idx_session_notes_student ON public.mentor_session_notes(student_user_id, session_date DESC);