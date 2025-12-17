// Supabase client configuration with SSR support
import { createClient } from "@/utils/supabase/client";
import type { UserProfile } from "@/types/roles";

// Create the client - now uses SSR-compatible version
export const supabase = createClient();

// Type definitions for reviewer invitation system

// Special manuscript classifications/tags
export type ManuscriptTag =
  | "commissioned"
  | "rescinded"
  | "transparent peer review"
  | "transferred"
  | "apc edited";

export interface Manuscript {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  submission_date: string;
  doi?: string;
  abstract: string;
  keywords: string[];
  subject_area: string;
  article_type?: string;
  status:
    | "submitted"
    | "pending_editor_assignment"
    | "awaiting_reviewers"
    | "under_review"
    | "reviews_in_progress"
    | "reviews_complete"
    | "revision_required"
    | "minor_revision"
    | "major_revision"
    | "conditionally_accepted"
    | "accepted"
    | "rejected"
    | "desk_rejected"
    | "withdrawn";
  version?: number;
  manuscript_tags?: ManuscriptTag[]; // Special classifications (commissioned, rescinded, etc.)
  created_at?: string;
  updated_at?: string;
  // Resolved academic editors (users assigned with role "editor")
  assignedEditors?: UserProfile[];
  // Convenience list of editor IDs when only identifiers are needed
  assignedEditorIds?: string[];
}

export interface PotentialReviewer {
  id: string;
  name: string;
  email: string;
  affiliation: string;
  department?: string;
  expertise_areas: string[];
  match_score: number; // 0-1, how well they match the manuscript (display as percentage)
  current_review_load: number; // number of papers currently reviewing
  max_review_capacity: number; // maximum papers they can review simultaneously
  average_review_time_days: number;
  recent_publications: number; // publications in last 2 years
  h_index?: number;
  orcid_id?: string; // ORCID identifier
  last_review_completed?: string; // ISO date
  availability_status: "available" | "busy" | "unavailable" | "sabbatical";

  // Extended fields from database
  created_at?: string;
  updated_at?: string;
  external_id?: string;
  pkg_id?: string;
  given_names?: string;
  surname?: string;
  aff_ror_id?: string;
  profile_url?: string;
  reviewer_type?: string;
  is_board_member?: boolean;
  previous_reviewer?: boolean;
  has_publications_saved?: boolean;
  number_of_reviews?: number;
  completed_reviews?: number;
  currently_reviewing?: number;
  total_publications?: number;
  citation_count?: number;
  publication_year_from?: number;
  publication_year_to?: number;
  publication_count_last_year?: number;
  last_publication_date?: string;
  total_invitations?: number;
  total_acceptances?: number;
  total_completions?: number;
  average_response_time_hours?: number;
  last_activity_date?: string;
}

export interface ReviewInvitation {
  id: string;
  manuscript_id: string;
  reviewer_id: string;
  invited_date: string;
  due_date: string;
  status:
    | "pending" // Invitation sent, awaiting response
    | "accepted" // Reviewer accepted, working on review
    | "declined" // Reviewer declined invitation
    | "report_submitted" // Reviewer submitted their report
    | "invalidated" // Report invalidated by editor (can be reinstated)
    | "revoked"; // Invitation revoked/cancelled by editor
  response_date?: string;
  queue_position?: number; // null if sent immediately, number if queued
  invitation_round: number; // 1st choice, 2nd choice, etc.
  notes?: string;
  reminder_count: number;
  estimated_completion_date?: string;
  invitation_expiration_date?: string; // When pending invitation expires (typically 14 days from invited_date)
  report_invalidated_date?: string; // When report was invalidated (only set when status = invalidated)
}

export interface InvitationQueue {
  id: string;
  manuscript_id: string;
  reviewer_id: string;
  queue_position: number;
  created_date: string;
  scheduled_send_date: string;
  priority: "high" | "normal" | "low";
  notes?: string;
}

export interface InvitationQueueItem extends InvitationQueue {
  reviewer_name: string;
  reviewer_affiliation?: string;
}

export interface ReviewInvitationWithReviewer extends ReviewInvitation {
  reviewer_name: string;
  reviewer_affiliation?: string;
}

export interface ReviewerMetrics {
  reviewer_id: string;
  total_invitations: number;
  total_acceptances: number;
  total_completions: number;
  average_response_time_hours: number;
  average_review_time_days: number;
  current_load: number;
  last_activity_date: string;
}

export interface UserManuscript {
  id: string;
  user_id: string;
  manuscript_id: string;
  assigned_date: string;
  role: "editor" | "author" | "collaborator" | "reviewer";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ManuscriptWithUserRole extends Manuscript {
  user_role?: "editor" | "author" | "collaborator" | "reviewer";
  assigned_date?: string;
}

export interface PotentialReviewerWithMatch extends PotentialReviewer {
  match_score: number; // 0-1, specific to a manuscript from reviewer_manuscript_matches (display as percentage)
  conflicts_of_interest: string; // Manuscript-specific conflicts from reviewer_manuscript_matches

  // Calculated fields
  email_is_institutional: boolean; // True if email domain is NOT a public provider (gmail, yahoo, etc.)
  acceptance_rate: number; // 0-100, calculated from total_acceptances/total_invitations
  related_publications_count: number; // Count of publications with is_related=true
  solo_authored_count: number; // Count of publications with single author
  publications_last_5_years: number; // Count of publications from last 5 years
  days_since_last_review: number | null; // Days since last_review_completed (null if never)
}

// Combined view of reviewer with their current status in the invitation workflow
export interface ReviewerWithStatus extends PotentialReviewer {
  // Current status in the workflow (null if not yet queued or invited)
  invitation_status:
    | "queued" // In queue, not yet sent
    | "pending" // Invitation sent, awaiting response
    | "accepted" // Reviewer accepted, working on review
    | "declined" // Reviewer declined invitation
    | "report_submitted" // Reviewer submitted their report
    | "invalidated" // Report was invalidated
    | "revoked" // Invitation was revoked
    | "completed" // Review process fully completed
    | "expired" // Invitation expired
    | "overdue" // Review is overdue
    | null; // Not yet in workflow

  // Additional fields from queue or invitation
  queue_position?: number; // Position in queue (if queued)
  invitation_id?: string; // ID of invitation record (if invited)
  queue_id?: string; // ID of queue record (if queued)
  invited_date?: string; // Date invitation was sent
  response_date?: string; // Date reviewer responded
  due_date?: string; // Review due date (if accepted)
  invitation_expiration_date?: string; // When pending invitation expires
  report_invalidated_date?: string; // When report was invalidated (if invalidated)
  priority?: "high" | "normal" | "low"; // Queue priority (if queued)
  scheduled_send_date?: string; // When queued item will be sent
}

// Queue control state for a manuscript
export interface QueueControlState {
  manuscript_id: string;
  queue_active: boolean; // Whether auto-send is enabled
  last_sent_date?: string; // Last time a queued invitation was sent
  next_scheduled_send?: string; // Next scheduled send from queue
}
