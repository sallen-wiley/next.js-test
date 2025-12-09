-- Migration: Add Version Column to Manuscripts
-- Date: 2025-12-09
-- Description: Adds version tracking to manuscripts table

-- Step 1: Add version column with default value of 1
ALTER TABLE manuscripts
ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;

-- Step 2: Add check constraint to ensure version is positive
ALTER TABLE manuscripts
ADD CONSTRAINT manuscripts_version_check
CHECK (version > 0);

-- Step 3: Add comment to document the version column
COMMENT ON COLUMN manuscripts.version IS 'Manuscript version number. Increments with each revision submission. Default is 1 for initial submission.';

-- Verify the column was added
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'manuscripts' 
  AND column_name = 'version';
