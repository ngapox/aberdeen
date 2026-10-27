-- =============================================================================
-- ABERDEEN DAYCARE AND NURSERY SCHOOL - SUPABASE POSTGRESQL SCHEMA & RLS
-- Optimized strictly for Supabase Free Tier (Structured Relational Text Only)
-- =============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL UNIQUE CHECK (phone_number ~ '^\+255[0-9]{9}$'),
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'owner', 'secretary', 'teacher', 'parent')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. CLASSES TABLE (Developmental Stages: Step 1, Step 2, Step 3)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE CHECK (name IN ('step_1', 'step_2', 'step_3')),
  display_name TEXT NOT NULL
);

-- Seed the 3 official classes
INSERT INTO public.classes (name, display_name)
VALUES
  ('step_1', 'Step 1 (Daycare / Early Toddler)'),
  ('step_2', 'Step 2 (Nursery / Mid Toddler)'),
  ('step_3', 'Step 3 (Pre-Unit / Transition to Primary)')
ON CONFLICT (name) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. TEACHER ASSIGNMENTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teacher_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  UNIQUE (teacher_id, class_id)
);

-- -----------------------------------------------------------------------------
-- 4. PUPILS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pupils (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pupil_name TEXT NOT NULL,
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  parent_name TEXT NOT NULL,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE RESTRICT,
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. INVOICES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no TEXT NOT NULL UNIQUE,
  pupil_id UUID NOT NULL REFERENCES public.pupils(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (amount_paid >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid')),
  due_date DATE NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. DAILY DIARIES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_diaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pupil_id UUID NOT NULL REFERENCES public.pupils(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  activities_learned TEXT NOT NULL,
  homework TEXT NOT NULL DEFAULT '',
  parent_signed BOOLEAN NOT NULL DEFAULT FALSE,
  parent_signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (pupil_id, entry_date)
);

-- -----------------------------------------------------------------------------
-- 7. DIARY COMMENTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.diary_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_id UUID NOT NULL REFERENCES public.daily_diaries(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. WEEKLY PROGRESS REPORTS TABLE (Structured Text for Free-Tier Efficiency)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weekly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pupil_id UUID NOT NULL REFERENCES public.pupils(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  week_ending DATE NOT NULL,
  literacy_numeracy_notes TEXT NOT NULL,
  social_emotional_notes TEXT NOT NULL,
  teacher_remark TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'reviewed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (pupil_id, week_ending)
);

-- -----------------------------------------------------------------------------
-- 9. FORUM POSTS TABLE (NULL class_id = Main School Forum, UUID = Step Forum)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 10. NOTIFICATIONS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- HELPER FUNCTIONS FOR RLS POLICIES
-- =============================================================================

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_owner()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'owner')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_secretary()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'secretary'
  );
$$;

CREATE OR REPLACE FUNCTION public.teacher_has_class(target_class_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.teacher_assignments
    WHERE teacher_id = auth.uid() AND class_id = target_class_id
  );
$$;

CREATE OR REPLACE FUNCTION public.parent_has_class(target_class_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.pupils
    WHERE parent_id = auth.uid() AND class_id = target_class_id AND is_active = TRUE
  );
$$;

-- =============================================================================
-- AUTOMATIC NOTIFICATION TRIGGER ON PARENT DIARY COMMENT
-- Triggers in-app notification to the Pupil's Teacher and Admin/Owner
-- =============================================================================
CREATE OR REPLACE FUNCTION public.notify_on_diary_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pupil_name TEXT;
  v_teacher_id UUID;
  v_sender_role TEXT;
  v_sender_name TEXT;
  v_admin RECORD;
BEGIN
  SELECT role, full_name INTO v_sender_role, v_sender_name
  FROM public.profiles
  WHERE id = NEW.sender_id;

  SELECT p.pupil_name, d.teacher_id
  INTO v_pupil_name, v_teacher_id
  FROM public.daily_diaries d
  JOIN public.pupils p ON p.id = d.pupil_id
  WHERE d.id = NEW.diary_id;

  IF v_sender_role = 'parent' THEN
    -- Notify the assigned teacher
    IF v_teacher_id IS NOT NULL THEN
      INSERT INTO public.notifications (recipient_id, title, message)
      VALUES (
        v_teacher_id,
        'New Parent Diary Comment: ' || v_pupil_name,
        v_sender_name || ' commented on ' || v_pupil_name || '''s diary: "' || LEFT(NEW.comment, 120) || '"'
      );
    END IF;

    -- Notify all Admin and Owner accounts
    FOR v_admin IN SELECT id FROM public.profiles WHERE role IN ('admin', 'owner')
    LOOP
      INSERT INTO public.notifications (recipient_id, title, message)
      VALUES (
        v_admin.id,
        'Parent Comment (' || v_pupil_name || ')',
        v_sender_name || ' commented on ' || v_pupil_name || '''s daily diary.'
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_on_diary_comment ON public.diary_comments;
CREATE TRIGGER trg_notify_on_diary_comment
AFTER INSERT ON public.diary_comments
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_diary_comment();

-- =============================================================================
-- ENABLE ROW LEVEL SECURITY ACROSS ALL TABLES
-- =============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pupils ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- RLS: PROFILES
-- -----------------------------------------------------------------------------
CREATE POLICY "Admin and Owner full access on profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin_or_owner())
  WITH CHECK (public.is_admin_or_owner());

CREATE POLICY "Secretary can view and create parent profiles"
  ON public.profiles FOR SELECT
  USING (public.is_secretary());

CREATE POLICY "Secretary can insert parent profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (public.is_secretary() AND role = 'parent');

CREATE POLICY "Authenticated users can view basic profiles"
  ON public.profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- -----------------------------------------------------------------------------
-- RLS: CLASSES
-- -----------------------------------------------------------------------------
CREATE POLICY "Anyone can view classes"
  ON public.classes FOR SELECT
  USING (TRUE);

CREATE POLICY "Admin and Owner manage classes"
  ON public.classes FOR ALL
  USING (public.is_admin_or_owner())
  WITH CHECK (public.is_admin_or_owner());

-- -----------------------------------------------------------------------------
-- RLS: TEACHER ASSIGNMENTS
-- -----------------------------------------------------------------------------
CREATE POLICY "Admin and Owner full access on teacher_assignments"
  ON public.teacher_assignments FOR ALL
  USING (public.is_admin_or_owner())
  WITH CHECK (public.is_admin_or_owner());

CREATE POLICY "Teachers and Secretary can view teacher_assignments"
  ON public.teacher_assignments FOR SELECT
  USING (teacher_id = auth.uid() OR public.is_secretary());

-- -----------------------------------------------------------------------------
-- RLS: PUPILS
-- - Admin & Owner: Full CRUD
-- - Secretary: Select, Insert, Update pupils
-- - Teacher: Select pupils in their assigned class only
-- - Parent: Select only their own enrolled children (parent_id = auth.uid())
-- -----------------------------------------------------------------------------
CREATE POLICY "Admin and Owner full access on pupils"
  ON public.pupils FOR ALL
  USING (public.is_admin_or_owner())
  WITH CHECK (public.is_admin_or_owner());

CREATE POLICY "Secretary can view and manage pupils"
  ON public.pupils FOR ALL
  USING (public.is_secretary())
  WITH CHECK (public.is_secretary());

CREATE POLICY "Teachers can view pupils in assigned class"
  ON public.pupils FOR SELECT
  USING (
    public.current_user_role() = 'teacher'
    AND public.teacher_has_class(class_id)
  );

CREATE POLICY "Parents can view only their own pupils"
  ON public.pupils FOR SELECT
  USING (parent_id = auth.uid());

-- -----------------------------------------------------------------------------
-- RLS: INVOICES
-- - Admin, Owner & Secretary: Full CRUD
-- - Parent: Select invoices where pupil belongs to parent_id = auth.uid()
-- -----------------------------------------------------------------------------
CREATE POLICY "Admin Owner Secretary full access on invoices"
  ON public.invoices FOR ALL
  USING (public.is_admin_or_owner() OR public.is_secretary())
  WITH CHECK (public.is_admin_or_owner() OR public.is_secretary());

CREATE POLICY "Parents can view invoices for their own pupils"
  ON public.invoices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pupils p
      WHERE p.id = invoices.pupil_id AND p.parent_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- RLS: DAILY DIARIES
-- - Admin & Owner: Full CRUD
-- - Teacher: Select, Insert, Update diaries only for pupils in their assigned class
-- - Parent: Select & Update (sign-off) diaries where pupil.parent_id = auth.uid()
-- -----------------------------------------------------------------------------
CREATE POLICY "Admin and Owner full access on daily_diaries"
  ON public.daily_diaries FOR ALL
  USING (public.is_admin_or_owner())
  WITH CHECK (public.is_admin_or_owner());

CREATE POLICY "Teachers can view diaries in their assigned class"
  ON public.daily_diaries FOR SELECT
  USING (
    public.current_user_role() = 'teacher'
    AND EXISTS (
      SELECT 1 FROM public.pupils p
      WHERE p.id = daily_diaries.pupil_id
        AND public.teacher_has_class(p.class_id)
    )
  );

CREATE POLICY "Teachers can insert diaries in their assigned class"
  ON public.daily_diaries FOR INSERT
  WITH CHECK (
    public.current_user_role() = 'teacher'
    AND teacher_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.pupils p
      WHERE p.id = daily_diaries.pupil_id
        AND public.teacher_has_class(p.class_id)
    )
  );

CREATE POLICY "Teachers can update diaries in their assigned class"
  ON public.daily_diaries FOR UPDATE
  USING (
    public.current_user_role() = 'teacher'
    AND EXISTS (
      SELECT 1 FROM public.pupils p
      WHERE p.id = daily_diaries.pupil_id
        AND public.teacher_has_class(p.class_id)
    )
  )
  WITH CHECK (
    public.current_user_role() = 'teacher'
    AND EXISTS (
      SELECT 1 FROM public.pupils p
      WHERE p.id = daily_diaries.pupil_id
        AND public.teacher_has_class(p.class_id)
    )
  );

CREATE POLICY "Parents can view diaries for their own pupils"
  ON public.daily_diaries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pupils p
      WHERE p.id = daily_diaries.pupil_id AND p.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can sign off diaries for their own pupils"
  ON public.daily_diaries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.pupils p
      WHERE p.id = daily_diaries.pupil_id AND p.parent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pupils p
      WHERE p.id = daily_diaries.pupil_id AND p.parent_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- RLS: DIARY COMMENTS
-- -----------------------------------------------------------------------------
CREATE POLICY "Admin and Owner full access on diary_comments"
  ON public.diary_comments FOR ALL
  USING (public.is_admin_or_owner())
  WITH CHECK (public.is_admin_or_owner());

CREATE POLICY "Teachers can view and reply to diary comments in assigned class"
  ON public.diary_comments FOR SELECT
  USING (
    public.current_user_role() = 'teacher'
    AND EXISTS (
      SELECT 1 FROM public.daily_diaries d
      JOIN public.pupils p ON p.id = d.pupil_id
      WHERE d.id = diary_comments.diary_id
        AND public.teacher_has_class(p.class_id)
    )
  );

CREATE POLICY "Teachers can insert diary comments in assigned class"
  ON public.diary_comments FOR INSERT
  WITH CHECK (
    public.current_user_role() = 'teacher'
    AND sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.daily_diaries d
      JOIN public.pupils p ON p.id = d.pupil_id
      WHERE d.id = diary_comments.diary_id
        AND public.teacher_has_class(p.class_id)
    )
  );

CREATE POLICY "Parents can view and insert comments on their child's diary"
  ON public.diary_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.daily_diaries d
      JOIN public.pupils p ON p.id = d.pupil_id
      WHERE d.id = diary_comments.diary_id
        AND p.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can insert comments on their child's diary"
  ON public.diary_comments FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.daily_diaries d
      JOIN public.pupils p ON p.id = d.pupil_id
      WHERE d.id = diary_comments.diary_id
        AND p.parent_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- RLS: WEEKLY REPORTS
-- -----------------------------------------------------------------------------
CREATE POLICY "Admin and Owner full access on weekly_reports"
  ON public.weekly_reports FOR ALL
  USING (public.is_admin_or_owner())
  WITH CHECK (public.is_admin_or_owner());

CREATE POLICY "Teachers can manage weekly reports for assigned class"
  ON public.weekly_reports FOR ALL
  USING (
    public.current_user_role() = 'teacher'
    AND EXISTS (
      SELECT 1 FROM public.pupils p
      WHERE p.id = weekly_reports.pupil_id
        AND public.teacher_has_class(p.class_id)
    )
  )
  WITH CHECK (
    public.current_user_role() = 'teacher'
    AND EXISTS (
      SELECT 1 FROM public.pupils p
      WHERE p.id = weekly_reports.pupil_id
        AND public.teacher_has_class(p.class_id)
    )
  );

CREATE POLICY "Parents can view weekly reports for their own pupils"
  ON public.weekly_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pupils p
      WHERE p.id = weekly_reports.pupil_id AND p.parent_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- RLS: FORUM POSTS
-- - Admin, Owner & Secretary: Full access & moderation across all forums
-- - Teachers: Access Main Forum (class_id IS NULL) and assigned Step Forum
-- - Parents: Access Main Forum (class_id IS NULL) and their child's Step Forum
-- -----------------------------------------------------------------------------
CREATE POLICY "Admin Owner Secretary full access on forum_posts"
  ON public.forum_posts FOR ALL
  USING (public.is_admin_or_owner() OR public.is_secretary())
  WITH CHECK (public.is_admin_or_owner() OR public.is_secretary());

CREATE POLICY "Teachers can view Main Forum and assigned Step Forum"
  ON public.forum_posts FOR SELECT
  USING (
    public.current_user_role() = 'teacher'
    AND (class_id IS NULL OR public.teacher_has_class(class_id))
  );

CREATE POLICY "Teachers can post to Main Forum and assigned Step Forum"
  ON public.forum_posts FOR INSERT
  WITH CHECK (
    public.current_user_role() = 'teacher'
    AND author_id = auth.uid()
    AND (class_id IS NULL OR public.teacher_has_class(class_id))
  );

CREATE POLICY "Parents can view Main Forum and child Step Forum"
  ON public.forum_posts FOR SELECT
  USING (
    public.current_user_role() = 'parent'
    AND (class_id IS NULL OR public.parent_has_class(class_id))
  );

CREATE POLICY "Parents can post to Main Forum and child Step Forum"
  ON public.forum_posts FOR INSERT
  WITH CHECK (
    public.current_user_role() = 'parent'
    AND author_id = auth.uid()
    AND (class_id IS NULL OR public.parent_has_class(class_id))
  );

-- -----------------------------------------------------------------------------
-- RLS: NOTIFICATIONS
-- -----------------------------------------------------------------------------
CREATE POLICY "Admin and Owner full access on notifications"
  ON public.notifications FOR ALL
  USING (public.is_admin_or_owner())
  WITH CHECK (public.is_admin_or_owner());

CREATE POLICY "Secretary can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (public.is_secretary());

CREATE POLICY "Users can view and mark their own notifications read"
  ON public.notifications FOR SELECT
  USING (recipient_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());
