import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Typography } from "@mui/material";

/**
 * # 09 - Author Details
 *
 * Form for entering detailed information about individual authors.
 *
 * ## Key Features
 * - Name fields (first, middle, last)
 * - Email validation
 * - ORCID ID input
 * - Corresponding author checkbox
 * - Role/contribution selection
 *
 * ## MUI Components
 * - TextField (name, email, ORCID)
 * - Checkbox (corresponding author)
 * - Select (role dropdown)
 * - Button (save, cancel)
 *
 * **Status:** Placeholder - awaiting implementation
 */
const AuthorDetailsPlaceholder = () => {
  return (
    <Box sx={{ p: 6, textAlign: "center" }}>
      <Typography variant="h1" gutterBottom>
        09 - Author Details
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Placeholder story. Implementation pending.
      </Typography>
      <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
        Figma reference: /reference/ReX steps/9 - Author Details/
      </Typography>
    </Box>
  );
};

const meta: Meta<typeof AuthorDetailsPlaceholder> = {
  title: "ReX Flow/09 - Author Details",
  component: AuthorDetailsPlaceholder,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AuthorDetailsPlaceholder>;

export const Placeholder: Story = {};
