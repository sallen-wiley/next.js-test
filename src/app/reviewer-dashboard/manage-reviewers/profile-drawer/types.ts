import { PotentialReviewerWithMatch } from "@/lib/supabase";

// Extended type with publication and retraction data
export interface ReviewerProfile extends PotentialReviewerWithMatch {
  // Additional fields from potential_reviewers table
  orcid_id?: string;
  profile_url?: string;
  external_id?: string;
  previous_reviewer?: boolean;
  completed_reviews?: number;
  total_invitations?: number;
  average_response_time_hours?: number;

  // Extended data
  publications?: Publication[];
  all_publications?: Publication[];
  retractions?: {
    retraction_reasons: string[];
  };
  // Manuscript context for strong/weak point analysis
  manuscript_authors?: string[];
  manuscript_journal?: string | null;
  recent_invitations?: Array<{
    status: string;
    invited_date: string;
    response_date?: string;
  }>;
}

// Type for publication object
export interface Publication {
  id: string;
  title: string;
  doi?: string;
  journal_name?: string;
  authors?: string[];
  publication_date?: string;
  is_related: boolean;
}

export interface ManuscriptMatch {
  id: string;
  manuscript_id: string;
  reviewer_id: string;
  match_score: number;
  conflicts_of_interest?: string;
  calculated_at: string;
}
