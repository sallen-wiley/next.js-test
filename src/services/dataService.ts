// Mock data service for reviewer invitation system
import {
  supabase,
  Manuscript,
  PotentialReviewer,
  ReviewInvitation,
  InvitationQueue,
  InvitationQueueItem,
  UserManuscript,
  ManuscriptWithUserRole,
  PotentialReviewerWithMatch,
} from "@/lib/supabase";

// Legacy article data for backward compatibility
export const mockArticles = [
  {
    id: "1",
    title: "Machine Learning Applications in Natural Language Processing",
    authors: ["Dr. Jane Smith", "Prof. John Doe", "Dr. Alice Johnson"],
    journal: "Journal of AI Research",
    publication_date: "2024-03-15",
    doi: "10.1000/xyz123",
    abstract:
      "This paper explores the latest applications of machine learning techniques in natural language processing, focusing on transformer architectures and their impact on text understanding.",
    open_access: true,
    citation_count: 42,
    status: "published",
  },
  {
    id: "2",
    title: "Sustainable Energy Solutions for Smart Cities",
    authors: ["Dr. Michael Brown", "Dr. Sarah Wilson"],
    journal: "Environmental Technology",
    publication_date: "2024-02-28",
    doi: "10.1000/abc456",
    abstract:
      "An analysis of renewable energy integration in urban environments, examining the challenges and opportunities for sustainable city development.",
    open_access: false,
    citation_count: 28,
    status: "published",
  },
  {
    id: "3",
    title: "Quantum Computing Breakthroughs in Cryptography",
    authors: ["Prof. David Lee", "Dr. Maria Garcia", "Dr. Robert Taylor"],
    journal: "Quantum Information Science",
    publication_date: "2024-01-20",
    doi: "10.1000/def789",
    abstract:
      "Recent developments in quantum computing and their implications for modern cryptographic systems.",
    open_access: true,
    citation_count: 156,
    status: "in_review",
  },
  {
    id: "4",
    title: "Biomedical Engineering Innovations in Drug Delivery",
    authors: ["Dr. Emily Chen", "Prof. Mark Anderson"],
    journal: "Biomedical Engineering Today",
    publication_date: "2024-04-10",
    doi: "10.1000/ghi012",
    abstract:
      "Novel approaches to targeted drug delivery using nanotechnology and biocompatible materials.",
    open_access: true,
    citation_count: 73,
    status: "draft",
  },
];

export const mockManuscript: Manuscript = {
  id: "ms-001",
  title:
    "Deep Learning Approaches for Natural Language Processing in Scientific Literature",
  authors: ["Dr. Sarah Chen", "Prof. Michael Rodriguez", "Dr. Jennifer Liu"],
  journal: "Journal of Computational Linguistics",
  submission_date: "2024-10-01T09:00:00Z",
  abstract:
    "This paper presents novel deep learning approaches for extracting and analyzing scientific literature, focusing on transformer architectures and their applications in academic text processing.",
  keywords: [
    "deep learning",
    "natural language processing",
    "transformers",
    "scientific literature",
    "text mining",
  ],
  subject_area: "Computer Science - Computational Linguistics",
  status: "under_review",
  editor_id: "editor-001",
};

