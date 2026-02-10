// Reviewer-manuscript match management service
import { supabase } from "../shared/supabaseClient";

/**
 * Get all reviewer-manuscript matches with details
 * @returns All matches with reviewer and manuscript information
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAllReviewerMatches(): Promise<any[]> {
  const { data, error } = await supabase
    .from("reviewer_manuscript_matches")
    .select(
      `
      id,
      manuscript_id,
      reviewer_id,
      match_score,
      calculated_at,
      potential_reviewers (
        name,
        email,
        affiliation,
        expertise_areas
      ),
      manuscripts (
        title,
        journal,
        subject_area,
        status
      )
    `,
    )
    .order("calculated_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviewer matches:", error);
    throw error;
  }

  return data || [];
}

/**
 * Get matches for a specific manuscript
 * @param manuscriptId - The manuscript UUID
 */
export async function getMatchesForManuscript(
  manuscriptId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
  const { data, error } = await supabase
    .from("reviewer_manuscript_matches")
    .select(
      `
      id,
      reviewer_id,
      match_score,
      calculated_at,
      potential_reviewers (
        name,
        email,
        affiliation,
        expertise_areas
      )
    `,
    )
    .eq("manuscript_id", manuscriptId)
    .order("match_score", { ascending: false });

  if (error) {
    console.error("Error fetching matches for manuscript:", error);
    throw error;
  }

  return data || [];
}

/**
 * Add a reviewer-manuscript match
 * @param manuscriptId - The manuscript UUID
 * @param reviewerId - The reviewer UUID
 * @param matchScore - Match score (0-1, will be displayed as percentage)
 * @param isInitialSuggestion - Whether this is an AI-generated initial suggestion
 * @param conflictsOfInterest - Free-form text describing any conflicts
 */
export async function addReviewerMatch(
  manuscriptId: string,
  reviewerId: string,
  matchScore: number,
  isInitialSuggestion: boolean = false,
  conflictsOfInterest: string = "",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  // Validate match score
  if (matchScore < 0 || matchScore > 1) {
    throw new Error("Match score must be between 0 and 1");
  }

  // Check if match already exists
  const { data: existing } = await supabase
    .from("reviewer_manuscript_matches")
    .select("id, match_score")
    .eq("manuscript_id", manuscriptId)
    .eq("reviewer_id", reviewerId)
    .single();

  if (existing) {
    throw new Error(
      `Match already exists with score ${existing.match_score}. Use update instead.`,
    );
  }

  const { data, error } = await supabase
    .from("reviewer_manuscript_matches")
    .insert({
      manuscript_id: manuscriptId,
      reviewer_id: reviewerId,
      match_score: matchScore,
      calculated_at: new Date().toISOString(),
      is_initial_suggestion: isInitialSuggestion,
      conflicts_of_interest: conflictsOfInterest || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding reviewer match:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: error,
    });
    throw new Error(
      error.message ||
        error.hint ||
        `Failed to add reviewer match: ${JSON.stringify(error)}`,
    );
  }

  return data;
}

/**
 * Update match score for an existing reviewer-manuscript match
 * @param matchId - The match UUID
 * @param matchScore - New match score (0-1)
 * @param isInitialSuggestion - Whether this is an AI-generated initial suggestion
 * @param conflictsOfInterest - Free-form text describing any conflicts
 */
export async function updateReviewerMatch(
  matchId: string,
  matchScore: number,
  isInitialSuggestion?: boolean,
  conflictsOfInterest?: string,
): Promise<void> {
  // Validate match score
  if (matchScore < 0 || matchScore > 1) {
    throw new Error("Match score must be between 0 and 1");
  }

  const updateData: {
    match_score: number;
    calculated_at: string;
    is_initial_suggestion?: boolean;
    conflicts_of_interest?: string | null;
  } = {
    match_score: matchScore,
    calculated_at: new Date().toISOString(),
  };

  if (isInitialSuggestion !== undefined) {
    updateData.is_initial_suggestion = isInitialSuggestion;
  }

  if (conflictsOfInterest !== undefined) {
    updateData.conflicts_of_interest = conflictsOfInterest || null;
  }

  const { error } = await supabase
    .from("reviewer_manuscript_matches")
    .update(updateData)
    .eq("id", matchId);

  if (error) {
    console.error("Error updating match:", error);
    throw error;
  }
}

/**
 * @deprecated Use updateReviewerMatch instead
 */
export async function updateReviewerMatchScore(
  matchId: string,
  matchScore: number,
): Promise<void> {
  return updateReviewerMatch(matchId, matchScore);
}

/**
 * Remove a reviewer-manuscript match
 * @param matchId - The match UUID
 */
export async function removeReviewerMatch(matchId: string): Promise<void> {
  const { error } = await supabase
    .from("reviewer_manuscript_matches")
    .delete()
    .eq("id", matchId);

  if (error) {
    console.error("Error removing reviewer match:", error);
    throw error;
  }
}

/**
 * Bulk add matches for a manuscript with auto-calculated scores
 * @param manuscriptId - The manuscript UUID
 * @param reviewerIds - Array of reviewer UUIDs
 * @param baseScore - Starting score for the first reviewer (decrements by 1 for each subsequent)
 */
export async function bulkAddReviewerMatches(
  manuscriptId: string,
  reviewerIds: string[],
  baseScore: number = 95,
): Promise<void> {
  const matches = reviewerIds.map((reviewerId, index) => ({
    manuscript_id: manuscriptId,
    reviewer_id: reviewerId,
    match_score: Math.max(50, baseScore - index), // Decrement score, minimum 50
    calculated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("reviewer_manuscript_matches")
    .insert(matches);

  if (error) {
    console.error("Error bulk adding matches:", error);
    throw error;
  }
}
