/**
 * MANUSCRIPT CLEANUP LIBRARY
 *
 * Shared TypeScript library for cleaning up manuscript and reviewer data.
 * Used by both the CLI script and the admin UI.
 *
 * Features:
 * - Impact analysis (shows what will be deleted)
 * - Cross-manuscript detection (shows shared reviewers)
 * - Type-safe deletion logic
 * - Progress callbacks for UI updates
 */

import type { SupabaseClient } from "@supabase/supabase-js";

// ============================================================================
// TYPES
// ============================================================================

export interface ManuscriptIdentifier {
  id?: string;
  system_id?: string;
  submission_id?: string;
  custom_id?: string;
  title?: string;
}

export interface ReviewerInfo {
  id: string;
  name: string;
  email: string;
  affiliation?: string;
}

export interface SharedReviewerInfo extends ReviewerInfo {
  otherManuscripts: Array<{
    id: string;
    title: string;
    custom_id?: string;
  }>;
  sharedMatchCount: number;
}

export interface ImpactAnalysis {
  manuscript: ManuscriptIdentifier;
  reviewers: ReviewerInfo[];
  sharedReviewers: SharedReviewerInfo[];
  stats: {
    manuscripts: number;
    reviewers: number;
    reviewerMatches: number;
    reviewerMatchesAcrossManuscripts: number;
    publications: number;
    retractions: number;
    reviewInvitations: number;
    invitationQueue: number;
    userManuscripts: number;
    publicationMatches: number;
  };
}

export interface CleanupProgress {
  phase: "analyzing" | "deleting" | "complete";
  step?: string;
  message: string;
}

export type ProgressCallback = (progress: CleanupProgress) => void;

// ============================================================================
// MANUSCRIPT LOOKUP
// ============================================================================

/**
 * Find manuscript by various identifiers
 */
export async function findManuscript(
  supabase: SupabaseClient,
  identifier: string,
): Promise<ManuscriptIdentifier | null> {
  // Try custom_id first (most common for user-facing IDs)
  let { data, error } = await supabase
    .from("manuscripts")
    .select("id, system_id, submission_id, custom_id, title")
    .eq("custom_id", identifier)
    .maybeSingle();

  if (error) throw error;
  if (data) return data;

  // Try system_id or submission_id (if identifier looks like UUID)
  if (
    identifier.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    )
  ) {
    // Try system_id
    ({ data, error } = await supabase
      .from("manuscripts")
      .select("id, system_id, submission_id, custom_id, title")
      .eq("system_id", identifier)
      .maybeSingle());

    if (error) throw error;
    if (data) return data;

    // Try submission_id
    ({ data, error } = await supabase
      .from("manuscripts")
      .select("id, system_id, submission_id, custom_id, title")
      .eq("submission_id", identifier)
      .maybeSingle());

    if (error) throw error;
    if (data) return data;

    // Try id (internal UUID)
    ({ data, error } = await supabase
      .from("manuscripts")
      .select("id, system_id, submission_id, custom_id, title")
      .eq("id", identifier)
      .maybeSingle());

    if (error) throw error;
    if (data) return data;
  }

  return null;
}

// ============================================================================
// IMPACT ANALYSIS
// ============================================================================

/**
 * Get all reviewers matched to a manuscript
 */
async function getMatchedReviewers(
  supabase: SupabaseClient,
  manuscriptId: string,
): Promise<ReviewerInfo[]> {
  const { data, error } = await supabase
    .from("reviewer_manuscript_matches")
    .select(
      `
      reviewer_id,
      potential_reviewers (
        id,
        name,
        email,
        affiliation
      )
    `,
    )
    .eq("manuscript_id", manuscriptId);

  if (error) throw error;

  // Supabase returns potential_reviewers as an array when using nested select
  return (data || [])
    .filter((match) => match.potential_reviewers && match.potential_reviewers.length > 0)
    .map((match) => {
      const reviewer = match.potential_reviewers[0];
      return {
        id: match.reviewer_id,
        name: reviewer.name,
        email: reviewer.email,
        affiliation: reviewer.affiliation,
      };
    });
}

/**
 * Check which reviewers are shared across multiple manuscripts
 */
