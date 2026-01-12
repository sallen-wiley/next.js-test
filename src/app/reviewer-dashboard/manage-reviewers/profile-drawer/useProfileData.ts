"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";
import { isInstitutionalEmail } from "@/utils/reviewerMetrics";
import type { ReviewerProfile } from "./types";

interface UseProfileDataParams {
  open: boolean;
  reviewerId: string | null;
  manuscriptId?: string | null;
}

interface UseProfileDataReturn {
  reviewer: ReviewerProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProfileData({
  open,
  reviewerId,
  manuscriptId,
}: UseProfileDataParams): UseProfileDataReturn {
  const [reviewer, setReviewer] = React.useState<ReviewerProfile | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchReviewerProfile = React.useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        // Fetch base reviewer data
        const { data: reviewerData, error: reviewerError } = await supabase
          .from("potential_reviewers")
          .select("*")
          .eq("id", id)
          .single();

        if (reviewerError) throw reviewerError;

        // Fetch manuscript data if manuscriptId is provided
        let manuscriptData: { authors: string[]; journal: string } | null =
          null;
        let manuscriptConflicts: string | null = null;
        if (manuscriptId) {
          const { data: manuscript } = await supabase
            .from("manuscripts")
            .select("authors, journal")
            .eq("id", manuscriptId)
            .single();

          manuscriptData = manuscript;

          const { data: matchData } = await supabase
            .from("reviewer_manuscript_matches")
            .select("conflicts_of_interest")
            .eq("manuscript_id", manuscriptId)
            .eq("reviewer_id", id)
            .single();

          manuscriptConflicts = matchData?.conflicts_of_interest || null;
        }

        // Fetch publications
        const { data: publicationsData } = await supabase
          .from("reviewer_publications")
          .select("*")
          .eq("reviewer_id", id)
          .order("publication_date", { ascending: false });

        // Fetch related publications for this manuscript
        let relatedPublicationIds = new Set<string>();
        if (manuscriptId) {
          const { data: relatedMatches } = await supabase
            .from("manuscript_publication_matches")
            .select("publication_id")
            .eq("manuscript_id", manuscriptId);

          relatedPublicationIds = new Set(
            (relatedMatches || []).map((m) => m.publication_id)
          );
        }

        const publicationsWithRelated = (publicationsData || []).map((pub) => ({
          ...pub,
          is_related: relatedPublicationIds.has(pub.id),
        }));

        // Fetch recent invitation history
        const { data: recentInvitationsData } = await supabase
          .from("review_invitations")
          .select("status, invited_date, response_date")
          .eq("reviewer_id", id)
          .order("invited_date", { ascending: false })
          .limit(3);

        // Fetch retractions
        const { data: retractionsData } = await supabase
          .from("reviewer_retractions")
          .select("*")
          .eq("reviewer_id", id)
          .single();

        // Combine all data
        const profile: ReviewerProfile = {
          ...reviewerData,
          conflicts_of_interest: manuscriptConflicts || "",
          match_score: 0,
          email_is_institutional: isInstitutionalEmail(reviewerData.email),
          acceptance_rate:
            reviewerData.total_invitations > 0
              ? Math.round(
                  (reviewerData.total_acceptances /
                    reviewerData.total_invitations) *
                    100
                )
              : 0,
          related_publications_count:
            publicationsWithRelated?.filter((p) => p.is_related).length || 0,
          solo_authored_count:
            publicationsWithRelated?.filter((p) => p.authors?.length === 1)
              .length || 0,
          publications_last_5_years:
            publicationsWithRelated?.filter((p) => {
              if (!p.publication_date) return false;
              const pubYear = new Date(p.publication_date).getFullYear();
              const currentYear = new Date().getFullYear();
              return currentYear - pubYear <= 5;
            }).length || 0,
          days_since_last_review: reviewerData.last_review_completed
            ? Math.floor(
                (Date.now() -
                  new Date(reviewerData.last_review_completed).getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            : null,
          publications: publicationsWithRelated?.slice(0, 4) || [],
          retractions: retractionsData || undefined,
          manuscript_authors: manuscriptData?.authors || [],
          manuscript_journal: manuscriptData?.journal || null,
          recent_invitations: recentInvitationsData || [],
          all_publications: publicationsWithRelated || [],
        };

        setReviewer(profile);
      } catch (err) {
        console.error("Error fetching reviewer profile:", err);
        setError("Failed to load reviewer profile. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [manuscriptId]
  );

  React.useEffect(() => {
    if (open && reviewerId) {
      fetchReviewerProfile(reviewerId);
    }
  }, [open, reviewerId, fetchReviewerProfile]);

  const refetch = React.useCallback(() => {
    if (reviewerId) {
      fetchReviewerProfile(reviewerId);
    }
  }, [reviewerId, fetchReviewerProfile]);

  return { reviewer, loading, error, refetch };
}
