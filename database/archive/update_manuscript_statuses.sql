-- Migration: Update Manuscript Status Values
-- Date: 2025-12-09
-- Description: Expands manuscript status enum to include full editorial workflow

-- Step 1: Drop the existing CHECK constraint
ALTER TABLE manuscripts
DROP CONSTRAINT IF EXISTS manuscripts_status_check;

-- Step 2: Add the new CHECK constraint with expanded status values
ALTER TABLE manuscripts
ADD CONSTRAINT manuscripts_status_check
CHECK (status = ANY (ARRAY[
  'submitted'::text,
  'pending_editor_assignment'::text,
  'awaiting_reviewers'::text,
  'under_review'::text,
  'reviews_in_progress'::text,
  'reviews_complete'::text,
  'revision_required'::text,
  'minor_revision'::text,
  'major_revision'::text,
  'conditionally_accepted'::text,
  'accepted'::text,
  'rejected'::text,
  'desk_rejected'::text,
  'withdrawn'::text
]));

-- Step 3: Add comment to document the status values
COMMENT ON COLUMN manuscripts.status IS 'Manuscript editorial workflow status. Valid values: submitted, pending_editor_assignment, awaiting_reviewers, under_review, reviews_in_progress, reviews_complete, revision_required, minor_revision, major_revision, conditionally_accepted, accepted, rejected, desk_rejected, withdrawn';

-- Verify the constraint was updated
SELECT 
  tc.constraint_name,
  cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'manuscripts'
  AND cc.check_clause LIKE '%status%';
