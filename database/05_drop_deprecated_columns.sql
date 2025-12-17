-- ============================================================================
-- DROP DEPRECATED COLUMNS FROM potential_reviewers
-- ============================================================================
-- Removes response_rate and quality_score columns which contained fake
-- exploration data and are no longer needed. Acceptance rate will be
-- calculated from total_acceptances/total_invitations instead.
--
-- Run this migration after 04_move_conflicts_to_matches.sql
-- ============================================================================

ALTER TABLE potential_reviewers
  DROP COLUMN IF EXISTS response_rate,
  DROP COLUMN IF EXISTS quality_score;

-- Update table comment to reflect changes
COMMENT ON TABLE potential_reviewers IS 'Potential peer reviewers with metrics and availability. Acceptance rate calculated from total_acceptances/total_invitations.';
