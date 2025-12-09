-- =====================================================
-- Row Level Security Policies
-- =====================================================
-- This file sets up RLS policies for all tables
-- Run after 01_core_tables.sql

-- =====================================================
-- Enable RLS on all tables
-- =====================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE manuscripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE potential_reviewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_manuscripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviewer_manuscript_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviewer_metrics ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Helper function: Check if user has specific role
-- =====================================================

CREATE OR REPLACE FUNCTION public.has_role(required_role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role = required_role
  );
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(required_roles text[])
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role = ANY(required_roles)
  );
$$;

-- =====================================================
-- user_profiles: All authenticated users can read profiles
-- =====================================================

-- Allow all authenticated users to read all profiles
CREATE POLICY "read_all_profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert their own profile
CREATE POLICY "insert_own_profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to update own profile OR admins to update any
CREATE POLICY "update_profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR
    has_role('admin')
  )
  WITH CHECK (
    auth.uid() = id OR
    has_role('admin')
  );

-- =====================================================
-- manuscripts: Public read, admin/designer/editor write
-- =====================================================

-- Public read access for all users (no auth required for demo)
CREATE POLICY "public_read_manuscripts"
  ON manuscripts
  FOR SELECT
  TO public
  USING (true);

-- Allow insert for authenticated users (no role restriction for demo)
CREATE POLICY "authenticated_insert_manuscripts"
  ON manuscripts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow update for admin, designer, and editor roles
CREATE POLICY "privileged_update_manuscripts"
  ON manuscripts
  FOR UPDATE
  TO authenticated
  USING (
    has_any_role(ARRAY['admin', 'designer', 'editor'])
  )
  WITH CHECK (
    has_any_role(ARRAY['admin', 'designer', 'editor'])
  );

-- Allow delete for admin and designer roles only
CREATE POLICY "privileged_delete_manuscripts"
  ON manuscripts
  FOR DELETE
  TO authenticated
  USING (
    has_any_role(ARRAY['admin', 'designer'])
  );

-- =====================================================
-- potential_reviewers: Public read, admin/designer write
-- =====================================================

-- Public read access
CREATE POLICY "public_read_reviewers"
  ON potential_reviewers
  FOR SELECT
  TO public
  USING (true);

-- Allow insert for authenticated users (no role restriction for demo)
CREATE POLICY "authenticated_insert_reviewers"
  ON potential_reviewers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow update for admin and designer roles
CREATE POLICY "privileged_update_reviewers"
  ON potential_reviewers
  FOR UPDATE
  TO authenticated
  USING (
    has_any_role(ARRAY['admin', 'designer'])
  )
  WITH CHECK (
    has_any_role(ARRAY['admin', 'designer'])
  );

-- Allow delete for admin and designer roles
CREATE POLICY "privileged_delete_reviewers"
  ON potential_reviewers
  FOR DELETE
  TO authenticated
  USING (
    has_any_role(ARRAY['admin', 'designer'])
  );

-- =====================================================
-- user_manuscripts: Users see own assignments, admins/editors see all
-- =====================================================

-- Users can view their own manuscript assignments
CREATE POLICY "view_own_manuscripts"
  ON user_manuscripts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins and editors can view all assignments
CREATE POLICY "privileged_view_all_manuscripts"
  ON user_manuscripts
  FOR SELECT
  TO authenticated
  USING (
    has_any_role(ARRAY['admin', 'editor'])
  );

-- Admins and editors can create assignments
CREATE POLICY "privileged_insert_assignments"
  ON user_manuscripts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    has_any_role(ARRAY['admin', 'editor'])
  );

-- Admins and editors can update assignments
CREATE POLICY "privileged_update_assignments"
  ON user_manuscripts
  FOR UPDATE
  TO authenticated
  USING (
    has_any_role(ARRAY['admin', 'editor'])
  )
  WITH CHECK (
    has_any_role(ARRAY['admin', 'editor'])
  );

-- Admins can delete assignments
CREATE POLICY "admin_delete_assignments"
  ON user_manuscripts
  FOR DELETE
  TO authenticated
  USING (
    has_role('admin')
  );

-- =====================================================
-- reviewer_manuscript_matches: Public read for suggested reviewers
-- =====================================================

-- Public read access (needed for "Suggested Reviewers" tab)
CREATE POLICY "public_read_matches"
  ON reviewer_manuscript_matches
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can insert matches (for AI scoring system)
CREATE POLICY "authenticated_insert_matches"
  ON reviewer_manuscript_matches
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update matches
CREATE POLICY "authenticated_update_matches"
  ON reviewer_manuscript_matches
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- invitation_queue: Authenticated users can manage queue
-- =====================================================

-- Authenticated users can view queue
CREATE POLICY "authenticated_read_queue"
  ON invitation_queue
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can add to queue
CREATE POLICY "authenticated_insert_queue"
  ON invitation_queue
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update queue (reordering, priority changes)
CREATE POLICY "authenticated_update_queue"
  ON invitation_queue
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete from queue
CREATE POLICY "authenticated_delete_queue"
  ON invitation_queue
  FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- review_invitations: Authenticated users can manage invitations
-- =====================================================

-- Authenticated users can view invitations
CREATE POLICY "authenticated_read_invitations"
  ON review_invitations
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can send invitations
CREATE POLICY "authenticated_insert_invitations"
  ON review_invitations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update invitations (status changes, reminders)
CREATE POLICY "authenticated_update_invitations"
  ON review_invitations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete invitations
CREATE POLICY "authenticated_delete_invitations"
  ON review_invitations
  FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- reviewer_metrics: Public read for reviewer statistics
-- =====================================================

-- Public read access
CREATE POLICY "public_read_metrics"
  ON reviewer_metrics
  FOR SELECT
  TO public
  USING (true);

-- System/authenticated users can update metrics
CREATE POLICY "authenticated_update_metrics"
  ON reviewer_metrics
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- Success Message
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE 'Row Level Security policies created successfully!';
  RAISE NOTICE 'All tables are now protected with appropriate access controls.';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Test access with different user roles';
  RAISE NOTICE '  2. Run 03_seed_data.sql (optional) to populate with sample data';
END $$;
