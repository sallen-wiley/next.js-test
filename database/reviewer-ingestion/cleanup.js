#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * REVIEWER DATA CLEANUP SCRIPT
 *
 * Deletes manuscript and all related reviewer data from Supabase.
 *
 * WARNING: This is a destructive operation that:
 * 1. Deletes the manuscript
 * 2. Deletes all workflow data (invitations, queue, user assignments)
 * 3. Deletes ALL reviewers matched to this manuscript (even if matched to other manuscripts)
 * 4. Deletes ALL publications for those reviewers
 * 5. Deletes ALL retractions for those reviewers
 * 6. Deletes ALL matches/invitations for those reviewers (across ALL manuscripts)
 *
 * Usage:
 *   node database/reviewer-ingestion/cleanup.js --manuscript <identifier>
 *   node database/reviewer-ingestion/cleanup.js --manuscript <identifier> --dry-run
 *   node database/reviewer-ingestion/cleanup.js --manuscript <identifier> --force
 *
 * Identifier can be:
 *   - system_id (UUID)
 *   - submission_id (UUID)
 *   - custom_id (string)
 *
 * Options:
 *   --dry-run    Preview what would be deleted without actually deleting
 *   --force      Skip confirmation prompt
 *
 * Example:
 *   node database/reviewer-ingestion/cleanup.js --manuscript 7832738 --dry-run
 *   node database/reviewer-ingestion/cleanup.js --manuscript a1b2c3d4-e5f6-7890-abcd-ef1234567890
 */

const { createClient } = require("@supabase/supabase-js");
const readline = require("readline");
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
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================================================
// HELPER FUNCTIONS
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

/**
 * Ask for user confirmation
 */
async function confirm(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question + " (yes/no): ", (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "yes" || answer.toLowerCase() === "y");
    });
  });
}

// ============================================================================
// DELETION FUNCTIONS
// ============================================================================

/**
 * Find manuscript by identifier (system_id, submission_id, or custom_id)
 */
async function findManuscript(identifier) {
  log(`Looking for manuscript: ${identifier}`);

  // Try custom_id first (most common for user-facing IDs)
  let { data, error } = await supabase
    .from("manuscripts")
    .select("id, system_id, submission_id, custom_id, title")
    .eq("custom_id", identifier)
    .maybeSingle();

  if (error && error.code !== "PGRST116") throw error;
  if (data) {
    log(`Found manuscript by custom_id: ${data.title}`);
    return data;
  }

  // Try system_id (only if identifier looks like a UUID)
  if (
    identifier.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    )
  ) {
    ({ data, error } = await supabase
      .from("manuscripts")
      .select("id, system_id, submission_id, custom_id, title")
      .eq("system_id", identifier)
      .maybeSingle());

    if (error && error.code !== "PGRST116") throw error;
    if (data) {
      log(`Found manuscript by system_id: ${data.title}`);
      return data;
    }

    // Try submission_id
    ({ data, error } = await supabase
      .from("manuscripts")
      .select("id, system_id, submission_id, custom_id, title")
      .eq("submission_id", identifier)
      .maybeSingle());

    if (error && error.code !== "PGRST116") throw error;
    if (data) {
      log(`Found manuscript by submission_id: ${data.title}`);
      return data;
    }
  }

  return null;
}

/**
 * Get all reviewers matched to a manuscript
 */
async function getMatchedReviewers(manuscriptId) {
  log(`Finding reviewers matched to manuscript ${manuscriptId}...`);

  const { data, error } = await supabase
    .from("reviewer_manuscript_matches")
    .select(
      `
      reviewer_id,
      potential_reviewers (
        id,
        name,
        email
      )
    `
    )
    .eq("manuscript_id", manuscriptId);

  if (error) throw error;

  const reviewers = data.map((match) => ({
    id: match.reviewer_id,
    name: match.potential_reviewers.name,
    email: match.potential_reviewers.email,
  }));

  log(`Found ${reviewers.length} reviewers matched to this manuscript`);
  return reviewers;
}

/**
 * Get deletion statistics (what will be deleted)
 */
