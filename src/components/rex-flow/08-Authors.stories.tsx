import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Typography } from "@mui/material";

/**
 * # 08 - Authors
 *
 * Manage manuscript author list with add/edit/delete capabilities.
 *
 * ## Key Features
 * - Author list display
 * - Add new author
 * - Edit author details
 * - Delete author
 * - Reorder authors (drag & drop)
 *
 * ## MUI Components
 * - List (author list)
 * - Card (author card)
 * - Button (add, edit, delete)
 * - IconButton (actions)
 *
 * **Status:** Placeholder - awaiting implementation
 */
const AuthorsPlaceholder = () => {
  return (
    <Box sx={{ p: 6, textAlign: "center" }}>
      <Typography variant="h1" gutterBottom>
        08 - Authors
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Placeholder story. Implementation pending.
      </Typography>
      <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
        Figma reference: /reference/ReX steps/8 - Authors/
      </Typography>
    </Box>
  );
};

const meta: Meta<typeof AuthorsPlaceholder> = {
  title: "ReX Flow/08 - Authors",
  component: AuthorsPlaceholder,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AuthorsPlaceholder>;

export const Placeholder: Story = {};
