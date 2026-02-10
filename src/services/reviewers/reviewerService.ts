// Reviewer management service
import { supabase } from "../shared/supabaseClient";
import type {
  PotentialReviewer,
  PotentialReviewerWithMatch,
} from "@/lib/supabase";
import {
  isInstitutionalEmail,
  calculateAcceptanceRate,
  daysSince,
  countSoloAuthored,
  countRecentPublications,
  countRelatedPublications,
} from "@/utils/reviewerMetrics";

/**
 * Fetch all potential reviewers (for browsing/searching entire database)
 * Returns reviewers without match scores
 */
export async function getAllReviewers(): Promise<PotentialReviewer[]> {
  const { data, error } = await supabase
    .from("potential_reviewers")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching all reviewers:", error);
    throw error;
  }

  return data || [];
}

/**
 * Fetch potential reviewers for a specific manuscript with match scores
 * @param manuscriptId - The manuscript UUID
 */
export async function getManuscriptReviewers(
  manuscriptId: string,
): Promise<PotentialReviewerWithMatch[]> {
  // First, get the manuscript to know its journal
  const { data: manuscript } = await supabase
    .from("manuscripts")
    .select("journal")
    .eq("id", manuscriptId)
    .single();

  const manuscriptJournal = manuscript?.journal || "";

  const { data, error } = await supabase
    .from("reviewer_manuscript_matches")
    .select(
      `
      match_score,
      conflicts_of_interest,
      potential_reviewers (*)
    `,
    )
    .eq("manuscript_id", manuscriptId)
    .order("match_score", { ascending: false });

  if (error) {
    console.error("Error fetching manuscript reviewers:", error);
    throw error;
  }

  // Get unique reviewer IDs
  const reviewerIds = (data || []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: any) => item.potential_reviewers.id,
  );

  // Fetch publications for all reviewers in parallel
  const { data: publications } = await supabase
    .from("reviewer_publications")
    .select("id, reviewer_id, authors, publication_date, journal_name")
    .in("reviewer_id", reviewerIds);

  // Fetch related publications for this manuscript
  const { data: relatedPublications } = await supabase
    .from("manuscript_publication_matches")
    .select("publication_id")
    .eq("manuscript_id", manuscriptId);

  const relatedPublicationIds = new Set(
    (relatedPublications || []).map((m) => m.publication_id),
  );

  // Group publications by reviewer_id and track journal matches
  const publicationsByReviewer = new Map<
    string,
    Array<{
      authors: string[] | null;
      publication_date: string | null;
      is_related: boolean;
    }>
  >();

  const publishedInJournalByReviewer = new Map<string, boolean>();

  (publications || []).forEach((pub) => {
    const existing = publicationsByReviewer.get(pub.reviewer_id) || [];
    existing.push({
      authors: pub.authors,
      publication_date: pub.publication_date,
      is_related: relatedPublicationIds.has(pub.id), // Check if related to this manuscript
    });
    publicationsByReviewer.set(pub.reviewer_id, existing);

    // Check if this publication is in the same journal as the manuscript
    if (
      pub.journal_name &&
      manuscriptJournal &&
      pub.journal_name.toLowerCase() === manuscriptJournal.toLowerCase()
    ) {
      publishedInJournalByReviewer.set(pub.reviewer_id, true);
    }
  });

  // Transform the nested structure to include match_score, conflicts, and calculated fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((item: any) => {
    const reviewer = item.potential_reviewers;
    const reviewerPubs = publicationsByReviewer.get(reviewer.id) || [];

    return {
      ...reviewer,
      match_score: item.match_score,
      conflicts_of_interest: item.conflicts_of_interest || "",
      email_is_institutional: isInstitutionalEmail(reviewer.email),
      acceptance_rate: calculateAcceptanceRate(
        reviewer.total_acceptances || 0,
        reviewer.total_invitations || 0,
      ),
      related_publications_count: countRelatedPublications(reviewerPubs),
      solo_authored_count: countSoloAuthored(reviewerPubs),
      publications_last_5_years: countRecentPublications(reviewerPubs, 5),
      days_since_last_review: daysSince(reviewer.last_review_completed),
      published_in_journal:
        publishedInJournalByReviewer.get(reviewer.id) || false,
    };
  });
}

/**
 * Get reviewers with their current status in the invitation workflow
 * Combines data from invitation_queue, review_invitations, and potential_reviewers
 * @param manuscriptId - The manuscript UUID
 */
