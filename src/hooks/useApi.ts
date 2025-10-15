// Custom hook for data fetching with caching
import { useState, useEffect } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface PaginationData<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Import our new reviewer types
import {
  PotentialReviewer,
  ReviewInvitation,
  InvitationQueue,
  Manuscript,
} from "@/lib/supabase";

export function useReviewers(params: {
  manuscriptId: string;
  sortBy?: "match_score" | "availability" | "response_rate" | "quality_score";
  filterBy?: {
    minMatchScore?: number;
    availability?: string[];
    maxCurrentLoad?: number;
  };
  search?: string;
  refreshKey?: number;
}) {
  const [state, setState] = useState<
    FetchState<{ data: PotentialReviewer[]; manuscript: Manuscript }>
  >({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const searchParams = new URLSearchParams();
        searchParams.set("manuscriptId", params.manuscriptId);
        if (params.sortBy) searchParams.set("sortBy", params.sortBy);
        if (params.search) searchParams.set("search", params.search);
        if (params.filterBy?.minMatchScore)
          searchParams.set(
            "minMatchScore",
            params.filterBy.minMatchScore.toString()
          );
        if (params.filterBy?.availability)
          searchParams.set(
            "availability",
            params.filterBy.availability.join(",")
          );
        if (params.filterBy?.maxCurrentLoad)
          searchParams.set(
            "maxCurrentLoad",
            params.filterBy.maxCurrentLoad.toString()
          );

        const response = await fetch(`/api/reviewers?${searchParams}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!isCancelled) {
          setState({
            data: result,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : "An error occurred",
          });
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [
    params.manuscriptId,
    params.sortBy,
    params.search,
    params.filterBy,
    params.refreshKey,
  ]);

  return state;
}

export function useInvitations(manuscriptId: string) {
  const [state, setState] = useState<FetchState<ReviewInvitation[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(
          `/api/invitations?manuscriptId=${manuscriptId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!isCancelled) {
          setState({
            data: result,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : "An error occurred",
          });
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [manuscriptId]);

  return state;
}

export function useInvitationQueue(manuscriptId: string) {
  const [state, setState] = useState<FetchState<InvitationQueue[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(
          `/api/invitation-queue?manuscriptId=${manuscriptId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!isCancelled) {
          setState({
            data: result,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : "An error occurred",
          });
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [manuscriptId]);

  return state;
}

// Keep the old useArticles hook for backward compatibility with the data-demo page
interface LegacyArticle {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  publication_date: string;
  doi: string;
  abstract: string;
  open_access: boolean;
  citation_count: number;
  status: "published" | "in_review" | "draft";
}

export function useArticles(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  refreshKey?: number;
}) {
  const [state, setState] = useState<FetchState<PaginationData<LegacyArticle>>>(
    {
      data: null,
      loading: true,
      error: null,
    }
  );

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());
        if (params.status) searchParams.set("status", params.status);
        if (params.search) searchParams.set("search", params.search);

        const response = await fetch(`/api/articles?${searchParams}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!isCancelled) {
          setState({
            data: result,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : "An error occurred",
          });
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [
    params.page,
    params.limit,
    params.status,
    params.search,
    params.refreshKey,
  ]);

  return state;
}
