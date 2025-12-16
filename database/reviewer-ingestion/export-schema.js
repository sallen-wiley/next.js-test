#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * SCHEMA EXPORT SCRIPT
 *
 * Exports comprehensive public schema metadata from Supabase to a dated JSON file.
 *
 * Prerequisites:
 * - Run database/create_schema_export_function.sql once in Supabase SQL Editor
 *   to create the get_schema_metadata() function
 *
 * Features:
 * - Complete table structure (columns, types, constraints)
 * - Primary keys, unique constraints, check constraints
 * - Foreign key relationships
 * - RLS status and row counts
 * - Timestamped output files for version tracking
 *
 * Usage:
 *   node database/reviewer-ingestion/export-schema.js
 *
 * Output:
 *   Creates: database/schema-exports/schema-YYYY-MM-DD-HHMMSS.json
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load environment variables from .env.local in project root
require("dotenv").config({ path: path.join(__dirname, "../../.env.local") });

// ============================================================================
// CONFIGURATION
// ============================================================================

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("ERROR: Missing required environment variables:");
  console.error("  SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)");
  console.error("  SUPABASE_SERVICE_ROLE_KEY");
  console.error("\nThese should already be in your .env.local file.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Output directory for schema exports
const OUTPUT_DIR = path.join(__dirname, "../schema-exports");

// ============================================================================
// NOTE: SCHEMA QUERY NOW IN DATABASE FUNCTION
// ============================================================================
// The schema export query has been moved to a PostgreSQL function.
// Run database/create_schema_export_function.sql in Supabase SQL Editor first.
//
// Old approach (didn't work): Direct PostgreSQL connection
// New approach (works!): Supabase client calling RPC function
//
// This is the same pattern used by the ingest script.
// ============================================================================

// Legacy query kept for reference (if direct PostgreSQL connection is ever needed)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LEGACY_SCHEMA_QUERY = `
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
    -- check for generated/identity will be empty in column_default; mark identity
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
  JOIN unnest(i.indkey) WITH ORDINALITY AS x(attnum, ordinality)
    ON true
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

-- 5) Check constraints (per table/column if possible)
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
) AS public_schema_metadata
FROM (
  SELECT n.nspname AS table_schema, c.relname AS table_name, c.oid
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind = 'r'
) t
LEFT JOIN row_counts rc ON rc.oid = t.oid
LEFT JOIN rls r ON r.table_schema = t.table_schema AND r.table_name = t.table_name
LEFT JOIN pks p ON p.table_schema = t.table_schema AND p.table_name = t.table_name;
`; // End of legacy query (for reference only)

// ============================================================================
// MAIN EXPORT FUNCTION
// ============================================================================

async function exportSchema() {
  console.log("🔍 Starting schema export...\n");

  try {
    // Call the database function via Supabase RPC
    console.log("📊 Calling get_schema_metadata() function...");
    const { data, error } = await supabase.rpc("get_schema_metadata");

    if (error) {
      // Check if function doesn't exist
      if (
        error.message.includes("function") &&
        error.message.includes("does not exist")
      ) {
        console.error("\n❌ Database function not found!\n");
        console.error("📝 Setup required:");
        console.error("  1. Open Supabase SQL Editor");
        console.error(
          "  2. Run the SQL file: database/create_schema_export_function.sql"
        );
        console.error("  3. Try running this script again\n");
        console.error("This is a one-time setup step.");
        process.exit(1);
      }
      throw error;
    }

    if (!data) {
      throw new Error("No schema metadata returned from function");
    }

    const metadata = data;

    console.log(
      `✅ Retrieved schema for ${metadata.tables?.length || 0} tables\n`
    );

    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`📁 Created output directory: ${OUTPUT_DIR}\n`);
    }

    // Generate timestamped filename
    const timestamp = new Date()
      .toISOString()
      .replace(/T/, "-")
      .replace(/:/g, "")
      .replace(/\..+/, "");
    const filename = `schema-${timestamp}.json`;
    const filepath = path.join(OUTPUT_DIR, filename);

    // Write to file with pretty formatting
    fs.writeFileSync(filepath, JSON.stringify(metadata, null, 2), "utf8");

    console.log(`✅ Schema exported successfully!`);
    console.log(`📄 File: ${filepath}`);
    console.log(`📊 Tables: ${metadata.tables?.length || 0}`);
    console.log(`🕐 Generated: ${metadata.generated_at}\n`);

    // Print summary of tables
    if (metadata.tables && metadata.tables.length > 0) {
      console.log("📋 Tables exported:");
      metadata.tables.forEach((table) => {
        const columnCount = table.columns?.length || 0;
        const fkCount = table.foreign_keys?.length || 0;
        const rlsStatus = table.rls_enabled ? "🔒 RLS" : "🔓 No RLS";
        console.log(
          `   - ${table.name.padEnd(35)} (${columnCount} cols, ${
            table.rows
          } rows, ${fkCount} FKs) ${rlsStatus}`
        );
      });
    }

    console.log("\n✨ Export complete!");
  } catch (err) {
    console.error("\n❌ Export failed:", err.message);
    if (err.details) console.error("Details:", err.details);
    if (err.hint) console.error("Hint:", err.hint);
    if (err.code) console.error("Code:", err.code);
    process.exit(1);
  }
}

// ============================================================================
// EXECUTE
// ============================================================================

exportSchema();
