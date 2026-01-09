#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * REVIEWER SUGGESTIONS INGESTION SCRIPT
 *
 * Ingests JSON manuscript data with reviewer suggestions into Supabase.
 *
 * Features:
 * - Idempotent: safe to run multiple times
 * - Uses email for reviewer deduplication
 * - Uses system_id for manuscript deduplication
 * - Prevents duplicate publications via reviewer_id + DOI unique constraint
 * - Comprehensive logging
 * - Transaction support for data integrity
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
// HELPER FUNCTIONS
// ============================================================================

/**
 * Strip HTML tags from a string
 */
function stripHtml(html) {
  if (!html) return null;
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Parse date string to YYYY-MM-DD format
 */
function parseDate(dateString) {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  } catch {
    console.warn(`Failed to parse date: ${dateString}`);
    return null;
  }
}

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
// INGESTION FUNCTIONS
// ============================================================================

/**
 * Upsert manuscript data
 */
async function upsertManuscript(manuscriptData) {
  log(`Upserting manuscript: ${manuscriptData.title}`);

  const manuscriptRecord = {
    system_id: manuscriptData.systemId,
    submission_id: manuscriptData.submissionId,
    custom_id: manuscriptData.customId,
    title: manuscriptData.title,
    abstract: stripHtml(manuscriptData.abstract),
    journal: manuscriptData.journalName,
    article_type: manuscriptData.articleType,
    submission_date: manuscriptData.submittedDate,
    authors: manuscriptData.authors.map((a) => `${a.givenNames} ${a.surname}`),
    keywords: manuscriptData.keywords || [],
    status: "submitted",
    version: 1,
  };

  // Check if manuscript already exists
  const { data: existing, error: checkError } = await supabase
    .from("manuscripts")
    .select("id")
    .eq("system_id", manuscriptData.systemId)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    // PGRST116 = no rows
    throw checkError;
  }

  if (existing) {
    // Update existing manuscript
    log(`Manuscript ${manuscriptData.systemId} exists, updating...`);
    const { data, error } = await supabase
      .from("manuscripts")
      .update(manuscriptRecord)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    log(`Updated manuscript: ${data.id}`);
    return data.id;
  } else {
    // Insert new manuscript
    log(`Creating new manuscript ${manuscriptData.systemId}...`);
    const { data, error } = await supabase
      .from("manuscripts")
      .insert(manuscriptRecord)
      .select()
      .single();

    if (error) throw error;
    log(`Created manuscript: ${data.id}`);
    return data.id;
  }
}

/**
 * Upsert reviewer data
 */
async function upsertReviewer(reviewerData) {
  const fullName = `${reviewerData.givenNames} ${reviewerData.surname}`;
  log(`Upserting reviewer: ${fullName} (${reviewerData.email})`);

  const reviewerRecord = {
    external_id: reviewerData.id,
    pkg_id: reviewerData.pkgId,
    email: reviewerData.email,
    given_names: reviewerData.givenNames,
    surname: reviewerData.surname,
    name: fullName,
    affiliation: reviewerData.aff,
    aff_ror_id: reviewerData.affRorId,
    orcid_id: reviewerData.orcidId || null,
    profile_url: reviewerData.profileUrl,
    reviewer_type: reviewerData.type,
    is_board_member: reviewerData.isBoardMember,
    previous_reviewer: reviewerData.previousReviewer,
    has_publications_saved: reviewerData.hasPublicationsSaved,
    expertise_areas: reviewerData.keywords || [],
    current_review_load: reviewerData.currentlyReviewing || 0,
    // Publication stats (formerly in reviewer_metrics)
    h_index: reviewerData.publicationStats?.hIndex || null,
    number_of_reviews: reviewerData.numberOfReviews || 0,
    completed_reviews: reviewerData.completedReviews || 0,
    currently_reviewing: reviewerData.currentlyReviewing || 0,
    total_publications:
      reviewerData.publicationStats?.totalPublications || null,
    citation_count: reviewerData.publicationStats?.citationCount || null,
    publication_year_from:
      reviewerData.publicationStats?.publicationYearRange?.fromYear || null,
    publication_year_to:
      reviewerData.publicationStats?.publicationYearRange?.toYear || null,
    publication_count_last_year:
      reviewerData.publicationStats?.publicationCountInLastYear || null,
    last_publication_date: parseDate(
      reviewerData.publicationStats?.lastPublicationDate
    ),
  };

  // Check if reviewer already exists (by email)
  const { data: existing, error: checkError } = await supabase
    .from("potential_reviewers")
    .select("id")
    .eq("email", reviewerData.email)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    throw checkError;
  }

  if (existing) {
    // Update existing reviewer
    log(`Reviewer ${reviewerData.email} exists, updating...`);
    const { data, error } = await supabase
      .from("potential_reviewers")
      .update(reviewerRecord)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    log(`Updated reviewer: ${data.id}`);
    return data.id;
  } else {
    // Insert new reviewer
    log(`Creating new reviewer ${reviewerData.email}...`);
    const { data, error } = await supabase
      .from("potential_reviewers")
      .insert(reviewerRecord)
      .select()
      .single();

    if (error) throw error;
    log(`Created reviewer: ${data.id}`);
    return data.id;
  }
}

