"use client";
import React from "react";
import { Button } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

/**
 * ManageReviewersVersionSwitcher component provides a toggle button
 * to switch between normal and alternative versions of the manage reviewers page.
 * Only visible to admin users.
 */
const ManageReviewersVersionSwitcher: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine current version based on pathname
  const isAlternative =
    pathname?.includes("reviewer-dashboard-alternative") ?? false;

  const handleSwitch = () => {
    // Preserve all current query params, including appearance params.
    const queryString = searchParams?.toString();
    const querySuffix = queryString ? `?${queryString}` : "";

    if (isAlternative) {
      // Switch to normal version
      router.push(`/reviewer-dashboard/manage-reviewers${querySuffix}`);
    } else {
      // Switch to alternative version
      router.push(
        `/reviewer-dashboard-alternative/manage-reviewers${querySuffix}`,
      );
    }
  };

  return (
    <Button
      startIcon={<SwapHorizIcon />}
      onClick={handleSwitch}
      color="secondary"
      variant="outlined"
    >
      {isAlternative ? "Normal" : "Alternative"} Version
    </Button>
  );
};

export default ManageReviewersVersionSwitcher;
