// Mock data service for reviewer invitation system
import {
  supabase,
  Manuscript,
  PotentialReviewer,
  ReviewInvitation,
  ReviewInvitationWithReviewer,
  InvitationQueue,
  InvitationQueueItem,
  UserManuscript,
  ManuscriptWithUserRole,
  PotentialReviewerWithMatch,
} from "@/lib/supabase";
import type { UserProfile } from "@/types/roles";

/**
 * Helper function to check if a user has admin role
 * @param userId - The user UUID
 * @returns true if user is admin, false otherwise
 */
async function isUserAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return false;
  }

  return data.role === "admin";
}

/**
 * Fetch active editor assignments for a set of manuscripts.
 * Editors are users with role "editor" in user_manuscripts.
 */
async function getEditorsForManuscripts(
  manuscriptIds: string[]
): Promise<Map<string, UserProfile[]>> {
  if (manuscriptIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from("user_manuscripts")
    .select(
      `
      manuscript_id,
      user_profiles (*)
    `
    )
    .eq("role", "editor")
    .eq("is_active", true)
    .in("manuscript_id", manuscriptIds);

  if (error) {
    console.error("Error fetching manuscript editors:", error);
    throw error;
  }

  const map = new Map<string, UserProfile[]>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (data || []).forEach((row: any) => {
    const existing = map.get(row.manuscript_id) || [];
    if (row.user_profiles) {
      existing.push(row.user_profiles as UserProfile);
    }
    map.set(row.manuscript_id, existing);
  });

  return map;
}

/**
 * Attach editor assignments (users) to manuscripts as assignedEditors / assignedEditorIds.
 */
async function enrichManuscriptsWithEditors<T extends Manuscript>(
  manuscripts: T[]
): Promise<T[]> {
  const editorMap = await getEditorsForManuscripts(
    manuscripts.map((m) => m.id)
  );

  return manuscripts.map((manuscript) => {
    const editors = editorMap.get(manuscript.id) || [];
    return {
      ...manuscript,
      assignedEditors: editors,
      assignedEditorIds: editors.map((e) => e.id),
    };
  });
}

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
  assignedEditors: [],
  assignedEditorIds: [],
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
  // Check if user is admin - admins see ALL manuscripts
  const isAdmin = await isUserAdmin(userId);

  if (isAdmin) {
    // For admins: Fetch ALL manuscripts AND their explicit assignments
    // This allows admins to see everything, but with their assigned role when applicable

    // 1. Get all manuscripts
    const { data: allManuscripts, error: manuscriptsError } = await supabase
      .from("manuscripts")
      .select("*")
      .order("submission_date", { ascending: false });

    if (manuscriptsError) {
      console.error("Error fetching manuscripts for admin:", manuscriptsError);
      throw manuscriptsError;
    }

    // 2. Get admin's explicit assignments
    const assignmentQuery = supabase
      .from("user_manuscripts")
      .select("manuscript_id, role, assigned_date")
      .eq("user_id", userId);

    if (activeOnly) {
      assignmentQuery.eq("is_active", true);
    }

    const { data: assignments, error: assignmentsError } =
      await assignmentQuery;

    if (assignmentsError) {
      console.error("Error fetching admin assignments:", assignmentsError);
      // Don't throw - continue with implicit access only
    }

    // 3. Create a map of explicit assignments
    const assignmentMap = new Map(
      (assignments || []).map((a) => [
        a.manuscript_id,
        { role: a.role, assigned_date: a.assigned_date },
      ])
    );

    // 4. Merge: Use explicit role if exists, otherwise implicit 'admin' role
    const merged = (allManuscripts || []).map((manuscript) => {
      const explicitAssignment = assignmentMap.get(manuscript.id);

      if (explicitAssignment) {
        // Admin has explicit assignment - use that role (e.g., "editor", "reviewer")
        return {
          ...manuscript,
          user_role: explicitAssignment.role,
          assigned_date: explicitAssignment.assigned_date,
          is_active: true,
        };
      } else {
        // No explicit assignment - use implicit admin access
        return {
          ...manuscript,
          user_role: "admin" as const,
          assigned_date: new Date().toISOString(),
          is_active: true,
        };
      }
    });

    return enrichManuscriptsWithEditors(merged);
  }

  // Non-admin: Fetch only assigned manuscripts from user_manuscripts
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapped = (data || []).map((item: any) => ({
    ...item.manuscripts,
    user_role: item.role,
    assigned_date: item.assigned_date,
  }));

  return enrichManuscriptsWithEditors(mapped);
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
): Promise<ReviewInvitationWithReviewer[]> {
  // Fetch invitations without join
  const { data, error } = await supabase
    .from("review_invitations")
    .select("*")
    .eq("manuscript_id", manuscriptId)
    .order("invited_date", { ascending: false });

  if (error) {
    console.error("Error fetching manuscript invitations:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Get unique reviewer IDs
  const reviewerIds = [...new Set(data.map((inv) => inv.reviewer_id))];

  // Fetch reviewer details for all reviewer IDs
  const { data: reviewers } = await supabase
    .from("potential_reviewers")
    .select("id, name, affiliation")
    .in("id", reviewerIds);

  // Create a map of reviewer data
  const reviewerMap = new Map((reviewers || []).map((r) => [r.id, r]));

  // Combine invitation data with reviewer details
  const invitations: ReviewInvitationWithReviewer[] = data.map((item) => {
    const reviewer = reviewerMap.get(item.reviewer_id);
    return {
      id: item.id,
      manuscript_id: item.manuscript_id,
      reviewer_id: item.reviewer_id,
      invited_date: item.invited_date,
      due_date: item.due_date,
      status: item.status,
      response_date: item.response_date,
      queue_position: item.queue_position,
      invitation_round: item.invitation_round,
      notes: item.notes,
      reminder_count: item.reminder_count,
      estimated_completion_date: item.estimated_completion_date,
      reviewer_name: reviewer?.name || "Unknown Reviewer",
      reviewer_affiliation: reviewer?.affiliation,
    };
  });

  return invitations;
}

/**
 * Fetch invitation statistics for multiple manuscripts in a single query
 * Returns a map of manuscriptId -> stats for efficient lookup
 * @param manuscriptIds - Array of manuscript UUIDs
 */
export async function getManuscriptInvitationStats(
  manuscriptIds: string[]
): Promise<
  Map<
    string,
    {
      invited: number;
      agreed: number;
      declined: number;
      submitted: number;
    }
  >
> {
  if (manuscriptIds.length === 0) {
    return new Map();
  }

  const { data, error } = await supabase
    .from("review_invitations")
    .select("manuscript_id, status")
    .in("manuscript_id", manuscriptIds);

  if (error) {
    console.error("Error fetching invitation stats:", error);
    return new Map();
  }

  // Build stats map
  const statsMap = new Map<
    string,
    {
      invited: number;
      agreed: number;
      declined: number;
      submitted: number;
    }
  >();

  // Initialize all manuscripts with zero counts
  manuscriptIds.forEach((id) => {
    statsMap.set(id, { invited: 0, agreed: 0, declined: 0, submitted: 0 });
  });

  // Count invitations by status
  data?.forEach((invitation) => {
    const stats = statsMap.get(invitation.manuscript_id);
    if (stats) {
      stats.invited++;
      switch (invitation.status) {
        case "accepted":
          stats.agreed++;
          break;
        case "declined":
          stats.declined++;
          break;
        case "report_submitted":
        case "completed":
          stats.submitted++;
          break;
      }
    }
  });

  return statsMap;
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

  // Note: Access control checking removed - admins have implicit access to all manuscripts
  // If needed, implement explicit access check here for non-admin users
  // For now, returning manuscript if it exists (auth/access checked at route level)
  if (!data) return null;

  const [enriched] = await enrichManuscriptsWithEditors([data]);
  return enriched;
}

/**
 * Fetch invitation queue for a specific manuscript
 * @param manuscriptId - The manuscript UUID
 */
export async function getManuscriptQueue(
  manuscriptId: string
): Promise<InvitationQueueItem[]> {
  // Fetch queue items without join
  const { data, error } = await supabase
    .from("invitation_queue")
    .select("*")
    .eq("manuscript_id", manuscriptId)
    .order("queue_position", { ascending: true });

  if (error) {
    console.error("Error fetching manuscript queue:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Get unique reviewer IDs
  const reviewerIds = [...new Set(data.map((item) => item.reviewer_id))];

  // Fetch reviewer details for all reviewer IDs
  const { data: reviewers } = await supabase
    .from("potential_reviewers")
    .select("id, name, affiliation")
    .in("id", reviewerIds);

  // Create a map of reviewer data
  const reviewerMap = new Map((reviewers || []).map((r) => [r.id, r]));

  // Combine queue data with reviewer details
  const queueItems: InvitationQueueItem[] = data.map((item) => {
    const reviewer = reviewerMap.get(item.reviewer_id);
    return {
      id: item.id,
      manuscript_id: item.manuscript_id,
      reviewer_id: item.reviewer_id,
      queue_position: item.queue_position,
      created_date: item.created_date,
      scheduled_send_date: item.scheduled_send_date,
      priority: item.priority,
      notes: item.notes,
      reviewer_name: reviewer?.name || "Unknown Reviewer",
      reviewer_affiliation: reviewer?.affiliation,
    };
  });

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
): Promise<InvitationQueueItem | null> {
  // Check if reviewer already has an invitation
  const { data: existingInvitation } = await supabase
    .from("review_invitations")
    .select("id")
    .eq("manuscript_id", manuscriptId)
    .eq("reviewer_id", reviewerId)
    .single();

  if (existingInvitation) {
    throw new Error(
      "Cannot add to queue: Reviewer already has an invitation for this manuscript"
    );
  }

  // Check if reviewer is already in queue
  const { data: existingQueueItem } = await supabase
    .from("invitation_queue")
    .select("id")
    .eq("manuscript_id", manuscriptId)
    .eq("reviewer_id", reviewerId)
    .single();

  if (existingQueueItem) {
    throw new Error("Reviewer is already in the queue for this manuscript");
  }

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

  if (!data) {
    return null;
  }

  // Fetch reviewer details
  const { data: reviewer } = await supabase
    .from("potential_reviewers")
    .select("name, affiliation")
    .eq("id", reviewerId)
    .single();

  // Return with reviewer details
  return {
    ...data,
    reviewer_name: reviewer?.name || "Unknown Reviewer",
    reviewer_affiliation: reviewer?.affiliation,
  };
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
 * Remove a review invitation completely
 * This resets the reviewer back to potential reviewers list
 * @param invitationId - The invitation UUID
 */
export async function removeInvitation(invitationId: string): Promise<void> {
  const { error } = await supabase
    .from("review_invitations")
    .delete()
    .eq("id", invitationId);

  if (error) {
    console.error("Error removing invitation:", error);
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

  // Collect all unique reviewer IDs from queue and invitations
  const reviewerIdsInWorkflow = new Set<string>();
  (queueItems || []).forEach((q) => reviewerIdsInWorkflow.add(q.reviewer_id));
  (invitations || []).forEach((i) => reviewerIdsInWorkflow.add(i.reviewer_id));

  // Get reviewer IDs from matches
  const matchedReviewerIds = new Set(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (matchedReviewers || []).map((m: any) => m.potential_reviewers.id)
  );

  // Find reviewer IDs that are in workflow but not in matches
  const unmatchedReviewerIds = Array.from(reviewerIdsInWorkflow).filter(
    (id) => !matchedReviewerIds.has(id)
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
    (invitations || []).map((i) => [i.reviewer_id, i])
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
    }
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
  const newPosition =
    direction === "up" ? currentPosition - 1 : currentPosition + 1;

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
  console.log(
    `Demo: Queue for manuscript ${manuscriptId} set to ${
      active ? "active" : "paused"
    }`
  );

  // For now, this is just a demo function
  // In production, this would:
  // 1. Update manuscripts.queue_active = active
  // 2. Trigger/pause automated queue processing
}

/**
 * Send an invitation immediately to a reviewer
 * @param manuscriptId - The manuscript UUID
 * @param reviewerId - The reviewer UUID
 * @returns The created invitation
 */
export async function sendInvitation(
  manuscriptId: string,
  reviewerId: string
): Promise<ReviewInvitation> {
  // Check if reviewer is already in queue
  const { data: existingQueueItem } = await supabase
    .from("invitation_queue")
    .select("id")
    .eq("manuscript_id", manuscriptId)
    .eq("reviewer_id", reviewerId)
    .single();

  if (existingQueueItem) {
    throw new Error(
      "Cannot send invitation: Reviewer is already in the queue for this manuscript"
    );
  }

  // Check if reviewer already has an invitation
  const { data: existingInvitation } = await supabase
    .from("review_invitations")
    .select("id")
    .eq("manuscript_id", manuscriptId)
    .eq("reviewer_id", reviewerId)
    .single();

  if (existingInvitation) {
    throw new Error("Reviewer already has an invitation for this manuscript");
  }

  // Set due date to 14 days from now
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  const { data, error } = await supabase
    .from("review_invitations")
    .insert({
      manuscript_id: manuscriptId,
      reviewer_id: reviewerId,
      invited_date: new Date().toISOString(),
      due_date: dueDate.toISOString(),
      status: "pending",
      invitation_round: 1,
      reminder_count: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error sending invitation:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw error;
  }

  if (!data) {
    throw new Error("No data returned after sending invitation");
  }

  return data as ReviewInvitation;
}

// ============================================================================
// Reviewer-Manuscript Match Management Functions
// ============================================================================

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
    `
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
  manuscriptId: string
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
    `
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
 * @param matchScore - Match score (0-100)
 */
export async function addReviewerMatch(
  manuscriptId: string,
  reviewerId: string,
  matchScore: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  // Validate match score
  if (matchScore < 0 || matchScore > 100) {
    throw new Error("Match score must be between 0 and 100");
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
      `Match already exists with score ${existing.match_score}. Use update instead.`
    );
  }

  const { data, error } = await supabase
    .from("reviewer_manuscript_matches")
    .insert({
      manuscript_id: manuscriptId,
      reviewer_id: reviewerId,
      match_score: matchScore,
      calculated_at: new Date().toISOString(),
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
        `Failed to add reviewer match: ${JSON.stringify(error)}`
    );
  }

  return data;
}

/**
 * Update match score for an existing reviewer-manuscript match
 * @param matchId - The match UUID
 * @param matchScore - New match score (0-100)
 */
export async function updateReviewerMatchScore(
  matchId: string,
  matchScore: number
): Promise<void> {
  // Validate match score
  if (matchScore < 0 || matchScore > 100) {
    throw new Error("Match score must be between 0 and 100");
  }

  const { error } = await supabase
    .from("reviewer_manuscript_matches")
    .update({
      match_score: matchScore,
      calculated_at: new Date().toISOString(),
    })
    .eq("id", matchId);

  if (error) {
    console.error("Error updating match score:", error);
    throw error;
  }
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
  baseScore: number = 95
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

// ============================================================================
// User Profile and Manuscript Assignment Functions
// ============================================================================

/**
 * Fetch all user profiles
 * @returns All user profiles from the database
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }

  return data || [];
}

/**
 * Fetch all manuscripts
 * @returns All manuscripts from the database
 */
export async function getAllManuscripts(): Promise<Manuscript[]> {
  const { data, error } = await supabase
    .from("manuscripts")
    .select("*")
    .order("submission_date", { ascending: false });

  if (error) {
    console.error("Error fetching manuscripts:", error);
    throw error;
  }

  return enrichManuscriptsWithEditors(data || []);
}

/**
 * Get all user-manuscript assignments
 * @returns All user-manuscript assignments with user and manuscript details
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAllUserManuscriptAssignments(): Promise<any[]> {
  const { data, error } = await supabase
    .from("user_manuscripts")
    .select(
      `
      id,
      user_id,
      manuscript_id,
      role,
      assigned_date,
      is_active,
      user_profiles (
        email,
        full_name
      ),
      manuscripts (
        title,
        journal,
        status
      )
    `
    )
    .order("assigned_date", { ascending: false });

  if (error) {
    console.error("Error fetching user manuscript assignments:", error);
    throw error;
  }

  return data || [];
}

/**
 * Add a user to a manuscript
 * @param userId - The user's UUID
 * @param manuscriptId - The manuscript UUID
 * @param role - The user's role for this manuscript
 * @returns The created assignment
 */
export async function addUserToManuscript(
  userId: string,
  manuscriptId: string,
  role: "editor" | "author" | "collaborator" | "reviewer" = "editor"
): Promise<UserManuscript> {
  // Check if assignment already exists
  const { data: existing } = await supabase
    .from("user_manuscripts")
    .select("id, is_active")
    .eq("user_id", userId)
    .eq("manuscript_id", manuscriptId)
    .single();

  if (existing) {
    if (existing.is_active) {
      throw new Error("User is already assigned to this manuscript");
    } else {
      // Reactivate the existing assignment
      const { data, error } = await supabase
        .from("user_manuscripts")
        .update({ is_active: true, role, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        console.error("Error reactivating user manuscript assignment:", error);
        throw error;
      }

      return data as UserManuscript;
    }
  }

  // Create new assignment
  const { data, error } = await supabase
    .from("user_manuscripts")
    .insert({
      user_id: userId,
      manuscript_id: manuscriptId,
      role,
      assigned_date: new Date().toISOString(),
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding user to manuscript:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw error;
  }

  return data as UserManuscript;
}

/**
 * Remove a user from a manuscript (soft delete by setting is_active to false)
 * @param userId - The user's UUID
 * @param manuscriptId - The manuscript UUID
 */
export async function removeUserFromManuscript(
  userId: string,
  manuscriptId: string
): Promise<void> {
  const { error } = await supabase
    .from("user_manuscripts")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("manuscript_id", manuscriptId);

  if (error) {
    console.error("Error removing user from manuscript:", error);
    throw error;
  }
}

/**
 * Update a user's role for a manuscript
 * @param userId - The user's UUID
 * @param manuscriptId - The manuscript UUID
 * @param role - The new role
 */
export async function updateUserManuscriptRole(
  userId: string,
  manuscriptId: string,
  role: "editor" | "author" | "collaborator" | "reviewer"
): Promise<void> {
  const { error } = await supabase
    .from("user_manuscripts")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("manuscript_id", manuscriptId);

  if (error) {
    console.error("Error updating user manuscript role:", error);
    throw error;
  }
}

/**
 * Synchronize editor assignments for a manuscript based on desired editor IDs.
 * Adds missing editors (reactivating if previously inactive) and deactivates removed ones.
 */
export async function syncManuscriptEditors(
  manuscriptId: string,
  editorIds: string[]
): Promise<UserProfile[]> {
  const desiredEditors = Array.from(new Set(editorIds.filter(Boolean)));

  const { data: existingEditors, error: fetchError } = await supabase
    .from("user_manuscripts")
    .select("id, user_id, is_active")
    .eq("manuscript_id", manuscriptId)
    .eq("role", "editor");

  if (fetchError) {
    console.error("Error fetching existing editor assignments:", fetchError);
    throw fetchError;
  }

  const toDeactivate = (existingEditors || []).filter(
    (row) => row.is_active && !desiredEditors.includes(row.user_id)
  );

  if (toDeactivate.length > 0) {
    const { error: deactivateError } = await supabase
      .from("user_manuscripts")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .in(
        "id",
        toDeactivate.map((row) => row.id)
      );

    if (deactivateError) {
      console.error("Error deactivating editor assignments:", deactivateError);
      throw deactivateError;
    }
  }

  const toAdd = desiredEditors.filter(
    (editorId) =>
      !(existingEditors || []).some(
        (row) => row.user_id === editorId && row.is_active
      )
  );

  for (const editorId of toAdd) {
    await addUserToManuscript(editorId, manuscriptId, "editor");
  }

  const editorMap = await getEditorsForManuscripts([manuscriptId]);
  return editorMap.get(manuscriptId) || [];
}

// ============================================================================
// Reviewer Management Functions
// ============================================================================

/**
 * Add a new reviewer to the potential_reviewers table
 * @param reviewer - The reviewer data (without id, created_at, updated_at)
 * @returns The created reviewer
 */
export async function addReviewer(
  reviewer: Omit<PotentialReviewer, "id" | "match_score">
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

  const { data, error } = await supabase
    .from("potential_reviewers")
    .insert({
      name: reviewer.name,
      email: reviewer.email,
      affiliation: reviewer.affiliation,
      department: reviewer.department,
      expertise_areas: reviewer.expertise_areas,
      current_review_load: reviewer.current_review_load ?? 0,
      max_review_capacity: reviewer.max_review_capacity ?? 3,
      average_review_time_days: reviewer.average_review_time_days ?? 21,
      recent_publications: reviewer.recent_publications ?? 0,
      h_index: reviewer.h_index,
      last_review_completed: reviewer.last_review_completed,
      availability_status: reviewer.availability_status ?? "available",
      response_rate: reviewer.response_rate ?? 0,
      quality_score: reviewer.quality_score ?? 0,
      conflicts_of_interest: reviewer.conflicts_of_interest ?? [],
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding reviewer:", error);
    throw error;
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
  updates: Partial<Omit<PotentialReviewer, "id" | "match_score">>
): Promise<void> {
  // If email is being updated, check for duplicates
  if (updates.email) {
    const { data: existing } = await supabase
      .from("potential_reviewers")
      .select("id")
      .eq("email", updates.email)
      .neq("id", reviewerId)
      .single();

    if (existing) {
      throw new Error(
        `Another reviewer with email ${updates.email} already exists`
      );
    }
  }

  const { error } = await supabase
    .from("potential_reviewers")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reviewerId);

  if (error) {
    console.error("Error updating reviewer:", error);
    throw error;
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
        "Cannot delete reviewer: they have existing matches or invitations. Remove those first."
      );
    }

    throw error;
  }
}

/**
 * Create a new manuscript
 * @param manuscript - Manuscript data (without id)
 */
export async function createManuscript(
  manuscript: Omit<
    Manuscript,
    "id" | "assignedEditors" | "assignedEditorIds"
  > & {
    editorIds?: string[];
  }
): Promise<Manuscript> {
  const { editorIds = [], ...insertData } = manuscript;

  const { data, error } = await supabase
    .from("manuscripts")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error("Error creating manuscript:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    if (error.code === "42501") {
      throw new Error(
        "Permission denied: You must be an admin or designer to create manuscripts."
      );
    }

    if (error.code === "23502" && error.message?.includes("editor_id")) {
      throw new Error(
        "Database still requires manuscripts.editor_id. Apply migration database/remove_editor_id_from_manuscripts.sql or make editor_id nullable."
      );
    }

    throw new Error(
      `Failed to create manuscript: ${
        error.message || error.code || "Unknown error"
      }`
    );
  }

  if (!data) {
    throw new Error("No data returned after creating manuscript");
  }

  const [enriched] = await enrichManuscriptsWithEditors([data as Manuscript]);

  const assignedEditors = await syncManuscriptEditors(enriched.id, editorIds);

  return {
    ...enriched,
    assignedEditors,
    assignedEditorIds: assignedEditors.map((e) => e.id),
  };
}

/**
 * Update an existing manuscript
 * @param id - Manuscript UUID
 * @param updates - Partial manuscript data to update
 */
export async function updateManuscript(
  id: string,
  updates: Partial<
    Omit<Manuscript, "assignedEditors" | "assignedEditorIds"> & {
      editorIds?: string[];
    }
  >
): Promise<Manuscript> {
  // Strip non-column fields from updates
  const {
    id: _id, // eslint-disable-line @typescript-eslint/no-unused-vars
    assignedEditors, // eslint-disable-line @typescript-eslint/no-unused-vars
    assignedEditorIds, // eslint-disable-line @typescript-eslint/no-unused-vars
    editorIds,
    ...updateData
  } = updates as Manuscript & { editorIds?: string[] };

  const { data, error } = await supabase
    .from("manuscripts")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating manuscript:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    if (error.code === "42501") {
      throw new Error(
        "Permission denied: You must be an admin or designer to update manuscripts."
      );
    }

    if (error.code === "23502" && error.message?.includes("editor_id")) {
      throw new Error(
        "Database still requires manuscripts.editor_id. Apply migration database/remove_editor_id_from_manuscripts.sql or make editor_id nullable."
      );
    }

    throw new Error(
      `Failed to update manuscript: ${
        error.message || error.code || "Unknown error"
      }`
    );
  }
  if (!data) {
    throw new Error("No data returned after updating manuscript");
  }

  const [enriched] = await enrichManuscriptsWithEditors([data as Manuscript]);

  if (editorIds !== undefined) {
    const assignedEditors = await syncManuscriptEditors(id, editorIds);
    return {
      ...enriched,
      assignedEditors,
      assignedEditorIds: assignedEditors.map((e) => e.id),
    };
  }

  return enriched;
}

/**
 * Delete a manuscript from the database
 * Note: This will fail if the manuscript has associated records (matches, invitations, assignments, etc.)
 * @param manuscriptId - The manuscript's UUID
 */
export async function deleteManuscript(manuscriptId: string): Promise<void> {
  const { error } = await supabase
    .from("manuscripts")
    .delete()
    .eq("id", manuscriptId);

  if (error) {
    console.error("Error deleting manuscript:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: error,
    });

    // Provide user-friendly error message for foreign key constraint
    if (error.code === "23503") {
      throw new Error(
        "Cannot delete manuscript: it has existing matches, invitations, or assignments. Remove those first."
      );
    }

    if (error.code === "42501") {
      throw new Error(
        "Permission denied: You must be an admin or designer to delete manuscripts."
      );
    }

    throw error;
  }
}
