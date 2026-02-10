// Shared types for reviewer dashboard components
import type { PotentialReviewerWithMatch } from "@/lib/supabase";

export interface ReviewerFilters {
  hideUnavailable: boolean;
  institutionalEmail: boolean;
  country: string;
  role: string;
  responseTimeMax: number;
  reviewsLast12Months: number;
  totalReviewsMin: number;
  totalReviewsMax: number;
  assignedManuscriptsMax: number;
  publicationYearFrom: number;
  publicationYearTo: number;
  publishedArticlesMin: number;
  publishedInJournal: boolean;
  previouslyReviewedForJournal: boolean;
  inAuthorsGroup: boolean;
}

export interface ReviewerSearchAndCardsProps {
  filteredReviewers: PotentialReviewerWithMatch[];
  searchTerm: string;
  filters: ReviewerFilters;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: ReviewerFilters) => void;
  onInviteReviewer: (reviewerId: string) => void;
  onAddToQueue: (reviewerId: string) => void;
  onInviteManually: () => void;
  onClearFilters: () => void;
  onViewProfile: (reviewerId: string) => void;
}
