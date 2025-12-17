import * as React from "react";

/**
 * Hook to manage the ReviewerProfileDrawer state
 * Makes it easy to open the drawer from anywhere in your component
 */
export function useReviewerProfileDrawer() {
  const [open, setOpen] = React.useState(false);
  const [reviewerId, setReviewerId] = React.useState<string | null>(null);

  const openDrawer = (id: string) => {
    setReviewerId(id);
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
    // Keep reviewerId until drawer close animation completes
    setTimeout(() => setReviewerId(null), 300);
  };

  return {
    open,
    reviewerId,
    openDrawer,
    closeDrawer,
  };
}
