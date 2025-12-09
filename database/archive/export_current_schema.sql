-- ============================================================================
-- SUPABASE SCHEMA EXPORT QUERY
-- ============================================================================
-- Run this query in Supabase SQL Editor to get the current schema details
-- Copy the results and update reference/database-schema-export.md
-- ============================================================================

-- Part 1: List all tables in the public schema
SELECT 
    'TABLE: ' || tablename as object_type,
    tablename as name
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Part 2: Get detailed column information for each table
SELECT 
    table_name,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default,
    CASE 
        WHEN data_type = 'ARRAY' THEN 'ARRAY'
        WHEN data_type = 'USER-DEFINED' THEN udt_name
        ELSE data_type
    END as display_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'manuscripts',
    'potential_reviewers',
    'review_invitations',
    'invitation_queue',
    'reviewer_manuscript_matches',
    'user_profiles',
    'user_manuscripts',
    'reviewer_metrics'
  )
ORDER BY table_name, ordinal_position;

-- Part 3: Get CHECK constraints (for status values, etc.)
SELECT
    tc.table_name,
    tc.constraint_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.constraint_type = 'CHECK'
ORDER BY tc.table_name;

-- Part 4: Get UNIQUE constraints
SELECT
    tc.table_name,
    tc.constraint_name,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.constraint_type = 'UNIQUE'
ORDER BY tc.table_name;

-- Part 5: Get foreign key relationships
SELECT
    tc.table_name as from_table,
    kcu.column_name as from_column,
    ccu.table_name AS to_table,
    ccu.column_name AS to_column,
    tc.constraint_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- Part 6: Get RLS policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Part 7: Check if tables exist (quick verification)
SELECT 
    tablename,
    CASE 
        WHEN tablename IN (
            SELECT tablename FROM pg_tables WHERE schemaname = 'public'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM (
    VALUES 
        ('manuscripts'),
        ('potential_reviewers'),
        ('review_invitations'),
        ('invitation_queue'),
        ('reviewer_manuscript_matches'),
        ('user_profiles'),
        ('user_manuscripts'),
        ('reviewer_metrics')
) AS expected(tablename)
ORDER BY tablename;
