// Custom hooks for data mutations (create, update, delete)
import { useState } from "react";

interface MutationState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Type for creating new articles
interface CreateArticleData {
  title: string;
  authors: string[];
  journal: string;
  abstract: string;
  keywords?: string[];
  subject_area?: string;
  status?:
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
}

// Type for updating articles
interface UpdateArticleData {
  title?: string;
  authors?: string[];
  journal?: string;
  abstract?: string;
  keywords?: string[];
  subject_area?: string;
  status?:
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
}

export function useCreateArticle() {
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const createArticle = async (articleData: CreateArticleData) => {
    setState({ loading: true, error: null, success: false });

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle specific error codes
        if (response.status === 401) {
          throw new Error("Please log in to create articles");
        } else if (response.status === 403) {
          throw new Error(
            "You don't have permission to create articles. Only admin and designer roles are allowed."
          );
        } else {
          throw new Error(errorData.error || "Failed to create article");
        }
      }

      const result = await response.json();
      setState({ loading: false, error: null, success: true });
      return result;
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred",
        success: false,
      });
      throw error;
    }
  };

  const reset = () => setState({ loading: false, error: null, success: false });

  return { ...state, createArticle, reset };
}

export function useUpdateArticle() {
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const updateArticle = async (id: string, updates: UpdateArticleData) => {
    setState({ loading: true, error: null, success: false });

    try {
      const response = await fetch("/api/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle specific error codes
        if (response.status === 401) {
          throw new Error("Please log in to update articles");
        } else if (response.status === 403) {
          throw new Error(
            "You don't have permission to update articles. Only admin and designer roles are allowed."
          );
        } else {
          throw new Error(errorData.error || "Failed to update article");
        }
      }

      const result = await response.json();
      setState({ loading: false, error: null, success: true });
      return result;
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred",
        success: false,
      });
      throw error;
    }
  };

  const reset = () => setState({ loading: false, error: null, success: false });

  return { ...state, updateArticle, reset };
}

export function useDeleteArticle() {
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const deleteArticle = async (id: string) => {
    setState({ loading: true, error: null, success: false });

    try {
      const response = await fetch(`/api/articles?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle specific error codes
        if (response.status === 401) {
          throw new Error("Please log in to delete articles");
        } else if (response.status === 403) {
          throw new Error(
            "You don't have permission to delete articles. Only admin and designer roles are allowed."
          );
        } else {
          throw new Error(errorData.error || "Failed to delete article");
        }
      }

      setState({ loading: false, error: null, success: true });
      return true;
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred",
        success: false,
      });
      throw error;
    }
  };

  const reset = () => setState({ loading: false, error: null, success: false });

  return { ...state, deleteArticle, reset };
}
