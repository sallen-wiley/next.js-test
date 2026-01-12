import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Typography } from "@mui/material";

/**
 * # 14 - Submission Overview
 *
 * Post-submission confirmation with submission details.
 *
 * ## Key Features
 * - Submission ID and date
 * - Status indicator
 * - Manuscript summary
 * - Action buttons (view, download, track)
 *
 * ## MUI Components
 * - Paper (confirmation container)
 * - Typography (submission details)
 * - Chip (status)
 * - Button (view, download, new submission)
 *
 * **Status:** Placeholder - awaiting implementation
 */
const SubmissionOverviewPlaceholder = () => {
  return (
    <Box sx={{ p: 6, textAlign: "center" }}>
      <Typography variant="h1" gutterBottom>
        14 - Submission Overview
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Placeholder story. Implementation pending.
      </Typography>
      <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
        Figma reference: /reference/ReX steps/14 - Submission Overview/
      </Typography>
    </Box>
  );
};

const meta: Meta<typeof SubmissionOverviewPlaceholder> = {
  title: "ReX Flow/14 - Submission Overview",
  component: SubmissionOverviewPlaceholder,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SubmissionOverviewPlaceholder>;

export const Placeholder: Story = {};
