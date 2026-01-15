import * as React from "react";

/**
 * Hook to manage the ReviewerProfileDrawer state
 * Makes it easy to open the drawer from anywhere in your component
 */
export function useReviewerProfileDrawer() {
  const [open, setOpen] = React.useState(false);
  const [reviewerId, setReviewerId] = React.useState<string | null>(null);
  const [scrollToSection, setScrollToSection] = React.useState<
    string | undefined
  >(undefined);

  const openDrawer = (id: string, section?: string) => {
    setReviewerId(id);
    setScrollToSection(section);
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
    // Keep reviewerId and scrollToSection until drawer close animation completes
    setTimeout(() => {
      setReviewerId(null);
      setScrollToSection(undefined);
    }, 300);
  };

  return {
    open,
    reviewerId,
    scrollToSection,
    openDrawer,
    closeDrawer,
  };
}
