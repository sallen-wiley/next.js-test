-- Add manuscript_tags column to manuscripts table
-- These are special classifications/attributes separate from workflow status
-- Possible values: commissioned, rescinded, transparent peer review, transferred, apc edited
-- NULL = tags not yet evaluated/set, [] = evaluated with no tags, [...] = has tags

ALTER TABLE manuscripts
ADD COLUMN IF NOT EXISTS manuscript_tags text[] DEFAULT NULL;

COMMENT ON COLUMN manuscripts.manuscript_tags IS 
'Special manuscript classifications: commissioned, rescinded, transparent peer review, transferred, apc edited. NULL = not evaluated, [] = no tags';

-- Example update queries (for reference):
-- For Supabase UI (JSON format):
--   ["commissioned", "transparent peer review"]
-- 
-- For SQL queries:
-- UPDATE manuscripts SET manuscript_tags = '{"commissioned", "transparent peer review"}' WHERE id = 'some-id';
-- UPDATE manuscripts SET manuscript_tags = array_append(manuscript_tags, 'transferred') WHERE id = 'some-id';
-- UPDATE manuscripts SET manuscript_tags = array_remove(manuscript_tags, 'commissioned') WHERE id = 'some-id';
-- Or using ARRAY constructor:
-- UPDATE manuscripts SET manuscript_tags = ARRAY['commissioned', 'transparent peer review']::text[] WHERE id = 'some-id';