export async function getReviewersWithStatus(
  manuscriptId: string,
): Promise<import("@/lib/supabase").ReviewerWithStatus[]> {
  // Get all potential reviewers with match scores
  const { data: matchedReviewers, error: matchError } = await supabase
    .from("reviewer_manuscript_matches")
    .select(
      `
      match_score,
      potential_reviewers (*)
    `,
    )
    .eq("manuscript_id", manuscriptId);

  if (matchError) {
    console.error("Error fetching matched reviewers:", matchError);
    throw matchError;
  }

  // Get queue items for this manuscript
  const { data: queueItems, error: queueError } = await supabase
    .from("invitation_queue")
    .select("*")
    .eq("manuscript_id", manuscriptId)
    .eq("sent", false);

  if (queueError) {
    console.error("Error fetching queue:", queueError);
    throw queueError;
  }

  // Get invitations for this manuscript
  const { data: invitations, error: invitationError } = await supabase
    .from("review_invitations")
    .select("*")
    .eq("manuscript_id", manuscriptId);

  if (invitationError) {
    console.error("Error fetching invitations:", invitationError);
    throw invitationError;
  }

  // Collect all unique reviewer IDs from queue and invitations
  const reviewerIdsInWorkflow = new Set<string>();
  (queueItems || []).forEach((q) => reviewerIdsInWorkflow.add(q.reviewer_id));
  (invitations || []).forEach((i) => reviewerIdsInWorkflow.add(i.reviewer_id));

  // Get reviewer IDs from matches
  const matchedReviewerIds = new Set(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (matchedReviewers || []).map((m: any) => m.potential_reviewers.id),
  );

  // Find reviewer IDs that are in workflow but not in matches
  const unmatchedReviewerIds = Array.from(reviewerIdsInWorkflow).filter(
    (id) => !matchedReviewerIds.has(id),
  );

  // Fetch unmatched reviewers from potential_reviewers table
  let unmatchedReviewers = [];
  if (unmatchedReviewerIds.length > 0) {
    const { data: additionalReviewers } = await supabase
      .from("potential_reviewers")
      .select("*")
      .in("id", unmatchedReviewerIds);
    unmatchedReviewers = additionalReviewers || [];
  }

  // Build lookup maps
  const queueMap = new Map((queueItems || []).map((q) => [q.reviewer_id, q]));
  const invitationMap = new Map(
    (invitations || []).map((i) => [i.reviewer_id, i]),
  );

  // Process matched reviewers
  const matchedReviewersWithStatus = (matchedReviewers || []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: any) => {
      const reviewer = item.potential_reviewers;
      const queueItem = queueMap.get(reviewer.id);
      const invitation = invitationMap.get(reviewer.id);

      // Determine status
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let invitation_status: any = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let additionalFields: any = {};

      if (queueItem) {
        invitation_status = "queued";
        additionalFields = {
          queue_position: queueItem.queue_position,
          queue_id: queueItem.id,
          priority: queueItem.priority,
          scheduled_send_date: queueItem.scheduled_send_date,
        };
      } else if (invitation) {
        invitation_status = invitation.status;
        additionalFields = {
          invitation_id: invitation.id,
          invited_date: invitation.invited_date,
          response_date: invitation.response_date,
          due_date: invitation.due_date,
        };
      }

      return {
        ...reviewer,
        match_score: item.match_score,
        invitation_status,
        ...additionalFields,
      };
    },
  );

  // Process unmatched reviewers (those in queue/invitations but not in matches)
  const unmatchedReviewersWithStatus = unmatchedReviewers.map((reviewer) => {
    const queueItem = queueMap.get(reviewer.id);
    const invitation = invitationMap.get(reviewer.id);

    // Determine status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let invitation_status: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let additionalFields: any = {};

    if (queueItem) {
      invitation_status = "queued";
      additionalFields = {
        queue_position: queueItem.queue_position,
        queue_id: queueItem.id,
        priority: queueItem.priority,
        scheduled_send_date: queueItem.scheduled_send_date,
      };
    } else if (invitation) {
      invitation_status = invitation.status;
      additionalFields = {
        invitation_id: invitation.id,
        invited_date: invitation.invited_date,
        response_date: invitation.response_date,
        due_date: invitation.due_date,
      };
    }

    return {
      ...reviewer,
      match_score: 0, // No match score for unmatched reviewers
      invitation_status,
      ...additionalFields,
    };
  });

  // Combine both sets
  return [...matchedReviewersWithStatus, ...unmatchedReviewersWithStatus];
}

/**
 * Check which reviewers have published in a specific journal
 * @param reviewerIds - Array of reviewer UUIDs
 * @param journalName - Name of the journal to check
 * @returns Map of reviewer ID -> boolean (true if published in journal)
 */
