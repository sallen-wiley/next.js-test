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
  match_score: number; // 0-100, how well they match the manuscript
  current_review_load: number; // number of papers currently reviewing
  max_review_capacity: number; // maximum papers they can review simultaneously
  average_review_time_days: number;
  recent_publications: number; // publications in last 2 years
  h_index?: number;
  last_review_completed?: string; // ISO date
  availability_status: "available" | "busy" | "unavailable" | "sabbatical";
  response_rate: number; // 0-100, historical acceptance rate
  quality_score: number; // 0-100, based on review quality feedback
  conflicts_of_interest: string[]; // manuscript IDs or author names they conflict with
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
    | "expired" // Invitation expired without response
    | "completed" // Review process fully completed
    | "overdue" // Review is past due date
    | "report_submitted"; // Reviewer submitted their report
  response_date?: string;
  queue_position?: number; // null if sent immediately, number if queued
  invitation_round: number; // 1st choice, 2nd choice, etc.
  notes?: string;
  reminder_count: number;
  estimated_completion_date?: string;
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
  match_score: number; // Specific to a manuscript from reviewer_manuscript_matches
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
