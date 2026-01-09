-- =====================================================
-- Publication Matches: Manuscript-specific publication relevance
-- =====================================================
-- This migration creates a junction table to track which publications
-- are related to which manuscripts, replacing the context-less is_related
-- boolean in reviewer_publications.
--
-- Problem: is_related in reviewer_publications had no manuscript context
-- Solution: Junction table provides proper many-to-many relationship

-- =====================================================
-- Step 1: Create manuscript_publication_matches table
-- =====================================================

CREATE TABLE IF NOT EXISTS manuscript_publication_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manuscript_id uuid NOT NULL REFERENCES manuscripts(id) ON DELETE CASCADE,
  publication_id uuid NOT NULL REFERENCES reviewer_publications(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(manuscript_id, publication_id)
);

COMMENT ON TABLE manuscript_publication_matches IS 'Junction table linking manuscripts to related reviewer publications. Row existence indicates publication is topically related to the manuscript.';
COMMENT ON COLUMN manuscript_publication_matches.manuscript_id IS 'The manuscript this publication is related to';
COMMENT ON COLUMN manuscript_publication_matches.publication_id IS 'The reviewer publication that is relevant to the manuscript';

-- =====================================================
-- Step 2: Create indexes for performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_manuscript_publication_matches_manuscript 
  ON manuscript_publication_matches(manuscript_id);

CREATE INDEX IF NOT EXISTS idx_manuscript_publication_matches_publication 
  ON manuscript_publication_matches(publication_id);

-- =====================================================
-- Step 3: Drop dependent views before removing column
-- =====================================================

DROP VIEW IF EXISTS reviewer_publication_summary CASCADE;

-- =====================================================
-- Step 4: Remove is_related column from reviewer_publications
-- =====================================================

ALTER TABLE reviewer_publications 
  DROP COLUMN IF EXISTS is_related CASCADE;

COMMENT ON TABLE reviewer_publications IS 'Catalog of reviewer publications. Manuscript-specific relevance is tracked in manuscript_publication_matches table.';

-- =====================================================
-- Step 5: Add RLS policies for new table
-- =====================================================

ALTER TABLE manuscript_publication_matches ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read publication matches
CREATE POLICY "Enable read access for all users"
  ON manuscript_publication_matches FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert publication matches
CREATE POLICY "Enable insert for authenticated users"
  ON manuscript_publication_matches FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can delete publication matches
CREATE POLICY "Enable delete for authenticated users"
  ON manuscript_publication_matches FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- Success Message
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Publication matches migration completed!';
  RAISE NOTICE '';
  RAISE NOTICE 'Changes:';
  RAISE NOTICE '  • Created manuscript_publication_matches junction table';
  RAISE NOTICE '  • Removed is_related column from reviewer_publications';
  RAISE NOTICE '  • Added indexes for query performance';
  RAISE NOTICE '  • Enabled RLS policies for authenticated users';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Update ingest script to populate junction table';
  RAISE NOTICE '  2. Update queries that previously filtered by is_related';
  RAISE NOTICE '  3. Run schema export: node database/reviewer-ingestion/export-schema.js';
END $$;