async function getDeleteStats(manuscriptId, reviewerIds) {
  log("Calculating deletion statistics...");

  const stats = {
    manuscript: 1,
    reviewers: reviewerIds.length,
    reviewer_manuscript_matches: 0,
    reviewer_publications: 0,
    reviewer_retractions: 0,
    review_invitations: 0,
    invitation_queue: 0,
    user_manuscripts: 0,
  };

  // Count reviewer_manuscript_matches (ALL matches for these reviewers, not just this manuscript)
  if (reviewerIds.length > 0) {
    const { count: matchCount } = await supabase
      .from("reviewer_manuscript_matches")
      .select("*", { count: "exact", head: true })
      .in("reviewer_id", reviewerIds);
    stats.reviewer_manuscript_matches = matchCount || 0;

    // Count reviewer_publications
    const { count: pubCount } = await supabase
      .from("reviewer_publications")
      .select("*", { count: "exact", head: true })
      .in("reviewer_id", reviewerIds);
    stats.reviewer_publications = pubCount || 0;

    // Count reviewer_retractions
    const { count: retCount } = await supabase
      .from("reviewer_retractions")
      .select("*", { count: "exact", head: true })
      .in("reviewer_id", reviewerIds);
    stats.reviewer_retractions = retCount || 0;

    // Count review_invitations (ALL invitations for these reviewers)
    const { count: invCount } = await supabase
      .from("review_invitations")
      .select("*", { count: "exact", head: true })
      .in("reviewer_id", reviewerIds);
    stats.review_invitations = invCount || 0;

    // Count invitation_queue (ALL queue entries for these reviewers)
    const { count: queueCount } = await supabase
      .from("invitation_queue")
      .select("*", { count: "exact", head: true })
      .in("reviewer_id", reviewerIds);
    stats.invitation_queue = queueCount || 0;
  }

  // Count user_manuscripts for this manuscript
  const { count: userMsCount } = await supabase
    .from("user_manuscripts")
    .select("*", { count: "exact", head: true })
    .eq("manuscript_id", manuscriptId);
  stats.user_manuscripts = userMsCount || 0;

  return stats;
}

/**
 * Delete all data related to manuscript and reviewers
 */
async function deleteData(manuscriptId, reviewerIds, dryRun = false) {
  const prefix = dryRun ? "[DRY RUN] Would delete" : "Deleting";

  const results = {
    reviewer_publications: 0,
    reviewer_retractions: 0,
    invitation_queue_reviewer: 0,
    review_invitations_reviewer: 0,
    reviewer_manuscript_matches: 0,
    invitation_queue_manuscript: 0,
    review_invitations_manuscript: 0,
    user_manuscripts: 0,
    potential_reviewers: 0,
    manuscripts: 0,
  };

  if (dryRun) {
    log("DRY RUN MODE - No data will be deleted", "WARN");
    return results;
  }

  // Delete in proper order to respect foreign key constraints

  // 1. Delete reviewer publications
  if (reviewerIds.length > 0) {
    log(`${prefix} reviewer publications...`);
    const { error } = await supabase
      .from("reviewer_publications")
      .delete()
      .in("reviewer_id", reviewerIds);
    if (error) throw error;
    results.reviewer_publications = "✓";
  }

  // 2. Delete reviewer retractions
  if (reviewerIds.length > 0) {
    log(`${prefix} reviewer retractions...`);
    const { error } = await supabase
      .from("reviewer_retractions")
      .delete()
      .in("reviewer_id", reviewerIds);
    if (error) throw error;
    results.reviewer_retractions = "✓";
  }

  // 3. Delete invitation queue entries (for these reviewers, all manuscripts)
  if (reviewerIds.length > 0) {
    log(`${prefix} invitation queue entries (all manuscripts)...`);
    const { error } = await supabase
      .from("invitation_queue")
      .delete()
      .in("reviewer_id", reviewerIds);
    if (error) throw error;
    results.invitation_queue_reviewer = "✓";
  }

  // 4. Delete review invitations (for these reviewers, all manuscripts)
  if (reviewerIds.length > 0) {
    log(`${prefix} review invitations (all manuscripts)...`);
    const { error } = await supabase
      .from("review_invitations")
      .delete()
      .in("reviewer_id", reviewerIds);
    if (error) throw error;
    results.review_invitations_reviewer = "✓";
  }

  // 5. Delete reviewer-manuscript matches (all matches for these reviewers)
  if (reviewerIds.length > 0) {
    log(`${prefix} reviewer-manuscript matches (all manuscripts)...`);
    const { error } = await supabase
      .from("reviewer_manuscript_matches")
      .delete()
      .in("reviewer_id", reviewerIds);
    if (error) throw error;
    results.reviewer_manuscript_matches = "✓";
  }

  // 6. Delete user-manuscript assignments
  log(`${prefix} user-manuscript assignments...`);
  const { error: userMsError } = await supabase
    .from("user_manuscripts")
    .delete()
    .eq("manuscript_id", manuscriptId);
  if (userMsError) throw userMsError;
  results.user_manuscripts = "✓";

  // 7. Delete reviewers themselves
  if (reviewerIds.length > 0) {
    log(`${prefix} ${reviewerIds.length} reviewers...`);
    const { error } = await supabase
      .from("potential_reviewers")
      .delete()
      .in("id", reviewerIds);
    if (error) throw error;
    results.potential_reviewers = "✓";
  }

  // 8. Delete manuscript (last, because other tables reference it)
  log(`${prefix} manuscript...`);
  const { error: msError } = await supabase
    .from("manuscripts")
    .delete()
    .eq("id", manuscriptId);
  if (msError) throw msError;
  results.manuscripts = "✓";

  return results;
}

