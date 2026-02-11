#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * REVIEWER SUGGESTIONS INGESTION SCRIPT (CLI)
 *
 * Command-line interface for ingesting JSON manuscript data with reviewer suggestions.
 * Uses the shared ingestion library for core logic.
 *
 * Features:
 * - Idempotent: safe to run multiple times
 * - Uses email for reviewer deduplication
 * - Uses system_id for manuscript deduplication
 * - Prevents duplicate publications via reviewer_id + DOI unique constraint
 * - Comprehensive logging
 *
 * Usage:
 *   node database/reviewer-ingestion/ingest.js <path-to-json-file>
 *
 * Example:
 *   node database/reviewer-ingestion/ingest.js ./data/reviewer_suggestions_7832738.json
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load environment variables from .env.local in project root
require("dotenv").config({ path: path.join(__dirname, "../../.env.local") });

// Import shared ingestion library (compiled TypeScript)
const {
  ingestReviewerData,
  validateIngestionData,
} = require("../../src/lib/ingestion/reviewerIngestion.ts");

// ============================================================================
// CONFIGURATION
// ============================================================================

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for admin operations

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("ERROR: Missing required environment variables:");
  console.error("  SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)");
  console.error("  SUPABASE_SERVICE_ROLE_KEY");
  console.error("\nAdd these to your .env.local file in the project root:");
  console.error("  SUPABASE_URL=https://your-project.supabase.co");
  console.error("  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key");
  console.error("\nOr for Next.js projects, you may already have:");
  console.error("  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co");
  console.error("  (just add SUPABASE_SERVICE_ROLE_KEY to the same file)");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================================================
// LOGGING UTILITIES
// ============================================================================

/**
 * Log with timestamp
 */
function log(message, level = "INFO") {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
}

/**
 * Log error with details
 */
function logError(message, error) {
  log(`${message}: ${error.message}`, "ERROR");
  if (error.details) {
    console.error("Details:", error.details);
  }
  if (error.hint) {
    console.error("Hint:", error.hint);
  }
}

// ============================================================================
// MAIN INGESTION WRAPPER
// ============================================================================

async function ingestData(jsonFilePath) {
  log("=".repeat(80));
  log("STARTING INGESTION");
  log("=".repeat(80));
  log(`Reading JSON file: ${jsonFilePath}`);

  // Read and parse JSON
  const rawData = fs.readFileSync(jsonFilePath, "utf8");
  const data = JSON.parse(rawData);

  // Validate data structure
  try {
    validateIngestionData(data);
  } catch (error) {
    logError("Invalid data structure", error);
    throw error;
  }

  log(`JSON parsed successfully`);
  log(`Manuscript: ${data.manuscriptData.title}`);
  log(`Reviewers: ${data.reviewers.length}`);

  // Use shared ingestion library with progress logging
  const stats = await ingestReviewerData(supabase, data, (progress) => {
    if (progress.phase === "manuscript") {
      log(`\n--- PHASE 1: ${progress.message} ---`);
    } else if (progress.phase === "reviewers") {
      if (progress.currentReviewer === 1) {
        log(`\n--- PHASE 2: PROCESSING REVIEWERS ---`);
      }
      log(
        `Processing reviewer ${progress.currentReviewer}/${progress.totalReviewers}: ${progress.reviewerName}`,
      );
    }
  });

  // Summary
  log("\n" + "=".repeat(80));
  log("INGESTION COMPLETE");
  log("=".repeat(80));
  log(`Manuscripts processed: ${stats.manuscriptsProcessed}`);
  log(`Reviewers processed: ${stats.reviewersProcessed}`);
  log(`Matches created: ${stats.matchesCreated}`);
  log(`Publications inserted: ${stats.publicationsInserted}`);
  log(`Retractions inserted: ${stats.retractionsInserted}`);
  log(`Errors: ${stats.errors.length}`);

  if (stats.errors.length > 0) {
    log("\nERROR DETAILS:", "WARN");
    stats.errors.forEach((err, i) => {
      log(`${i + 1}. ${err.reviewer}: ${err.error}`, "WARN");
    });
  }

  log("\n✅ Ingestion completed successfully!");

  return stats;
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(
      "Usage: node database/reviewer-ingestion/ingest.js <path-to-json-file>",
    );
    console.error(
      "Example: node database/reviewer-ingestion/ingest.js ./data/reviewer_suggestions_7832738.json",
    );
    process.exit(1);
  }

  const jsonFilePath = path.resolve(args[0]);

  if (!fs.existsSync(jsonFilePath)) {
    console.error(`ERROR: File not found: ${jsonFilePath}`);
    process.exit(1);
  }

  try {
    await ingestData(jsonFilePath);
    process.exit(0);
  } catch {
    console.error("\n❌ Ingestion failed");
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { ingestData };
