-- =====================================================
-- Database Cleanup: Remove all tables and start fresh
-- =====================================================
-- WARNING: This will delete ALL data in the database
-- Only run this if you want to completely reset the database
-- 
-- Usage:
--   1. Make sure you have backups if needed
--   2. Run this file in Supabase SQL Editor
--   3. Then run 01_core_tables.sql and 02_rls_policies.sql

-- =====================================================
-- Drop all tables in reverse dependency order
-- =====================================================

DROP TABLE IF EXISTS reviewer_metrics CASCADE;
DROP TABLE IF EXISTS review_invitations CASCADE;
DROP TABLE IF EXISTS invitation_queue CASCADE;
DROP TABLE IF EXISTS reviewer_manuscript_matches CASCADE;
DROP TABLE IF EXISTS user_manuscripts CASCADE;
DROP TABLE IF EXISTS potential_reviewers CASCADE;
DROP TABLE IF EXISTS manuscripts CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- =====================================================
-- Drop helper functions
-- =====================================================

DROP FUNCTION IF EXISTS public.has_role(text);
DROP FUNCTION IF EXISTS public.has_any_role(text[]);

-- =====================================================
-- Success Message
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Database cleanup completed!';
  RAISE NOTICE 'All tables and functions have been dropped.';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Run 01_core_tables.sql to recreate tables';
  RAISE NOTICE '  2. Run 02_rls_policies.sql to set up security';
  RAISE NOTICE '  3. Run 03_seed_data.sql for sample data (optional)';
END $$;
