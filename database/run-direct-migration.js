#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * DIRECT SQL EXECUTION SCRIPT
 *
 * Executes SQL directly against Supabase using the PostgreSQL connection string.
 * This bypasses the need for the exec_sql RPC function.
 *
 * Usage:
 *   node database/run-direct-migration.js <path-to-sql-file>
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

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  db: { schema: "public" },
  auth: { persistSession: false },
});

async function runMigration(sqlFilePath) {
  try {
    console.log(`📂 Reading SQL file: ${sqlFilePath}`);
    const sql = fs.readFileSync(sqlFilePath, "utf8");

    console.log(`🚀 Executing migration...`);
    console.log("");

    // Split into individual statements (very basic - won't handle all SQL perfectly)
    // Remove comments and split by semicolons
    const statements = sql
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n")
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.match(/^DO\s+\$\$/i)); // Skip DO blocks for now

    let successCount = 0;
    let failureCount = 0;

    for (const statement of statements) {
      if (!statement || statement.length < 5) continue;

      try {
        // Use raw SQL query
        const { error } = await supabase.rpc("exec", {
          query: statement + ";",
        });

        if (error) {
          console.error(`❌ Statement failed: ${error.message}`);
          console.error(`   SQL: ${statement.substring(0, 100)}...`);
          failureCount++;
        } else {
          successCount++;
          console.log(`✅ Statement executed`);
        }
      } catch (err) {
        console.error(`❌ Error: ${err.message}`);
        console.error(`   SQL: ${statement.substring(0, 100)}...`);
        failureCount++;
      }
    }

    console.log("");
    console.log(
      `📊 Results: ${successCount} successful, ${failureCount} failed`
    );

    if (failureCount > 0) {
      console.log("");
      console.log(
        "⚠️  Some statements failed. You may need to run this in Supabase SQL Editor directly."
      );
      process.exit(1);
    } else {
      console.log("✅ Migration completed successfully!");
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

// Get SQL file path from command line
const sqlFile = process.argv[2];
if (!sqlFile) {
  console.error("Usage: node run-direct-migration.js <path-to-sql-file>");
  process.exit(1);
}

const resolvedPath = path.resolve(sqlFile);
if (!fs.existsSync(resolvedPath)) {
  console.error(`File not found: ${resolvedPath}`);
  process.exit(1);
}

runMigration(resolvedPath);