async function getSharedReviewers(
  supabase: SupabaseClient,
  manuscriptId: string,
  reviewerIds: string[],
): Promise<SharedReviewerInfo[]> {
  if (reviewerIds.length === 0) return [];

  // Get all matches for these reviewers across all manuscripts
  const { data: allMatches, error: matchError } = await supabase
    .from("reviewer_manuscript_matches")
    .select(
      `
      reviewer_id,
      manuscript_id,
      manuscripts (
        id,
        title,
        custom_id
      )
    `,
    )
    .in("reviewer_id", reviewerIds)
    .neq("manuscript_id", manuscriptId);

  if (matchError) throw matchError;

  // Get reviewer details
  const { data: reviewerData, error: reviewerError } = await supabase
    .from("potential_reviewers")
    .select("id, name, email, affiliation")
    .in("id", reviewerIds);

  if (reviewerError) throw reviewerError;

  // Group matches by reviewer
  // Note: Using any here because Supabase returns complex nested structures
  // that don't have proper TypeScript types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reviewerMatchMap = new Map<string, any[]>();
  (allMatches || []).forEach((match) => {
    if (!reviewerMatchMap.has(match.reviewer_id)) {
      reviewerMatchMap.set(match.reviewer_id, []);
    }
    reviewerMatchMap.get(match.reviewer_id)!.push(match);
  });

  // Build shared reviewer info
  const sharedReviewers: SharedReviewerInfo[] = [];
  (reviewerData || []).forEach((reviewer: ReviewerInfo) => {
    const otherMatches = reviewerMatchMap.get(reviewer.id) || [];
    if (otherMatches.length > 0) {
      sharedReviewers.push({
        id: reviewer.id,
        name: reviewer.name,
        email: reviewer.email,
        affiliation: reviewer.affiliation,
        otherManuscripts: otherMatches.map((m) => {
          // Supabase returns manuscripts as an array
          const manuscript = m.manuscripts[0];
          return {
            id: manuscript.id,
            title: manuscript.title,
            custom_id: manuscript.custom_id,
          };
        }),
        sharedMatchCount: otherMatches.length,
      });
    }
  });

  return sharedReviewers;
}

/**
 * Analyze the impact of deleting a manuscript and its reviewers
 */
export async function analyzeCleanupImpact(
  supabase: SupabaseClient,
  manuscriptId: string,
  onProgress?: ProgressCallback,
): Promise<ImpactAnalysis> {
  onProgress?.({
    phase: "analyzing",
    message: "Finding manuscript...",
  });

  // Get manuscript details
  const { data: manuscript, error: msError } = await supabase
    .from("manuscripts")
    .select("id, system_id, submission_id, custom_id, title")
    .eq("id", manuscriptId)
    .single();

  if (msError) throw msError;

  onProgress?.({
    phase: "analyzing",
    step: "reviewers",
    message: "Finding matched reviewers...",
  });

  // Get reviewers matched to this manuscript
  const reviewers = await getMatchedReviewers(supabase, manuscriptId);
  const reviewerIds = reviewers.map((r) => r.id);

  onProgress?.({
    phase: "analyzing",
    step: "shared",
    message: "Checking for shared reviewers...",
  });

  // Check for shared reviewers
  const sharedReviewers = await getSharedReviewers(
    supabase,
    manuscriptId,
    reviewerIds,
  );

  onProgress?.({
    phase: "analyzing",
    step: "stats",
    message: "Calculating deletion statistics...",
  });

  // Calculate statistics
  const stats = {
    manuscripts: 1,
    reviewers: reviewerIds.length,
    reviewerMatches: 0,
    reviewerMatchesAcrossManuscripts: 0,
    publications: 0,
    retractions: 0,
    reviewInvitations: 0,
    invitationQueue: 0,
    userManuscripts: 0,
    publicationMatches: 0,
  };

  if (reviewerIds.length > 0) {
    // Count all matches for these reviewers
    const { count: totalMatches } = await supabase
      .from("reviewer_manuscript_matches")
      .select("*", { count: "exact", head: true })
      .in("reviewer_id", reviewerIds);
    stats.reviewerMatchesAcrossManuscripts = totalMatches || 0;

    // Count matches just for this manuscript
    const { count: thisManuscriptMatches } = await supabase
      .from("reviewer_manuscript_matches")
      .select("*", { count: "exact", head: true })
      .eq("manuscript_id", manuscriptId);
    stats.reviewerMatches = thisManuscriptMatches || 0;

    // Count publications
    const { count: pubCount } = await supabase
      .from("reviewer_publications")
      .select("*", { count: "exact", head: true })
      .in("reviewer_id", reviewerIds);
    stats.publications = pubCount || 0;

    // Count retractions
    const { count: retCount } = await supabase
      .from("reviewer_retractions")
      .select("*", { count: "exact", head: true })
      .in("reviewer_id", reviewerIds);
    stats.retractions = retCount || 0;

    // Count review invitations
    const { count: invCount } = await supabase
      .from("review_invitations")
      .select("*", { count: "exact", head: true })
      .in("reviewer_id", reviewerIds);
    stats.reviewInvitations = invCount || 0;

    // Count invitation queue
    const { count: queueCount } = await supabase
      .from("invitation_queue")
      .select("*", { count: "exact", head: true })
      .in("reviewer_id", reviewerIds);
    stats.invitationQueue = queueCount || 0;
  }

  // Count publication matches for this manuscript
  const { count: pubMatchCount } = await supabase
    .from("manuscript_publication_matches")
    .select("*", { count: "exact", head: true })
    .eq("manuscript_id", manuscriptId);
  stats.publicationMatches = pubMatchCount || 0;

  // Count user manuscripts
  const { count: userMsCount } = await supabase
    .from("user_manuscripts")
    .select("*", { count: "exact", head: true })
    .eq("manuscript_id", manuscriptId);
  stats.userManuscripts = userMsCount || 0;

  onProgress?.({
    phase: "analyzing",
    message: "Analysis complete",
  });

  return {
    manuscript,
    reviewers,
    sharedReviewers,
    stats,
  };
}

