-- Update manuscript_tags to allow NULL as default instead of empty array
-- This provides semantic distinction:
--   NULL = tags not yet evaluated/set
--   []   = evaluated with no applicable tags
--   [...] = has tags

-- Change the default value for new rows
ALTER TABLE manuscripts
ALTER COLUMN manuscript_tags SET DEFAULT NULL;

-- Update the column comment
COMMENT ON COLUMN manuscripts.manuscript_tags IS 
'Special manuscript classifications: commissioned, rescinded, transparent peer review, transferred, apc edited. NULL = not yet evaluated, [] = evaluated with no tags, [...] = has specific tags';

-- Optional: If you want to convert existing empty arrays to NULL
-- (Only run this if you want to retroactively apply the NULL semantic)
-- UPDATE manuscripts 
-- SET manuscript_tags = NULL 
-- WHERE manuscript_tags = '{}' OR manuscript_tags IS NULL;
