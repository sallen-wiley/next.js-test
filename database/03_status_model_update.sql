-- =============================================
-- Status Model Update Migration
-- =============================================
-- This migration updates the review invitation status model to:
-- 1. Add invitation_expiration_date for tracking when pending invitations expire
-- 2. Add report_invalidated_date for tracking when reports are invalidated
-- 3. Add notes field for capturing reasons for status changes
-- 4. Update status constraint to new model (removes derived states like 'expired', 'overdue', 'completed')
-- 5. Migrate existing data to new status values

-- =============================================
-- STEP 1: Add new columns
-- =============================================

-- Add invitation expiration tracking
ALTER TABLE review_invitations
ADD COLUMN IF NOT EXISTS invitation_expiration_date TIMESTAMP WITH TIME ZONE;

-- Add invalidation tracking
ALTER TABLE review_invitations
ADD COLUMN IF NOT EXISTS report_invalidated_date TIMESTAMP WITH TIME ZONE;

-- Add notes for status changes (e.g., reason for invalidation, cancellation notes)
ALTER TABLE review_invitations
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Set default expiration date for existing pending invitations (14 days from invited_date)
UPDATE review_invitations
SET invitation_expiration_date = invited_date + INTERVAL '14 days'
WHERE status = 'pending' 
  AND invitation_expiration_date IS NULL;

-- =============================================
-- STEP 2: Migrate existing data
-- =============================================

-- Migrate 'completed' → 'report_submitted'
UPDATE review_invitations
SET status = 'report_submitted'
WHERE status = 'completed';

-- Migrate 'overdue' → 'accepted' (keep due_date to derive overdue status at runtime)
UPDATE review_invitations
SET status = 'accepted'
WHERE status = 'overdue';

-- Migrate 'expired' → 'pending' with past invitation_expiration_date
UPDATE review_invitations
SET 
  status = 'pending',
  invitation_expiration_date = COALESCE(
    invitation_expiration_date,
    invited_date + INTERVAL '14 days'
  )
WHERE status = 'expired';

-- =============================================
-- STEP 3: Update status constraint
-- =============================================

-- Drop old constraint
ALTER TABLE review_invitations
DROP CONSTRAINT IF EXISTS review_invitations_status_check;

-- Add new constraint with updated status values
ALTER TABLE review_invitations
ADD CONSTRAINT review_invitations_status_check
CHECK (status IN (
  'pending',           -- Invitation sent, awaiting response
  'accepted',          -- Reviewer accepted (may become overdue if past due_date)
  'declined',          -- Reviewer declined invitation
  'report_submitted',  -- Review report submitted
  'invalidated',       -- Report invalidated by editor (can be reinstated)
  'revoked'            -- Invitation revoked/cancelled by editor
));

-- =============================================
-- STEP 4: Add helpful indexes
-- =============================================

-- Index for finding expired invitations (pending + past expiration date)
CREATE INDEX IF NOT EXISTS idx_review_invitations_pending_expiration 
ON review_invitations(status, invitation_expiration_date)
WHERE status = 'pending';

-- Index for finding overdue reviews (accepted + past due date)
CREATE INDEX IF NOT EXISTS idx_review_invitations_accepted_due 
ON review_invitations(status, due_date)
WHERE status = 'accepted';

-- Index for invalidated reports
CREATE INDEX IF NOT EXISTS idx_review_invitations_invalidated 
ON review_invitations(status, report_invalidated_date)
WHERE status = 'invalidated';

-- =============================================
-- STEP 5: Add helpful comments
-- =============================================

COMMENT ON COLUMN review_invitations.invitation_expiration_date IS 
'Date when pending invitation expires (typically 14 days from invited_date). Used to derive "expired" status at runtime.';

COMMENT ON COLUMN review_invitations.report_invalidated_date IS 
'Date when report was invalidated by editor. Only set when status = invalidated.';

COMMENT ON COLUMN review_invitations.notes IS 
'Free-form notes for status changes (e.g., reason for invalidation, cancellation notes, revocation reason).';

COMMENT ON COLUMN review_invitations.status IS 
'Current invitation status. Note: "overdue" and "expired" are derived at runtime, not stored. Overdue = accepted AND due_date < now(). Expired = pending AND invitation_expiration_date < now().';

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Verify migration results (uncomment to run checks)
-- SELECT status, COUNT(*) FROM review_invitations GROUP BY status ORDER BY status;
-- SELECT COUNT(*) as total_invitations FROM review_invitations;
-- SELECT COUNT(*) as pending_without_expiration FROM review_invitations WHERE status = 'pending' AND invitation_expiration_date IS NULL;