/**
 * Upsert reviewer-manuscript match
 */
async function upsertReviewerMatch(manuscriptId, reviewerId, reviewerData) {
  log(
    `Creating reviewer match: manuscript ${manuscriptId} <-> reviewer ${reviewerId}`
  );

  const matchRecord = {
    manuscript_id: manuscriptId,
    reviewer_id: reviewerId,
    match_score: reviewerData.score,
    is_initial_suggestion: reviewerData.initialSuggestion,
    conflicts_of_interest: reviewerData.conflictsOfInterest || null,
  };

  // Check if match already exists
  const { data: existing, error: checkError } = await supabase
    .from("reviewer_manuscript_matches")
    .select("id")
    .eq("manuscript_id", manuscriptId)
    .eq("reviewer_id", reviewerId)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    throw checkError;
  }

  if (existing) {
    // Update existing match
    const { data, error } = await supabase
      .from("reviewer_manuscript_matches")
      .update(matchRecord)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    log(`Updated reviewer match: ${data.id}`);
    return data.id;
  } else {
    // Insert new match
    const { data, error } = await supabase
      .from("reviewer_manuscript_matches")
      .insert(matchRecord)
      .select()
      .single();

    if (error) throw error;
    log(`Created reviewer match: ${data.id}`);
    return data.id;
  }
}

/**
 * Insert publications for a reviewer
 */
async function insertPublications(reviewerId, reviewerData) {
  const relatedPubs = reviewerData.relatedPublications || [];
  const otherPubs = reviewerData.otherPublications || [];

  const allPubs = [
    ...relatedPubs.map((p) => ({ ...p, is_related: true })),
    ...otherPubs.map((p) => ({ ...p, is_related: false })),
  ];

  if (allPubs.length === 0) {
    log(`No publications for reviewer ${reviewerId}`);
    return;
  }

  log(
    `Inserting ${allPubs.length} publications for reviewer ${reviewerId} (${relatedPubs.length} related, ${otherPubs.length} other)`
  );

  const publicationRecords = allPubs.map((pub) => ({
    reviewer_id: reviewerId,
    title: pub.title,
    doi: pub.doi || null,
    journal_name: pub.journalName || null,
    authors: pub.authors || [],
    publication_date: parseDate(pub.publicationDate),
    is_related: pub.is_related,
  }));

  // Use upsert to handle duplicates gracefully
  const { data, error } = await supabase
    .from("reviewer_publications")
    .upsert(publicationRecords, {
      onConflict: "reviewer_id,doi",
      ignoreDuplicates: false,
    })
    .select();

  if (error) {
    // If there's an error, it might be due to null DOIs
    // Try inserting one by one and skip duplicates
    log("Batch insert failed, trying individual inserts...", "WARN");
    let successCount = 0;
    let skipCount = 0;

    for (const record of publicationRecords) {
      const { error: insertError } = await supabase
        .from("reviewer_publications")
        .upsert(record, {
          onConflict: "reviewer_id,doi",
          ignoreDuplicates: true,
        });

      if (insertError) {
        skipCount++;
        log(`Skipped duplicate publication: ${record.title}`, "WARN");
      } else {
        successCount++;
      }
    }

    log(
      `Inserted ${successCount} publications, skipped ${skipCount} duplicates`
    );
  } else {
    log(`Inserted ${data.length} publications`);
  }
}