// ============================================================================
// MAIN CLEANUP LOGIC
// ============================================================================

async function cleanupManuscript(identifier, options = {}) {
  const { dryRun = false, force = false } = options;

  log("=".repeat(80));
  log("MANUSCRIPT CLEANUP SCRIPT");
  log("=".repeat(80));

  // 1. Find manuscript
  const manuscript = await findManuscript(identifier);

  if (!manuscript) {
    log(`Manuscript not found: ${identifier}`, "ERROR");
    return false;
  }

  console.log("\nManuscript found:");
  console.log(`  ID: ${manuscript.id}`);
  console.log(`  Title: ${manuscript.title}`);
  console.log(`  System ID: ${manuscript.system_id || "N/A"}`);
  console.log(`  Submission ID: ${manuscript.submission_id || "N/A"}`);
  console.log(`  Custom ID: ${manuscript.custom_id || "N/A"}`);

  // 2. Get matched reviewers
  const reviewers = await getMatchedReviewers(manuscript.id);
  const reviewerIds = reviewers.map((r) => r.id);

  console.log(`\nReviewers to be deleted (${reviewers.length}):`);
  reviewers.forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.name} (${r.email})`);
  });

  // 3. Get deletion statistics
  const stats = await getDeleteStats(manuscript.id, reviewerIds);

  console.log("\nDeletion Summary:");
  console.log("=".repeat(80));
  console.log(`  Manuscripts: ${stats.manuscript}`);
  console.log(`  Reviewers: ${stats.reviewers}`);
  console.log(
    `  Reviewer-Manuscript Matches (all manuscripts): ${stats.reviewer_manuscript_matches}`
  );
  console.log(`  Reviewer Publications: ${stats.reviewer_publications}`);
  console.log(`  Reviewer Retractions: ${stats.reviewer_retractions}`);
  console.log(
    `  Review Invitations (all manuscripts): ${stats.review_invitations}`
  );
  console.log(
    `  Invitation Queue Entries (all manuscripts): ${stats.invitation_queue}`
  );
  console.log(`  User-Manuscript Assignments: ${stats.user_manuscripts}`);
  console.log("=".repeat(80));

  const totalRecords =
    stats.manuscript +
    stats.reviewers +
    stats.reviewer_manuscript_matches +
    stats.reviewer_publications +
    stats.reviewer_retractions +
    stats.review_invitations +
    stats.invitation_queue +
    stats.user_manuscripts;

  console.log(`\n⚠️  TOTAL RECORDS TO DELETE: ${totalRecords}`);

  if (dryRun) {
    console.log("\n[DRY RUN MODE] - No data will be deleted");
  } else if (!force) {
    console.log(
      "\n⚠️  WARNING: This operation is IRREVERSIBLE and will delete data across ALL manuscripts!"
    );
    console.log(
      "Reviewers matched to this manuscript will be deleted even if they're matched to other manuscripts."
    );
    const confirmed = await confirm(
      "\nAre you sure you want to proceed with deletion?"
    );

    if (!confirmed) {
      log("Deletion cancelled by user", "WARN");
      return false;
    }
  }

  // 4. Delete data
  log("\nStarting deletion process...");
  try {
    await deleteData(manuscript.id, reviewerIds, dryRun);

    log("\n" + "=".repeat(80));
    log(dryRun ? "DRY RUN COMPLETE" : "DELETION COMPLETE");
    log("=".repeat(80));

    if (!dryRun) {
      console.log("✅ Successfully deleted all data");
    }

    return true;
  } catch (error) {
    logError("FATAL ERROR during deletion", error);
    throw error;
  }
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let manuscriptIdentifier = null;
  let dryRun = false;
  let force = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--manuscript" && args[i + 1]) {
      manuscriptIdentifier = args[i + 1];
      i++;
    } else if (args[i] === "--dry-run") {
      dryRun = true;
    } else if (args[i] === "--force") {
      force = true;
    }
  }

  if (!manuscriptIdentifier) {
    console.error("Usage: node cleanup.js --manuscript <identifier> [options]");
    console.error("\nOptions:");
    console.error("  --dry-run    Preview what would be deleted");
    console.error("  --force      Skip confirmation prompt");
    console.error("\nIdentifier can be:");
    console.error("  - system_id (UUID)");
    console.error("  - submission_id (UUID)");
    console.error("  - custom_id (string)");
    console.error("\nExamples:");
    console.error("  node cleanup.js --manuscript 7832738 --dry-run");
    console.error(
      "  node cleanup.js --manuscript a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    );
    console.error("  node cleanup.js --manuscript 7832738 --force");
    process.exit(1);
  }

  try {
    await cleanupManuscript(manuscriptIdentifier, { dryRun, force });
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Cleanup failed");
    console.error(error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { cleanupManuscript };
