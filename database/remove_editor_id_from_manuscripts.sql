-- Remove legacy editor_id column; academic editors are tracked in user_manuscripts (role = 'editor').
BEGIN;
  -- Drop trigger/function that referenced the legacy column
  DROP TRIGGER IF EXISTS on_manuscript_created ON manuscripts;
  DROP FUNCTION IF EXISTS assign_manuscript_creator();

  ALTER TABLE manuscripts DROP COLUMN IF EXISTS editor_id;
  DROP INDEX IF EXISTS idx_manuscripts_editor;
COMMIT;
