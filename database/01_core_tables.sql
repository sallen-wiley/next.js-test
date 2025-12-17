-- =====================================================
-- Core Tables: Create base database structure
-- =====================================================
-- This file creates the foundational tables for the manuscript review system
-- Run this file first before any other migrations

-- =====================================================
-- Table: user_profiles
-- Purpose: User authentication and role-based access control
-- =====================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text,
  role text DEFAULT 'guest'::text CHECK (role IN ('admin', 'editor', 'designer', 'product_manager', 'reviewer', 'guest')),
  department text,
  permissions text[] DEFAULT '{}'::text[],
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE user_profiles IS 'User authentication and RBAC. Links to Supabase auth.users.';
COMMENT ON COLUMN user_profiles.role IS 'User role: admin, editor, designer, product_manager, reviewer, guest';
COMMENT ON COLUMN user_profiles.permissions IS 'Additional granular permissions array';

-- =====================================================
-- Table: manuscripts
-- Purpose: Manuscript submissions with metadata and workflow status
-- =====================================================

CREATE TABLE IF NOT EXISTS manuscripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  authors text[] NOT NULL DEFAULT '{}'::text[],
  journal text NOT NULL,
  submission_date timestamptz DEFAULT now(),
  doi text,
  abstract text,
  keywords text[] DEFAULT '{}'::text[],
  subject_area text,
  status text DEFAULT 'submitted'::text CHECK (status IN (
    'submitted', 
    'pending_editor_assignment',
    'awaiting_reviewers',
    'under_review',
    'reviews_in_progress',
    'reviews_complete',
    'revision_required',
    'minor_revision',
    'major_revision',
    'conditionally_accepted',
    'accepted',
    'rejected',
    'desk_rejected',
    'withdrawn'
  )),
  version integer DEFAULT 1,
  manuscript_tags text[] DEFAULT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE manuscripts IS 'Manuscript submissions with metadata and workflow status';
COMMENT ON COLUMN manuscripts.status IS 'Workflow status - from submission through final decision';
COMMENT ON COLUMN manuscripts.version IS 'Version number for revision tracking (1 = original submission)';
COMMENT ON COLUMN manuscripts.manuscript_tags IS 'Special classifications: commissioned, rescinded, transparent peer review, transferred, apc edited. NULL = not evaluated, [] = no tags, [...] = has tags';

-- =====================================================
-- Table: potential_reviewers
-- Purpose: Reviewer database with expertise and availability
-- =====================================================

CREATE TABLE IF NOT EXISTS potential_reviewers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  affiliation text NOT NULL,
  department text,
  expertise_areas text[] DEFAULT '{}'::text[],
  current_review_load integer DEFAULT 0,
  max_review_capacity integer DEFAULT 3,
  average_review_time_days integer DEFAULT 21,
  recent_publications integer DEFAULT 0,
  h_index integer,
  last_review_completed date,
  availability_status text DEFAULT 'available'::text CHECK (availability_status IN ('available', 'busy', 'unavailable', 'sabbatical')),

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE potential_reviewers IS 'Reviewer database with expertise, metrics, and availability tracking. Conflicts of interest are manuscript-specific and stored in reviewer_manuscript_matches.';
COMMENT ON COLUMN potential_reviewers.availability_status IS 'Current availability: available, busy, unavailable, sabbatical';
COMMENT ON COLUMN potential_reviewers.response_rate IS 'Percentage of invitations accepted (0.0-1.0)';
COMMENT ON COLUMN potential_reviewers.quality_score IS 'Quality rating based on review history (0.0-1.0)';

-- =====================================================
-- Table: user_manuscripts
-- Purpose: Junction table linking users to manuscripts they manage
-- =====================================================

CREATE TABLE IF NOT EXISTS user_manuscripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  manuscript_id uuid NOT NULL REFERENCES manuscripts(id) ON DELETE CASCADE,
  assigned_date timestamptz DEFAULT now(),
  role text DEFAULT 'editor'::text CHECK (role IN ('editor', 'author', 'collaborator', 'reviewer')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, manuscript_id)
);

COMMENT ON TABLE user_manuscripts IS 'Links users to manuscripts they can manage/view in reviewer dashboard';
COMMENT ON COLUMN user_manuscripts.role IS 'User role for this manuscript: editor, author, collaborator, reviewer';

-- =====================================================
-- Table: reviewer_manuscript_matches
-- Purpose: AI-generated match scores linking reviewers to manuscripts
-- =====================================================

CREATE TABLE IF NOT EXISTS reviewer_manuscript_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manuscript_id uuid REFERENCES manuscripts(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES potential_reviewers(id) ON DELETE CASCADE,
  match_score numeric NOT NULL CHECK (match_score >= 0 AND match_score <= 1),
  calculated_at timestamptz DEFAULT now(),
  conflicts_of_interest text,
  UNIQUE(manuscript_id, reviewer_id)
);

COMMENT ON TABLE reviewer_manuscript_matches IS 'AI-generated match scores for manuscript-reviewer pairs. Powers "Suggested Reviewers" feature.';
COMMENT ON COLUMN reviewer_manuscript_matches.match_score IS 'Match quality score (0.0-1.0) based on expertise, availability, and other factors';
COMMENT ON COLUMN reviewer_manuscript_matches.conflicts_of_interest IS 'Manuscript-specific conflicts of interest for this reviewer (text description)';

