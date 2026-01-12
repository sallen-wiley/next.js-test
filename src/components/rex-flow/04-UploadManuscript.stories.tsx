import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Typography } from "@mui/material";

/**
 * # 04 - Upload Manuscript
 *
 * File upload interface for manuscript and supplementary materials.
 *
 * ## Key Features
 * - Drag & drop zone
 * - File type validation
 * - Upload progress indicator
 * - File list with delete option
 *
 * ## MUI Components
 * - Custom Drag & Drop Zone
 * - Button (file picker)
 * - LinearProgress (upload status)
 * - List (uploaded files)
 * - IconButton (delete)
 *
 * **Status:** Placeholder - awaiting implementation
 */
const UploadManuscriptPlaceholder = () => {
  return (
    <Box sx={{ p: 6, textAlign: "center" }}>
      <Typography variant="h1" gutterBottom>
        04 - Upload Manuscript
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Placeholder story. Implementation pending.
      </Typography>
      <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
        Figma reference: /reference/ReX steps/4 - Upload Manuscript/
      </Typography>
    </Box>
  );
};

const meta: Meta<typeof UploadManuscriptPlaceholder> = {
  title: "ReX Flow/04 - Upload Manuscript",
  component: UploadManuscriptPlaceholder,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof UploadManuscriptPlaceholder>;

export const Placeholder: Story = {};