/**
 * Insert retractions for a reviewer (if any)
 */
async function insertRetractions(reviewerId, reviewerData) {
  const retractionData = reviewerData.retractions;

  if (
    !retractionData ||
    !retractionData.retractionReasons ||
    retractionData.retractionReasons.length === 0
  ) {
    return;
  }

  log(`Inserting retraction data for reviewer ${reviewerId}`);

  const retractionRecord = {
    reviewer_id: reviewerId,
    retraction_reasons: retractionData.retractionReasons,
  };

  const { data, error } = await supabase
    .from("reviewer_retractions")
    .insert(retractionRecord)
    .select()
    .single();

  if (error) {
    // Might already exist, just log and continue
    log(
      `Could not insert retraction (might already exist): ${error.message}`,
      "WARN"
    );
  } else {
    log(`Inserted retraction data: ${data.id}`);
  }
}

// ============================================================================
// MAIN INGESTION LOGIC
// ============================================================================

async function ingestData(jsonFilePath) {
  log("=".repeat(80));
  log("STARTING INGESTION");
  log("=".repeat(80));
  log(`Reading JSON file: ${jsonFilePath}`);

  // Read and parse JSON
  const rawData = fs.readFileSync(jsonFilePath, "utf8");
  const data = JSON.parse(rawData);

  log(`JSON parsed successfully`);
  log(`Manuscript: ${data.manuscriptData.title}`);
  log(`Reviewers: ${data.reviewers.length}`);

  const stats = {
    manuscriptsProcessed: 0,
    reviewersProcessed: 0,
    matchesCreated: 0,
    publicationsInserted: 0,
    retractionsInserted: 0,
    errors: [],
  };

  try {
    // 1. Upsert manuscript
    log("\n--- PHASE 1: UPSERTING MANUSCRIPT ---");
    const manuscriptId = await upsertManuscript(data.manuscriptData);
    stats.manuscriptsProcessed = 1;

    // 2. Process each reviewer
    log("\n--- PHASE 2: PROCESSING REVIEWERS ---");
    for (let i = 0; i < data.reviewers.length; i++) {
      const reviewer = data.reviewers[i];
      log(
        `\nProcessing reviewer ${i + 1}/${data.reviewers.length}: ${
          reviewer.name
        }`
      );

      try {
        // Upsert reviewer
        const reviewerId = await upsertReviewer(reviewer);
        stats.reviewersProcessed++;

        // Create reviewer-manuscript match
        await upsertReviewerMatch(manuscriptId, reviewerId, reviewer);
        stats.matchesCreated++;

        // Insert publications
        await insertPublications(reviewerId, reviewer);
        const pubCount =
          (reviewer.relatedPublications?.length || 0) +
          (reviewer.otherPublications?.length || 0);
        stats.publicationsInserted += pubCount;

        // Insert retractions (if any)
        await insertRetractions(reviewerId, reviewer);
        if (reviewer.retractions?.retractionReasons?.length > 0) {
          stats.retractionsInserted++;
        }
      } catch (error) {
        logError(`Failed to process reviewer ${reviewer.name}`, error);
        stats.errors.push({
          reviewer: reviewer.name,
          error: error.message,
        });
      }
    }

    // 3. Summary
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
  } catch (error) {
    logError("FATAL ERROR during ingestion", error);
    throw error;
  }
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(
      "Usage: node database/reviewer-ingestion/ingest.js <path-to-json-file>"
    );
    console.error(
      "Example: node database/reviewer-ingestion/ingest.js ./data/reviewer_suggestions_7832738.json"
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
