/**
 * REVIEWER INGESTION LIBRARY
 *
 * Shared TypeScript library for ingesting reviewer suggestions data.
 * Used by both the CLI script and the admin UI.
 *
 * Features:
 * - Type-safe ingestion logic
 * - Progress callbacks for UI updates
 * - Error handling and validation
 * - Idempotent operations (safe to run multiple times)
 */

import type { SupabaseClient } from "@supabase/supabase-js";

// ============================================================================
// TYPES
// ============================================================================

export interface ManuscriptData {
  systemId: string;
  submissionId: string;
  customId?: string;
  title: string;
  abstract?: string;
  journalName: string;
  articleType: string;
  submittedDate: string;
  authors: Array<{ givenNames: string; surname: string }>;
  keywords?: string[];
}

export interface ReviewerData {
  id: string;
  pkgId?: string;
  email: string;
  givenNames: string;
  surname: string;
  name: string;
  aff: string;
  affRorId?: string;
  orcidId?: string;
  profileUrl?: string;
  type?: string;
  isBoardMember: boolean;
  previousReviewer: boolean;
  hasPublicationsSaved: boolean;
  keywords?: string[];
  currentlyReviewing?: number;
  numberOfReviews?: number;
  completedReviews?: number;
  score: number;
  initialSuggestion: boolean;
  conflictsOfInterest?: string;
  publicationStats?: {
    hIndex?: number;
    totalPublications?: number;
    citationCount?: number;
    publicationYearRange?: {
      fromYear?: number;
      toYear?: number;
    };
    publicationCountInLastYear?: number;
    lastPublicationDate?: string;
  };
  // Publications can be at top level (old format) or nested (new format)
  relatedPublications?: Publication[];
  otherPublications?: Publication[];
  publications?: {
    relatedPublications?: Publication[];
    otherPublications?: Publication[];
  };
  retractions?: {
    retractionReasons: string[];
  };
}

export interface Publication {
  title: string;
  doi?: string;
  journalName?: string;
  authors?: string[];
  publicationDate?: string;
}

export interface IngestionData {
  manuscriptData: ManuscriptData;
  reviewers: ReviewerData[];
}

export interface IngestionStats {
  manuscriptId: string;
  manuscriptsProcessed: number;
  reviewersProcessed: number;
  matchesCreated: number;
  publicationsInserted: number;
  retractionsInserted: number;
  errors: Array<{ reviewer: string; error: string }>;
}

export interface IngestionProgress {
  phase: "manuscript" | "reviewers" | "complete";
  currentReviewer?: number;
  totalReviewers?: number;
  reviewerName?: string;
  message: string;
}

export type ProgressCallback = (progress: IngestionProgress) => void;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Strip HTML tags from a string
 */
export function stripHtml(html: string | null | undefined): string | null {
  if (!html) return null;
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Parse date string to YYYY-MM-DD format
 */
export function parseDate(
  dateString: string | null | undefined,
): string | null {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  } catch {
    console.warn(`Failed to parse date: ${dateString}`);
    return null;
  }
}

// ============================================================================
// INGESTION FUNCTIONS
// ============================================================================

/**
 * Upsert manuscript data
 */
export async function upsertManuscript(
  supabase: SupabaseClient,
  manuscriptData: ManuscriptData,
  status?: string,
): Promise<string> {
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
    status: status || "submitted",
    version: 1,
  };

  // Check if manuscript already exists
  const { data: existing, error: checkError } = await supabase
    .from("manuscripts")
    .select("id")
    .eq("system_id", manuscriptData.systemId)
    .maybeSingle();

  if (checkError) {
    throw checkError;
  }

  if (existing) {
    // Update existing manuscript
    const { data, error } = await supabase
      .from("manuscripts")
      .update(manuscriptRecord)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } else {
    // Insert new manuscript
    const { data, error } = await supabase
      .from("manuscripts")
      .insert(manuscriptRecord)
      .select()
      .single();

    if (error) throw error;
    return data.id;
  }
}

/**
 * Upsert reviewer data
 */
export async function upsertReviewer(
  supabase: SupabaseClient,
  reviewerData: ReviewerData,
): Promise<string> {
  const fullName = `${reviewerData.givenNames} ${reviewerData.surname}`;

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
      reviewerData.publicationStats?.lastPublicationDate,
    ),
  };

  // Check if reviewer already exists (by email)
  const { data: existing, error: checkError } = await supabase
    .from("potential_reviewers")
    .select("id")
    .eq("email", reviewerData.email)
    .maybeSingle();

  if (checkError) {
    throw checkError;
  }

  if (existing) {
    // Update existing reviewer
    const { data, error } = await supabase
      .from("potential_reviewers")
      .update(reviewerRecord)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } else {
    // Insert new reviewer
    const { data, error } = await supabase
      .from("potential_reviewers")
      .insert(reviewerRecord)
      .select()
      .single();

    if (error) throw error;
    return data.id;
  }
}

/**
 * Upsert reviewer-manuscript match
 */
export async function upsertReviewerMatch(
  supabase: SupabaseClient,
  manuscriptId: string,
  reviewerId: string,
  reviewerData: ReviewerData,
): Promise<string> {
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
    .maybeSingle();

  if (checkError) {
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
    return data.id;
  } else {
    // Insert new match
    const { data, error } = await supabase
      .from("reviewer_manuscript_matches")
      .insert(matchRecord)
      .select()
      .single();

    if (error) throw error;
    return data.id;
  }
}

