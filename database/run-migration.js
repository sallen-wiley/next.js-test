#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * RUN SQL MIGRATION SCRIPT
 *
 * Executes a SQL migration file against the Supabase database.
 * Useful for running migration scripts that can't use the Supabase migration system.
 *
 * Usage:
 *   node database/run-migration.js <path-to-sql-file>
 *
 * Example:
 *   node database/run-migration.js database/05_drop_deprecated_columns.sql
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: path.join(__dirname, "../.env.local") });

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("ERROR: Missing required environment variables");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runMigration(sqlFilePath) {
  try {
    console.log(`📂 Reading SQL file: ${sqlFilePath}`);
    const sql = fs.readFileSync(sqlFilePath, "utf8");

    console.log(`🚀 Executing migration...`);
    const { error } = await supabase.rpc("exec_sql", { sql_string: sql });

    if (error) {
      console.error("❌ Migration failed:", error.message);
      if (error.details) console.error("Details:", error.details);
      if (error.hint) console.error("Hint:", error.hint);
      process.exit(1);
    }

    console.log("✅ Migration completed successfully!");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

// Get SQL file path from command line
const sqlFile = process.argv[2];
if (!sqlFile) {
  console.error("Usage: node run-migration.js <path-to-sql-file>");
  process.exit(1);
}

const resolvedPath = path.resolve(sqlFile);
if (!fs.existsSync(resolvedPath)) {
  console.error(`File not found: ${resolvedPath}`);
  process.exit(1);
}

runMigration(resolvedPath);