export async function checkReviewersPublishedInJournal(
  reviewerIds: string[],
  journalName: string,
): Promise<Map<string, boolean>> {
  if (reviewerIds.length === 0 || !journalName) {
    return new Map();
  }

  const publishedInJournal = new Map<string, boolean>();

  // Batch requests to avoid URL length limits (max ~100 UUIDs per request)
  const BATCH_SIZE = 100;
  const batches = [];

  for (let i = 0; i < reviewerIds.length; i += BATCH_SIZE) {
    batches.push(reviewerIds.slice(i, i + BATCH_SIZE));
  }

  // Process batches in parallel
  const results = await Promise.all(
    batches.map(async (batch) => {
      const { data } = await supabase
        .from("reviewer_publications")
        .select("reviewer_id, journal_name")
        .in("reviewer_id", batch);
      return data || [];
    }),
  );

  // Flatten results and build map
  results.flat().forEach((pub) => {
    if (
      pub.journal_name &&
      pub.journal_name.toLowerCase() === journalName.toLowerCase()
    ) {
      publishedInJournal.set(pub.reviewer_id, true);
    }
  });

  return publishedInJournal;
}

/**
 * Add a new reviewer to the potential_reviewers table
 * @param reviewer - The reviewer data (without id, created_at, updated_at)
 * @returns The created reviewer
 */
export async function addReviewer(
  reviewer: Omit<PotentialReviewer, "id" | "match_score">,
): Promise<PotentialReviewer> {
  // Check if reviewer with this email already exists
  const { data: existing } = await supabase
    .from("potential_reviewers")
    .select("id, email")
    .eq("email", reviewer.email)
    .single();

  if (existing) {
    throw new Error(`Reviewer with email ${reviewer.email} already exists`);
  }

  // Prepare insert data, removing any undefined or empty string values for UUID/date fields
  const insertData = { ...reviewer };

  // Clean up the data - remove keys with undefined values
  Object.keys(insertData).forEach((key) => {
    if (insertData[key as keyof typeof insertData] === undefined) {
      delete insertData[key as keyof typeof insertData];
    }
  });

  const { data, error } = await supabase
    .from("potential_reviewers")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error("Error adding reviewer:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(
      error.message || "Failed to add reviewer. Please check your data.",
    );
  }

  return { ...data, match_score: 0 };
}

/**
 * Update an existing reviewer
 * @param reviewerId - The reviewer's UUID
 * @param updates - Fields to update
 */
export async function updateReviewer(
  reviewerId: string,
  updates: Partial<Omit<PotentialReviewer, "id" | "match_score">>,
): Promise<void> {
  // If email is being updated, check for duplicates
  if (updates.email) {
    const { data: existing } = await supabase
      .from("potential_reviewers")
      .select("id")
      .eq("email", updates.email)
      .neq("id", reviewerId)
      .maybeSingle();

    if (existing) {
      throw new Error(
        `Another reviewer with email ${updates.email} already exists`,
      );
    }
  }

  // Ensure required fields are not set to empty strings
  const cleanedUpdates = { ...updates };

  // affiliation is NOT NULL in database, so ensure it has a value
  if ("affiliation" in cleanedUpdates && !cleanedUpdates.affiliation) {
    cleanedUpdates.affiliation = "Not specified";
  }

  // Remove any undefined or empty string values that would cause issues
  Object.keys(cleanedUpdates).forEach((key) => {
    const value = cleanedUpdates[key as keyof typeof cleanedUpdates];
    if (value === undefined || value === "") {
      delete cleanedUpdates[key as keyof typeof cleanedUpdates];
    }
  });

  console.log("Updating reviewer:", { reviewerId, updates: cleanedUpdates });

  const { data, error } = await supabase
    .from("potential_reviewers")
    .update({
      ...cleanedUpdates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reviewerId)
    .select();

  console.log("Update result:", {
    data,
    error: error ? JSON.stringify(error) : null,
  });

  if (error) {
    console.error("Error updating reviewer:", {
      error,
      errorString: JSON.stringify(error),
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      updates: cleanedUpdates,
    });
    throw new Error(
      error.message || "Failed to update reviewer. Please check your data.",
    );
  }
}

/**
 * Delete a reviewer from the database
 * Note: This will fail if the reviewer has associated records (matches, invitations, etc.)
 * @param reviewerId - The reviewer's UUID
 */
export async function deleteReviewer(reviewerId: string): Promise<void> {
  const { error } = await supabase
    .from("potential_reviewers")
    .delete()
    .eq("id", reviewerId);

  if (error) {
    console.error("Error deleting reviewer:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    // Provide user-friendly error message for foreign key constraint
    if (error.code === "23503") {
      throw new Error(
        "Cannot delete reviewer: they have existing matches or invitations. Remove those first.",
      );
    }

    throw error;
  }
}