export const mockPotentialReviewers: PotentialReviewer[] = [
  {
    id: "rev-001",
    name: "Dr. Alice Thompson",
    email: "a.thompson@stanford.edu",
    affiliation: "Stanford University",
    department: "Computer Science",
    expertise_areas: [
      "natural language processing",
      "machine learning",
      "computational linguistics",
    ],
    match_score: 95,
    current_review_load: 2,
    max_review_capacity: 4,
    average_review_time_days: 21,
    recent_publications: 12,
    h_index: 45,
    last_review_completed: "2024-09-15T00:00:00Z",
    availability_status: "available",
    response_rate: 85,
    quality_score: 92,
    conflicts_of_interest: [],
  },
  {
    id: "rev-002",
    name: "Prof. David Kim",
    email: "d.kim@mit.edu",
    affiliation: "MIT",
    department: "Electrical Engineering and Computer Science",
    expertise_areas: [
      "deep learning",
      "neural networks",
      "artificial intelligence",
    ],
    match_score: 88,
    current_review_load: 3,
    max_review_capacity: 3,
    average_review_time_days: 18,
    recent_publications: 8,
    h_index: 38,
    last_review_completed: "2024-08-20T00:00:00Z",
    availability_status: "busy",
    response_rate: 92,
    quality_score: 88,
    conflicts_of_interest: [],
  },
  {
    id: "rev-003",
    name: "Dr. Maria Gonzalez",
    email: "m.gonzalez@berkeley.edu",
    affiliation: "UC Berkeley",
    department: "Linguistics",
    expertise_areas: [
      "computational linguistics",
      "text processing",
      "corpus linguistics",
    ],
    match_score: 91,
    current_review_load: 1,
    max_review_capacity: 5,
    average_review_time_days: 25,
    recent_publications: 15,
    h_index: 52,
    last_review_completed: "2024-09-30T00:00:00Z",
    availability_status: "available",
    response_rate: 78,
    quality_score: 95,
    conflicts_of_interest: [],
  },
  {
    id: "rev-004",
    name: "Prof. James Wilson",
    email: "j.wilson@cmu.edu",
    affiliation: "Carnegie Mellon University",
    department: "Language Technologies Institute",
    expertise_areas: [
      "information retrieval",
      "text mining",
      "natural language processing",
    ],
    match_score: 82,
    current_review_load: 4,
    max_review_capacity: 4,
    average_review_time_days: 30,
    recent_publications: 6,
    h_index: 35,
    last_review_completed: "2024-07-10T00:00:00Z",
    availability_status: "busy",
    response_rate: 65,
    quality_score: 85,
    conflicts_of_interest: [],
  },
  {
    id: "rev-005",
    name: "Dr. Emma Davis",
    email: "e.davis@oxford.ac.uk",
    affiliation: "University of Oxford",
    department: "Computer Science",
    expertise_areas: [
      "machine learning",
      "data mining",
      "artificial intelligence",
    ],
    match_score: 79,
    current_review_load: 1,
    max_review_capacity: 3,
    average_review_time_days: 22,
    recent_publications: 10,
    h_index: 28,
    last_review_completed: "2024-09-05T00:00:00Z",
    availability_status: "available",
    response_rate: 88,
    quality_score: 90,
    conflicts_of_interest: [],
  },
  {
    id: "rev-006",
    name: "Prof. Robert Zhang",
    email: "r.zhang@toronto.ca",
    affiliation: "University of Toronto",
    department: "Computer Science",
    expertise_areas: ["deep learning", "transformers", "language models"],
    match_score: 93,
    current_review_load: 0,
    max_review_capacity: 4,
    average_review_time_days: 19,
    recent_publications: 18,
    h_index: 41,
    last_review_completed: "2024-08-15T00:00:00Z",
    availability_status: "available",
    response_rate: 90,
    quality_score: 93,
    conflicts_of_interest: ["Dr. Sarah Chen"], // Conflict with manuscript author
  },
  {
    id: "rev-007",
    name: "Dr. Lisa Anderson",
    email: "l.anderson@washington.edu",
    affiliation: "University of Washington",
    department: "Linguistics",
    expertise_areas: [
      "computational linguistics",
      "semantic analysis",
      "text classification",
    ],
    match_score: 86,
    current_review_load: 2,
    max_review_capacity: 5,
    average_review_time_days: 28,
    recent_publications: 9,
    h_index: 33,
    availability_status: "available",
    response_rate: 82,
    quality_score: 87,
    conflicts_of_interest: [],
  },
  {
    id: "rev-008",
    name: "Prof. Ahmed Hassan",
    email: "a.hassan@egypt.edu",
    affiliation: "Cairo University",
    department: "Computer Science",
    expertise_areas: [
      "natural language processing",
      "arabic nlp",
      "cross-lingual processing",
    ],
    match_score: 75,
    current_review_load: 3,
    max_review_capacity: 3,
    average_review_time_days: 35,
    recent_publications: 7,
    h_index: 24,
    availability_status: "busy",
    response_rate: 70,
    quality_score: 82,
    conflicts_of_interest: [],
  },
];