-- =====================================================
-- Table: invitation_queue
-- Purpose: Queued reviewer invitations waiting to be sent
-- =====================================================

CREATE TABLE IF NOT EXISTS invitation_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manuscript_id uuid REFERENCES manuscripts(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES potential_reviewers(id) ON DELETE CASCADE,
  queue_position integer NOT NULL,
  created_date timestamptz DEFAULT now(),
  scheduled_send_date timestamptz NOT NULL,
  priority text DEFAULT 'normal'::text CHECK (priority IN ('high', 'normal', 'low')),
  notes text,
  sent boolean DEFAULT false,
  sent_at timestamptz
);

COMMENT ON TABLE invitation_queue IS 'Staging area for reviewer invitations. Reviewers wait here before being sent invitations.';
COMMENT ON COLUMN invitation_queue.queue_position IS 'Order position in queue (lower = higher priority)';
COMMENT ON COLUMN invitation_queue.sent IS 'True when invitation has been sent and moved to review_invitations';

-- =====================================================
-- Table: review_invitations
-- Purpose: Sent reviewer invitations with status tracking
-- =====================================================

CREATE TABLE IF NOT EXISTS review_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manuscript_id uuid REFERENCES manuscripts(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES potential_reviewers(id) ON DELETE CASCADE,
  invited_date timestamptz DEFAULT now(),
  due_date timestamptz NOT NULL,
  status text DEFAULT 'pending'::text CHECK (status IN ('pending', 'accepted', 'declined', 'expired', 'completed', 'overdue')),
  response_date timestamptz,
  invitation_round integer DEFAULT 1,
  notes text,
  reminder_count integer DEFAULT 0,
  estimated_completion_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE review_invitations IS 'Active sent reviewer invitations with status tracking and response management';
COMMENT ON COLUMN review_invitations.status IS 'Invitation status: pending → accepted/declined → completed/overdue';
COMMENT ON COLUMN review_invitations.invitation_round IS 'Round number if multiple reviewer rounds are needed';

-- =====================================================
-- Table: reviewer_metrics
-- Purpose: Historical reviewer performance metrics
-- =====================================================

CREATE TABLE IF NOT EXISTS reviewer_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid UNIQUE REFERENCES potential_reviewers(id) ON DELETE CASCADE,
  total_invitations integer DEFAULT 0,
  total_acceptances integer DEFAULT 0,
  total_completions integer DEFAULT 0,
  average_response_time_hours numeric DEFAULT 0.0,
  average_review_time_days numeric DEFAULT 0.0,
  current_load integer DEFAULT 0,
  last_activity_date timestamptz,
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE reviewer_metrics IS 'Aggregated performance metrics for each reviewer. Updated by system triggers or scheduled jobs.';
COMMENT ON COLUMN reviewer_metrics.average_response_time_hours IS 'Average hours from invitation to acceptance/decline';
COMMENT ON COLUMN reviewer_metrics.average_review_time_days IS 'Average days from acceptance to review submission';

-- =====================================================
-- Indexes for Performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

CREATE INDEX IF NOT EXISTS idx_manuscripts_status ON manuscripts(status);
CREATE INDEX IF NOT EXISTS idx_manuscripts_journal ON manuscripts(journal);
CREATE INDEX IF NOT EXISTS idx_manuscripts_submission_date ON manuscripts(submission_date);
CREATE INDEX IF NOT EXISTS idx_manuscripts_updated_at ON manuscripts(updated_at);

CREATE INDEX IF NOT EXISTS idx_potential_reviewers_email ON potential_reviewers(email);
CREATE INDEX IF NOT EXISTS idx_potential_reviewers_availability ON potential_reviewers(availability_status);

CREATE INDEX IF NOT EXISTS idx_user_manuscripts_user_id ON user_manuscripts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_manuscripts_manuscript_id ON user_manuscripts(manuscript_id);
CREATE INDEX IF NOT EXISTS idx_user_manuscripts_active ON user_manuscripts(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_reviewer_matches_manuscript ON reviewer_manuscript_matches(manuscript_id);
CREATE INDEX IF NOT EXISTS idx_reviewer_matches_reviewer ON reviewer_manuscript_matches(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviewer_matches_score ON reviewer_manuscript_matches(match_score DESC);

CREATE INDEX IF NOT EXISTS idx_invitation_queue_manuscript ON invitation_queue(manuscript_id);
CREATE INDEX IF NOT EXISTS idx_invitation_queue_sent ON invitation_queue(sent) WHERE sent = false;

CREATE INDEX IF NOT EXISTS idx_review_invitations_manuscript ON review_invitations(manuscript_id);
CREATE INDEX IF NOT EXISTS idx_review_invitations_reviewer ON review_invitations(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_review_invitations_status ON review_invitations(status);

CREATE INDEX IF NOT EXISTS idx_reviewer_metrics_reviewer ON reviewer_metrics(reviewer_id);

-- =====================================================
-- Success Message
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE 'Core tables created successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Run 02_rls_policies.sql to set up Row Level Security';
  RAISE NOTICE '  2. Run 03_seed_data.sql (optional) to populate with sample data';
END $$;
