// Supabase client configuration with SSR support
import { createClient } from "@/utils/supabase/client";

// Create the client - now uses SSR-compatible version
export const supabase = createClient();

// Type definitions for reviewer invitation system
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
    | "under_review"
    | "revision_required"
    | "accepted"
    | "rejected";
  editor_id: string;
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
    | "pending"
    | "accepted"
    | "declined"
    | "expired"
    | "completed"
    | "overdue";
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