export const mockReviewInvitations: ReviewInvitation[] = [
  {
    id: "inv-001",
    manuscript_id: "ms-001",
    reviewer_id: "rev-001",
    invited_date: "2024-10-10T10:00:00Z",
    due_date: "2024-11-10T23:59:59Z",
    status: "accepted",
    response_date: "2024-10-12T14:30:00Z",
    invitation_round: 1,
    reminder_count: 0,
    estimated_completion_date: "2024-11-08T00:00:00Z",
  },
  {
    id: "inv-002",
    manuscript_id: "ms-001",
    reviewer_id: "rev-003",
    invited_date: "2024-10-10T10:00:00Z",
    due_date: "2024-11-10T23:59:59Z",
    status: "pending",
    invitation_round: 1,
    reminder_count: 1,
    notes: "Sent reminder on Oct 13",
  },
  {
    id: "inv-003",
    manuscript_id: "ms-001",
    reviewer_id: "rev-006",
    invited_date: "2024-10-10T10:00:00Z",
    due_date: "2024-11-10T23:59:59Z",
    status: "declined",
    response_date: "2024-10-11T09:15:00Z",
    invitation_round: 1,
    reminder_count: 0,
    notes: "Declined due to conflict of interest with author Dr. Sarah Chen",
  },
];

export const mockInvitationQueue: InvitationQueue[] = [
  {
    id: "queue-001",
    manuscript_id: "ms-001",
    reviewer_id: "rev-002",
    queue_position: 1,
    created_date: "2024-10-12T15:00:00Z",
    scheduled_send_date: "2024-10-17T09:00:00Z",
    priority: "high",
    notes: "Backup reviewer - high match score",
  },
  {
    id: "queue-002",
    manuscript_id: "ms-001",
    reviewer_id: "rev-005",
    queue_position: 2,
    created_date: "2024-10-12T15:05:00Z",
    scheduled_send_date: "2024-10-24T09:00:00Z",
    priority: "normal",
  },
  {
    id: "queue-003",
    manuscript_id: "ms-001",
    reviewer_id: "rev-007",
    queue_position: 3,
    created_date: "2024-10-12T15:10:00Z",
    scheduled_send_date: "2024-10-31T09:00:00Z",
    priority: "normal",
  },
];

// Service class to handle reviewer invitation data
export class ReviewerDataService {
  private useMockData: boolean;

  constructor() {
    this.useMockData = process.env.USE_MOCK_DATA === "true" || true;
  }

  async getPotentialReviewers(params: {
    manuscriptId: string;
    sortBy?: "match_score" | "availability" | "response_rate" | "quality_score";
    filterBy?: {
      minMatchScore?: number;
      availability?: string[];
      maxCurrentLoad?: number;
    };
    search?: string;
  }) {
    if (this.useMockData) {
      return this.getMockReviewers(params);
    }

    // TODO: Implement real API call
    const response = await fetch(
      `/api/reviewers?manuscriptId=${params.manuscriptId}`
    );
    return response.json();
  }

  async getReviewInvitations(manuscriptId: string) {
    if (this.useMockData) {
      return mockReviewInvitations.filter(
        (inv) => inv.manuscript_id === manuscriptId
      );
    }

    const response = await fetch(
      `/api/invitations?manuscriptId=${manuscriptId}`
    );
    return response.json();
  }

  async getInvitationQueue(manuscriptId: string) {
    if (this.useMockData) {
      return mockInvitationQueue.filter(
        (queue) => queue.manuscript_id === manuscriptId
      );
    }

    const response = await fetch(
      `/api/invitation-queue?manuscriptId=${manuscriptId}`
    );
    return response.json();
  }

  private getMockReviewers(params: {
    manuscriptId: string;
    sortBy?: "match_score" | "availability" | "response_rate" | "quality_score";
    filterBy?: {
      minMatchScore?: number;
      availability?: string[];
      maxCurrentLoad?: number;
    };
    search?: string;
  }) {
    let filteredReviewers = [...mockPotentialReviewers];

    // Apply filters
    if (params.filterBy?.minMatchScore) {
      filteredReviewers = filteredReviewers.filter(
        (r) => r.match_score >= params.filterBy!.minMatchScore!
      );
    }

    if (params.filterBy?.availability) {
      filteredReviewers = filteredReviewers.filter((r) =>
        params.filterBy!.availability!.includes(r.availability_status)
      );
    }

    if (params.filterBy?.maxCurrentLoad !== undefined) {
      filteredReviewers = filteredReviewers.filter(
        (r) => r.current_review_load <= params.filterBy!.maxCurrentLoad!
      );
    }

    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredReviewers = filteredReviewers.filter(
        (r) =>
          r.name.toLowerCase().includes(searchTerm) ||
          r.affiliation.toLowerCase().includes(searchTerm) ||
          r.expertise_areas.some((area) =>
            area.toLowerCase().includes(searchTerm)
          )
      );
    }

