// Mock data service for reviewer invitation system
import {
  Manuscript,
  PotentialReviewer,
  ReviewInvitation,
  InvitationQueue,
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