// ============================================================================
// DELETION OPERATIONS
// ============================================================================

/**
 * Delete manuscript and all related data
 */
export async function deleteManuscriptData(
  supabase: SupabaseClient,
  manuscriptId: string,
  reviewerIds: string[],
  onProgress?: ProgressCallback,
): Promise<void> {
  onProgress?.({
    phase: "deleting",
    step: "publication_matches",
    message: "Deleting manuscript publication matches...",
  });

  // 1. Delete manuscript_publication_matches
  const { error: pubMatchError } = await supabase
    .from("manuscript_publication_matches")
    .delete()
    .eq("manuscript_id", manuscriptId);
  if (pubMatchError) throw pubMatchError;

  if (reviewerIds.length > 0) {
    onProgress?.({
      phase: "deleting",
      step: "publications",
      message: "Deleting reviewer publications...",
    });

    // 2. Delete reviewer publications
    const { error: pubError } = await supabase
      .from("reviewer_publications")
      .delete()
      .in("reviewer_id", reviewerIds);
    if (pubError) throw pubError;

    onProgress?.({
      phase: "deleting",
      step: "retractions",
      message: "Deleting reviewer retractions...",
    });

    // 3. Delete reviewer retractions
    const { error: retError } = await supabase
      .from("reviewer_retractions")
      .delete()
      .in("reviewer_id", reviewerIds);
    if (retError) throw retError;

    onProgress?.({
      phase: "deleting",
      step: "queue",
      message: "Deleting invitation queue entries...",
    });

    // 4. Delete invitation queue
    const { error: queueError } = await supabase
      .from("invitation_queue")
      .delete()
      .in("reviewer_id", reviewerIds);
    if (queueError) throw queueError;

    onProgress?.({
      phase: "deleting",
      step: "invitations",
      message: "Deleting review invitations...",
    });

    // 5. Delete review invitations
    const { error: invError } = await supabase
      .from("review_invitations")
      .delete()
      .in("reviewer_id", reviewerIds);
    if (invError) throw invError;

    onProgress?.({
      phase: "deleting",
      step: "matches",
      message: "Deleting reviewer matches...",
    });

    // 6. Delete reviewer-manuscript matches
    const { error: matchError } = await supabase
      .from("reviewer_manuscript_matches")
      .delete()
      .in("reviewer_id", reviewerIds);
    if (matchError) throw matchError;
  }

  onProgress?.({
    phase: "deleting",
    step: "user_assignments",
    message: "Deleting user assignments...",
  });

  // 7. Delete user-manuscript assignments
  const { error: userMsError } = await supabase
    .from("user_manuscripts")
    .delete()
    .eq("manuscript_id", manuscriptId);
  if (userMsError) throw userMsError;

  if (reviewerIds.length > 0) {
    onProgress?.({
      phase: "deleting",
      step: "reviewers",
      message: `Deleting ${reviewerIds.length} reviewers...`,
    });

    // 8. Delete reviewers
    const { error: reviewerError } = await supabase
      .from("potential_reviewers")
      .delete()
      .in("id", reviewerIds);
    if (reviewerError) throw reviewerError;
  }

  onProgress?.({
    phase: "deleting",
    step: "manuscript",
    message: "Deleting manuscript...",
  });

  // 9. Delete manuscript
  const { error: msError } = await supabase
    .from("manuscripts")
    .delete()
    .eq("id", manuscriptId);
  if (msError) throw msError;

  onProgress?.({
    phase: "complete",
    message: "Cleanup complete!",
  });
}