    // Apply sorting
    if (params.sortBy) {
      filteredReviewers.sort((a, b) => {
        switch (params.sortBy) {
          case "match_score":
            return b.match_score - a.match_score;
          case "response_rate":
            return b.response_rate - a.response_rate;
          case "quality_score":
            return b.quality_score - a.quality_score;
          case "availability":
            const order = {
              available: 0,
              busy: 1,
              unavailable: 2,
              sabbatical: 3,
            };
            return order[a.availability_status] - order[b.availability_status];
          default:
            return 0;
        }
      });
    }

    return {
      data: filteredReviewers,
      manuscript: mockManuscript,
    };
  }
}

export const reviewerDataService = new ReviewerDataService();

// ============================================================================
// User Manuscript Assignment Functions
// ============================================================================

/**
 * Fetch manuscripts assigned to a specific user
 * @param userId - The user's UUID from auth
 * @param activeOnly - Return only active assignments
 */
export async function getUserManuscripts(
  userId: string,
  activeOnly: boolean = true
): Promise<ManuscriptWithUserRole[]> {
  const query = supabase
    .from("user_manuscripts")
    .select(
      `
      role,
      assigned_date,
      manuscripts (*)
    `
    )
    .eq("user_id", userId);

  if (activeOnly) {
    query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching user manuscripts:", error);
    throw error;
  }

  // Transform the nested structure to flat ManuscriptWithUserRole
  return (data || []).map((item: any) => ({
    ...item.manuscripts,
    user_role: item.role,
    assigned_date: item.assigned_date,
  }));
}

/**
 * Fetch potential reviewers for a specific manuscript with match scores
 * @param manuscriptId - The manuscript UUID
 */
export async function getManuscriptReviewers(
  manuscriptId: string
): Promise<PotentialReviewerWithMatch[]> {
  const { data, error } = await supabase
    .from("reviewer_manuscript_matches")
    .select(
      `
      match_score,
      potential_reviewers (*)
    `
    )
    .eq("manuscript_id", manuscriptId)
    .order("match_score", { ascending: false });

  if (error) {
    console.error("Error fetching manuscript reviewers:", error);
    throw error;
  }

  // Transform the nested structure to include match_score at top level
  return (data || []).map((item: any) => ({
    ...item.potential_reviewers,
    match_score: item.match_score,
  }));
}

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
 * Fetch review invitations for a specific manuscript
 * @param manuscriptId - The manuscript UUID
 */
export async function getManuscriptInvitations(
  manuscriptId: string
): Promise<ReviewInvitation[]> {
  const { data, error } = await supabase
    .from("review_invitations")
    .select("*")
    .eq("manuscript_id", manuscriptId)
    .order("invited_date", { ascending: false });

  if (error) {
    console.error("Error fetching manuscript invitations:", error);
    throw error;
  }

  return data || [];
}

/**
 * Fetch a single manuscript by ID
 * @param manuscriptId - The manuscript UUID
 */
export async function getManuscriptById(
  manuscriptId: string
): Promise<Manuscript | null> {
  const { data, error } = await supabase
    .from("manuscripts")
    .select("*")
    .eq("id", manuscriptId)
    .single();

  if (error) {
    console.error("Error fetching manuscript by ID:", error);
    return null;
  }

  return data;
}

/**
 * Fetch invitation queue for a specific manuscript
 * @param manuscriptId - The manuscript UUID
 */
export async function getManuscriptQueue(
  manuscriptId: string
): Promise<InvitationQueueItem[]> {
  const { data, error } = await supabase
    .from("invitation_queue")
    .select(
      `
      *,
      potential_reviewers!reviewer_id (
        name,
        affiliation
      )
    `
    )
    .eq("manuscript_id", manuscriptId)
    .order("queue_position", { ascending: true });

  if (error) {
    console.error("Error fetching manuscript queue:", error);
    throw error;
  }

  // Transform the nested data structure
  const queueItems: InvitationQueueItem[] = (data || []).map((item: any) => ({
    id: item.id,
    manuscript_id: item.manuscript_id,
    reviewer_id: item.reviewer_id,
    queue_position: item.queue_position,
    created_date: item.created_date,
    scheduled_send_date: item.scheduled_send_date,
    priority: item.priority,
    notes: item.notes,
    reviewer_name: item.potential_reviewers?.name || "Unknown Reviewer",
    reviewer_affiliation: item.potential_reviewers?.affiliation,
  }));

  return queueItems;
}

