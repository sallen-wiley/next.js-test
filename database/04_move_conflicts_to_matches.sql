-- =====================================================
-- Migration: Move conflicts_of_interest to reviewer_manuscript_matches
-- =====================================================
-- This migration removes the conflicts_of_interest column from potential_reviewers
-- table since conflicts are manuscript-specific and should be stored in the
-- reviewer_manuscript_matches table instead.

-- The reviewer_manuscript_matches table already has a conflicts_of_interest column
-- (added via data ingestion), so we only need to drop it from potential_reviewers.

-- Drop conflicts_of_interest column from potential_reviewers table
ALTER TABLE potential_reviewers 
DROP COLUMN IF EXISTS conflicts_of_interest;

COMMENT ON TABLE potential_reviewers IS 'Reviewer database with expertise, metrics, and availability tracking. Conflicts of interest are manuscript-specific and stored in reviewer_manuscript_matches.';
