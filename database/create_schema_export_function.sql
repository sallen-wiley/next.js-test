-- Create a function to export schema metadata
-- Run this once in Supabase SQL Editor to enable the export script

CREATE OR REPLACE FUNCTION public.get_schema_metadata()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
AS $$
-- 1) Helper: get row counts for public tables (fast approximate via pg_class.reltuples)
WITH tbls AS (
  SELECT c.oid, n.nspname AS schema_name, c.relname AS table_name
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind = 'r'
),

row_counts AS (
  SELECT
    tbl.oid,
    COALESCE((pg_class.reltuples)::bigint, 0) AS approx_row_count
  FROM tbls tbl
  LEFT JOIN pg_class ON pg_class.oid = tbl.oid
),

-- 2) Columns and attributes
cols AS (
  SELECT
    n.nspname AS table_schema,
    c.relname AS table_name,
    a.attname AS column_name,
    pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type,
    CASE WHEN a.attnotnull THEN false ELSE true END AS is_nullable,
    pg_get_expr(ad.adbin, ad.adrelid) AS column_default,
    (a.attidentity <> '' ) AS is_identity,
    a.attnum
  FROM pg_attribute a
  JOIN pg_class c ON c.oid = a.attrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  LEFT JOIN pg_attrdef ad ON ad.adrelid = a.attrelid AND ad.adnum = a.attnum
  WHERE n.nspname = 'public' AND c.relkind = 'r' AND a.attnum > 0 AND NOT a.attisdropped
),

-- 3) Primary keys
pks AS (
  SELECT
    n.nspname AS table_schema,
    c.relname AS table_name,
    array_agg(a.attname ORDER BY x.ordinality) AS pk_columns
  FROM pg_index i
  JOIN pg_class c ON c.oid = i.indrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  JOIN unnest(i.indkey) WITH ORDINALITY AS x(attnum, ordinality) ON true
  JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum = x.attnum
  WHERE n.nspname = 'public' AND i.indisprimary
  GROUP BY n.nspname, c.relname
),

-- 4) Unique constraints (column-level)
uniques AS (
  SELECT
    n.nspname AS table_schema,
    c.relname AS table_name,
    array_agg(a.attname ORDER BY x.ordinality) AS unique_columns,
    con.conname AS constraint_name
  FROM pg_constraint con
  JOIN pg_class c ON c.oid = con.conrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  JOIN unnest(con.conkey) WITH ORDINALITY AS x(attnum, ordinality) ON true
  JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum = x.attnum
  WHERE n.nspname = 'public' AND con.contype = 'u'
  GROUP BY n.nspname, c.relname, con.conname
),

-- 5) Check constraints
checks AS (
  SELECT
    n.nspname AS table_schema,
    c.relname AS table_name,
    con.conname AS check_name,
    pg_get_constraintdef(con.oid) AS check_definition
  FROM pg_constraint con
  JOIN pg_class c ON c.oid = con.conrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND con.contype = 'c'
),

-- 6) Foreign keys
fks AS (
  SELECT
    n.nspname AS table_schema,
    src.relname AS table_name,
    con.conname AS constraint_name,
    array_agg(src_att.attname ORDER BY src_pos.ordinality) AS source_columns,
    (rq.nspname || '.' || tgt.relname) AS referenced_table,
    array_agg(tgt_att.attname ORDER BY src_pos.ordinality) AS referenced_columns
  FROM pg_constraint con
  JOIN pg_class src ON src.oid = con.conrelid
  JOIN pg_namespace n ON n.oid = src.relnamespace
  JOIN pg_class tgt ON tgt.oid = con.confrelid
  JOIN pg_namespace rq ON rq.oid = tgt.relnamespace
  JOIN unnest(con.conkey) WITH ORDINALITY AS src_pos(attnum, ordinality) ON true
  JOIN unnest(con.confkey) WITH ORDINALITY AS tgt_pos(attnum, ordinality) ON tgt_pos.ordinality = src_pos.ordinality
  JOIN pg_attribute src_att ON src_att.attrelid = src.oid AND src_att.attnum = src_pos.attnum
  JOIN pg_attribute tgt_att ON tgt_att.attrelid = tgt.oid AND tgt_att.attnum = tgt_pos.attnum
  WHERE n.nspname = 'public' AND con.contype = 'f'
  GROUP BY n.nspname, src.relname, con.conname, rq.nspname, tgt.relname
),

-- 7) Table-level info: RLS enabled
rls AS (
  SELECT
    n.nspname AS table_schema,
    c.relname AS table_name,
    c.relrowsecurity AS rls_enabled
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind = 'r'
)

-- Final assembly: produce JSON
SELECT jsonb_build_object(
  'schema', 'public',
  'generated_at', now(),
  'tables',
  jsonb_agg(
    jsonb_build_object(
      'name', t.table_name,
      'rls_enabled', r.rls_enabled,
      'rows', rc.approx_row_count,
      'primary_keys', COALESCE(p.pk_columns, ARRAY[]::text[]),
      'columns',
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'name', c.column_name,
            'data_type', c.data_type,
            'is_nullable', c.is_nullable,
            'default', c.column_default,
            'is_identity', c.is_identity,
            'ordinal_position', c.attnum,
            'checks', (
              SELECT jsonb_agg(jsonb_build_object('check_name', ch.check_name, 'definition', ch.check_definition))
              FROM checks ch
              WHERE ch.table_schema = c.table_schema AND ch.table_name = c.table_name AND ch.check_definition ILIKE ('%' || c.column_name || '%')
            ),
            'is_unique', (
              SELECT true FROM uniques u
              WHERE u.table_schema = c.table_schema AND u.table_name = c.table_name AND c.column_name = ANY(u.unique_columns) LIMIT 1
            )
          ) ORDER BY c.attnum
        )
        FROM cols c
        WHERE c.table_schema = t.table_schema AND c.table_name = t.table_name
      ),
      'foreign_keys',
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'constraint_name', f.constraint_name,
            'source_columns', f.source_columns,
            'referenced_table', f.referenced_table,
            'referenced_columns', f.referenced_columns
          )
        )
        FROM fks f
        WHERE f.table_schema = t.table_schema AND f.table_name = t.table_name
      )
    ) ORDER BY t.table_name
  )
)
FROM (
  SELECT n.nspname AS table_schema, c.relname AS table_name, c.oid
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind = 'r'
) t
LEFT JOIN row_counts rc ON rc.oid = t.oid
LEFT JOIN rls r ON r.table_schema = t.table_schema AND r.table_name = t.table_name
LEFT JOIN pks p ON p.table_schema = t.table_schema AND p.table_name = t.table_name;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_schema_metadata() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_schema_metadata() TO service_role;
