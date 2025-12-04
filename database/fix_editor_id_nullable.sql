-- Make editor_id nullable in manuscripts table
-- This allows manuscripts to be created without an assigned editor

ALTER TABLE manuscripts 
ALTER COLUMN editor_id DROP NOT NULL;

-- Verify the change
SELECT 
  column_name, 
  is_nullable,
  data_type
FROM information_schema.columns
WHERE table_name = 'manuscripts' AND column_name = 'editor_id';