/**
 * Add a reviewer to the invitation queue
 * @param manuscriptId - The manuscript UUID
 * @param reviewerId - The reviewer UUID
 * @param priority - Queue priority level
 */
export async function addToQueue(
  manuscriptId: string,
  reviewerId: string,
  priority: "high" | "normal" | "low" = "normal"
): Promise<InvitationQueue | null> {
  // Get current max position for this manuscript
  const { data: existingQueue } = await supabase
    .from("invitation_queue")
    .select("queue_position")
    .eq("manuscript_id", manuscriptId)
    .order("queue_position", { ascending: false })
    .limit(1);

  const nextPosition =
    existingQueue && existingQueue.length > 0
      ? existingQueue[0].queue_position + 1
      : 1;

  // Calculate scheduled send date (weekly intervals)
  const scheduledDate = new Date();
  scheduledDate.setDate(scheduledDate.getDate() + nextPosition * 7);

  const { data, error } = await supabase
    .from("invitation_queue")
    .insert({
      manuscript_id: manuscriptId,
      reviewer_id: reviewerId,
      queue_position: nextPosition,
      scheduled_send_date: scheduledDate.toISOString(),
      priority,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding to queue:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: error,
    });
    throw new Error(
      `Failed to add to queue: ${error.message || JSON.stringify(error)}`
    );
  }

  return data;
}

/**
 * Remove a reviewer from the invitation queue
 * @param queueItemId - The queue item UUID
 */
export async function removeFromQueue(queueItemId: string): Promise<void> {
  const { error } = await supabase
    .from("invitation_queue")
    .delete()
    .eq("id", queueItemId);

  if (error) {
    console.error("Error removing from queue:", error);
    throw error;
  }
}

/**
 * Update queue positions (for drag-and-drop reordering)
 * @param updates - Array of {id, newPosition} objects
 */
export async function updateQueuePositions(
  updates: Array<{ id: string; queue_position: number }>
): Promise<void> {
  // Update each item's position
  const promises = updates.map(({ id, queue_position }) =>
    supabase.from("invitation_queue").update({ queue_position }).eq("id", id)
  );

  const results = await Promise.all(promises);

  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    console.error("Error updating queue positions:", errors);
    throw new Error("Failed to update queue positions");
  }
}

/**
 * Get reviewers with their current status in the invitation workflow
 * Combines data from invitation_queue, review_invitations, and potential_reviewers
 * @param manuscriptId - The manuscript UUID
 */