/**
 * Insert publications for a reviewer
 * Publications are part of the reviewer's bibliography and are not linked to specific manuscripts
 */
export async function insertPublications(
  supabase: SupabaseClient,
  reviewerId: string,
  reviewerData: ReviewerData,
): Promise<number> {
  // Handle both old format (top-level) and new format (nested under publications)
  const relatedPubs =
    reviewerData.relatedPublications ||
    reviewerData.publications?.relatedPublications ||
    [];
  const otherPubs =
    reviewerData.otherPublications ||
    reviewerData.publications?.otherPublications ||
    [];
  const allPubs = [...relatedPubs, ...otherPubs];

  if (allPubs.length === 0) {
    return 0;
  }

  const publicationRecords = allPubs.map((pub) => ({
    reviewer_id: reviewerId,
    title: pub.title,
    doi: pub.doi || null,
    journal_name: pub.journalName || null,
    authors: pub.authors || [],
    publication_date: parseDate(pub.publicationDate),
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
    // Try inserting one by one and skip duplicates
    let successCount = 0;

    for (const record of publicationRecords) {
      const { error: insertError } = await supabase
        .from("reviewer_publications")
        .upsert(record, {
          onConflict: "reviewer_id,doi",
          ignoreDuplicates: true,
        });

      if (!insertError) {
        successCount++;
      }
    }

    return successCount;
  } else {
    return data.length;
  }
}

/**
 * Insert retractions for a reviewer (if any)
 */
export async function insertRetractions(
  supabase: SupabaseClient,
  reviewerId: string,
  reviewerData: ReviewerData,
): Promise<boolean> {
  const retractionData = reviewerData.retractions;

  if (
    !retractionData ||
    !retractionData.retractionReasons ||
    retractionData.retractionReasons.length === 0
  ) {
    return false;
  }

  const retractionRecord = {
    reviewer_id: reviewerId,
    retraction_reasons: retractionData.retractionReasons,
  };

  const { error } = await supabase
    .from("reviewer_retractions")
    .insert(retractionRecord)
    .select()
    .single();

  if (error) {
    // Might already exist, just continue
    return false;
  }

  return true;
}

// ============================================================================
// MAIN INGESTION LOGIC
// ============================================================================

/**
 * Ingest reviewer suggestions data
 *
 * @param supabase - Supabase client instance
 * @param data - Parsed JSON data containing manuscript and reviewer suggestions
 * @param onProgress - Optional callback for progress updates
 * @returns Statistics about the ingestion operation
 */
export async function ingestReviewerData(
  supabase: SupabaseClient,
  data: IngestionData,
  onProgress?: ProgressCallback,
  status?: string,
): Promise<IngestionStats> {
  const stats: IngestionStats = {
    manuscriptId: "",
    manuscriptsProcessed: 0,
    reviewersProcessed: 0,
    matchesCreated: 0,
    publicationsInserted: 0,
    retractionsInserted: 0,
    errors: [],
  };

  try {
    // Phase 1: Upsert manuscript
    onProgress?.({
      phase: "manuscript",
      message: `Processing manuscript: ${data.manuscriptData.title}`,
    });

    const manuscriptId = await upsertManuscript(
      supabase,
      data.manuscriptData,
      status,
    );
    stats.manuscriptId = manuscriptId;
    stats.manuscriptsProcessed = 1;

    // Phase 2: Process each reviewer
    onProgress?.({
      phase: "reviewers",
      currentReviewer: 0,
      totalReviewers: data.reviewers.length,
      message: `Processing ${data.reviewers.length} reviewers...`,
    });

    for (let i = 0; i < data.reviewers.length; i++) {
      const reviewer = data.reviewers[i];
      const reviewerName = `${reviewer.givenNames} ${reviewer.surname}`;

      onProgress?.({
        phase: "reviewers",
        currentReviewer: i + 1,
        totalReviewers: data.reviewers.length,
        reviewerName,
        message: `Processing ${reviewerName} (${i + 1}/${
          data.reviewers.length
        })`,
      });

      try {
        // Upsert reviewer
        const reviewerId = await upsertReviewer(supabase, reviewer);
        stats.reviewersProcessed++;

        // Create reviewer-manuscript match
        await upsertReviewerMatch(supabase, manuscriptId, reviewerId, reviewer);
        stats.matchesCreated++;

        // Insert publications
        const pubCount = await insertPublications(
          supabase,
          reviewerId,
          reviewer,
        );
        stats.publicationsInserted += pubCount;

        // Insert retractions (if any)
        const hasRetractions = await insertRetractions(
          supabase,
          reviewerId,
          reviewer,
        );
        if (hasRetractions) {
          stats.retractionsInserted++;
        }
      } catch (error) {
        stats.errors.push({
          reviewer: reviewerName,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Phase 3: Complete
    onProgress?.({
      phase: "complete",
      message: "Ingestion complete!",
    });

    return stats;
  } catch (error) {
    throw new Error(
      `Fatal error during ingestion: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

/**
 * Validate ingestion data structure
 */
export function validateIngestionData(data: unknown): data is IngestionData {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid data: must be an object");
  }

  const d = data as Record<string, unknown>;

  if (!d.manuscriptData || typeof d.manuscriptData !== "object") {
    throw new Error("Invalid data: missing manuscriptData");
  }

  if (!Array.isArray(d.reviewers)) {
    throw new Error("Invalid data: reviewers must be an array");
  }

  return true;
}
