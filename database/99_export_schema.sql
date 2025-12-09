-- =====================================================
-- Export Current Database Schema
-- =====================================================
-- This script exports the current schema structure for all tables
-- Run this in Supabase SQL Editor to get current state
-- Copy the results to reference/database-schema-export.md

-- =====================================================
-- Get all table structures
-- =====================================================

SELECT 
  'Table: ' || table_name as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'user_profiles',
    'manuscripts',
    'potential_reviewers',
    'user_manuscripts',
    'reviewer_manuscript_matches',
    'invitation_queue',
    'review_invitations',
    'reviewer_metrics'
  )
ORDER BY table_name, ordinal_position;

-- =====================================================
-- Get all constraints
-- =====================================================

SELECT
  'Constraint: ' || tc.table_name as info,
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.table_schema = 'public'
  AND tc.table_name IN (
    'user_profiles',
    'manuscripts',
    'potential_reviewers',
    'user_manuscripts',
    'reviewer_manuscript_matches',
    'invitation_queue',
    'review_invitations',
    'reviewer_metrics'
  )
ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name;

-- =====================================================
-- Get all indexes
-- =====================================================

SELECT
  'Index: ' || tablename as info,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'user_profiles',
    'manuscripts',
    'potential_reviewers',
    'user_manuscripts',
    'reviewer_manuscript_matches',
    'invitation_queue',
    'review_invitations',
    'reviewer_metrics'
  )
ORDER BY tablename, indexname;

-- =====================================================
-- Get all RLS policies
-- =====================================================

SELECT
  'Policy: ' || tablename as info,
  policyname,
  cmd as operation,
  qual as using_clause,
  with_check as with_check_clause
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'user_profiles',
    'manuscripts',
    'potential_reviewers',
    'user_manuscripts',
    'reviewer_manuscript_matches',
    'invitation_queue',
    'review_invitations',
    'reviewer_metrics'
  )
ORDER BY tablename, policyname;

-- =====================================================
-- Get table row counts
-- =====================================================

SELECT 
  'user_profiles' as table_name,
  COUNT(*) as row_count
FROM user_profiles
UNION ALL
SELECT 'manuscripts', COUNT(*) FROM manuscripts
UNION ALL
SELECT 'potential_reviewers', COUNT(*) FROM potential_reviewers
UNION ALL
SELECT 'user_manuscripts', COUNT(*) FROM user_manuscripts
UNION ALL
SELECT 'reviewer_manuscript_matches', COUNT(*) FROM reviewer_manuscript_matches
UNION ALL
SELECT 'invitation_queue', COUNT(*) FROM invitation_queue
UNION ALL
SELECT 'review_invitations', COUNT(*) FROM review_invitations
UNION ALL
SELECT 'reviewer_metrics', COUNT(*) FROM reviewer_metrics
ORDER BY table_name;