export async function getReviewersWithStatus(
  manuscriptId: string
): Promise<import("@/lib/supabase").ReviewerWithStatus[]> {
  // Get all potential reviewers with match scores
  const { data: matchedReviewers, error: matchError } = await supabase
    .from("reviewer_manuscript_matches")
    .select(
      `
      match_score,
      potential_reviewers (*)
    `
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

  // Build lookup maps
  const queueMap = new Map(
    (queueItems || []).map((q) => [q.reviewer_id, q])
  );
  const invitationMap = new Map(
    (invitations || []).map((i) => [i.reviewer_id, i])
  );

  // Combine data
  const reviewersWithStatus = (matchedReviewers || []).map((item: any) => {
    const reviewer = item.potential_reviewers;
    const queueItem = queueMap.get(reviewer.id);
    const invitation = invitationMap.get(reviewer.id);

    // Determine status
    let invitation_status: any = null;
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
  });

  return reviewersWithStatus;
}

/**
 * Update the status of a review invitation
 * @param invitationId - The invitation UUID
 * @param status - The new status
 */
export async function updateInvitationStatus(
  invitationId: string,
  status: import("@/lib/supabase").ReviewInvitation["status"]
): Promise<void> {
  const { error } = await supabase
    .from("review_invitations")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", invitationId);

  if (error) {
    console.error("Error updating invitation status:", error);
    throw error;
  }
}

/**
 * Revoke a pending invitation
 * Marks the invitation as expired and optionally adds it back to queue
 * @param invitationId - The invitation UUID
 * @param addBackToQueue - Whether to add reviewer back to queue
 */
export async function revokeInvitation(
  invitationId: string,
  addBackToQueue: boolean = false
): Promise<void> {
  // Get the invitation details first
  const { data: invitation, error: fetchError } = await supabase
    .from("review_invitations")
    .select("*")
    .eq("id", invitationId)
    .single();

  if (fetchError || !invitation) {
    console.error("Error fetching invitation:", fetchError);
    throw fetchError || new Error("Invitation not found");
  }

  // Update status to expired
  const { error: updateError } = await supabase
    .from("review_invitations")
    .update({
      status: "expired",
      updated_at: new Date().toISOString(),
      notes: (invitation.notes || "") + " [Revoked by editor]",
    })
    .eq("id", invitationId);

  if (updateError) {
    console.error("Error revoking invitation:", updateError);
    throw updateError;
  }

  // Optionally add back to queue
  if (addBackToQueue) {
    await addToQueue(
      invitation.manuscript_id,
      invitation.reviewer_id,
      "normal"
    );
  }
}

/**
 * Move a queued reviewer up or down in the queue
 * @param queueItemId - The queue item UUID
 * @param direction - 'up' or 'down'
 */
export async function moveInQueue(
  queueItemId: string,
  direction: "up" | "down"
): Promise<void> {
  // Get the current item
  const { data: currentItem, error: fetchError } = await supabase
    .from("invitation_queue")
    .select("*")
    .eq("id", queueItemId)
    .single();

  if (fetchError || !currentItem) {
    console.error("Error fetching queue item:", fetchError);
    throw fetchError || new Error("Queue item not found");
  }

  const currentPosition = currentItem.queue_position;
  const newPosition = direction === "up" ? currentPosition - 1 : currentPosition + 1;

  // Can't move beyond bounds
  if (newPosition < 1) {
    throw new Error("Cannot move higher - already at top of queue");
  }

  // Get the item at the target position
  const { data: targetItem, error: targetError } = await supabase
    .from("invitation_queue")
    .select("*")
    .eq("manuscript_id", currentItem.manuscript_id)
    .eq("queue_position", newPosition)
    .single();

  if (targetError && targetError.code !== "PGRST116") {
    // PGRST116 = no rows returned
    console.error("Error fetching target item:", targetError);
    throw targetError;
  }

  if (!targetItem) {
    throw new Error(
      `Cannot move ${direction} - no item at position ${newPosition}`
    );
  }

  // Swap positions
  await updateQueuePositions([
    { id: currentItem.id, queue_position: newPosition },
    { id: targetItem.id, queue_position: currentPosition },
  ]);
}

/**
 * Get or create queue control state for a manuscript
 * Note: This is a demo function - queue_active is not yet in database
 * @param manuscriptId - The manuscript UUID
 */
export async function getQueueControlState(
  manuscriptId: string
): Promise<import("@/lib/supabase").QueueControlState> {
  // TODO: When queue_active is added to manuscripts table, fetch from there
  // For now, return demo data based on queue existence

  const { data: queueItems } = await supabase
    .from("invitation_queue")
    .select("scheduled_send_date")
    .eq("manuscript_id", manuscriptId)
    .order("scheduled_send_date", { ascending: true })
    .limit(1);

  return {
    manuscript_id: manuscriptId,
    queue_active: false, // Demo: always false for now
    next_scheduled_send: queueItems?.[0]?.scheduled_send_date,
  };
}

/**
 * Toggle queue active state for a manuscript
 * Note: This is a demo function - queue_active is not yet in database
 * @param manuscriptId - The manuscript UUID
 * @param active - Whether queue should be active
 */
export async function toggleQueueActive(
  manuscriptId: string,
  active: boolean
): Promise<void> {
  // TODO: When queue_active is added to manuscripts table, update it here
  console.log(`Demo: Queue for manuscript ${manuscriptId} set to ${active ? "active" : "paused"}`);
  
  // For now, this is just a demo function
  // In production, this would:
  // 1. Update manuscripts.queue_active = active
  // 2. Trigger/pause automated queue processing
}
