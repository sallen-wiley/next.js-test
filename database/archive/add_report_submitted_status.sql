-- ============================================================================
-- Migration: Add 'report_submitted' status to review_invitations
-- ============================================================================
-- Date: 2025-12-04
-- Purpose: Extend status values to support report submission tracking
--
-- This migration adds 'report_submitted' to the allowed status values for
-- the review_invitations table. This status indicates that a reviewer has
-- completed and submitted their review report.
--
-- Status Flow:
-- queued → pending → accepted → report_submitted → completed
--                  → declined
--                  → expired
--                  → overdue
-- ============================================================================

-- Drop the existing CHECK constraint
ALTER TABLE review_invitations 
DROP CONSTRAINT IF EXISTS review_invitations_status_check;

-- Add the new CHECK constraint with 'report_submitted' included
ALTER TABLE review_invitations 
ADD CONSTRAINT review_invitations_status_check 
CHECK (
  status IN (
    'pending',          -- Invitation sent, awaiting reviewer response
    'accepted',         -- Reviewer accepted, working on review
    'declined',         -- Reviewer declined the invitation
    'expired',          -- Invitation expired without response
    'completed',        -- Review process fully completed
    'overdue',          -- Review is past due date
    'report_submitted'  -- NEW: Reviewer submitted their report
  )
);

-- Verify the constraint was added successfully
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'review_invitations'::regclass
  AND conname = 'review_invitations_status_check';

-- Show current status values in use (if any data exists)
SELECT 
  status,
  COUNT(*) as count
FROM review_invitations
GROUP BY status
ORDER BY count DESC;

-- Migration complete
SELECT 'Migration completed: report_submitted status added to review_invitations' as result;
