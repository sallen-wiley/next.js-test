import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Typography } from "@mui/material";

/**
 * # 13 - Final Review
 *
 * Pre-submission summary showing all entered information.
 *
 * ## Key Features
 * - Summary sections (manuscript, authors, affiliations, etc.)
 * - Edit links to previous steps
 * - Validation status indicators
 * - Submit confirmation
 *
 * ## MUI Components
 * - Paper (review sections)
 * - Typography (summary text)
 * - List (authors, affiliations)
 * - Chip (status indicators)
 * - Button (submit, edit sections)
 *
 * **Status:** Placeholder - awaiting implementation
 */
const FinalReviewPlaceholder = () => {
  return (
    <Box sx={{ p: 6, textAlign: "center" }}>
      <Typography variant="h1" gutterBottom>
        13 - Final Review
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Placeholder story. Implementation pending.
      </Typography>
      <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
        Figma reference: /reference/ReX steps/13 - Final Review/
      </Typography>
    </Box>
  );
};

const meta: Meta<typeof FinalReviewPlaceholder> = {
  title: "ReX Flow/13 - Final Review",
  component: FinalReviewPlaceholder,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FinalReviewPlaceholder>;

export const Placeholder: Story = {};
