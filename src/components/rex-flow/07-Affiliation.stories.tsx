import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Typography } from "@mui/material";

/**
 * # 07 - Affiliation
 *
 * Add institutional affiliations with autocomplete search.
 *
 * ## Key Features
 * - Institution autocomplete search
 * - Department text field
 * - Custom affiliation option
 * - List of added affiliations
 * - Edit/delete affiliations
 *
 * ## MUI Components
 * - Autocomplete (institution search)
 * - TextField (department, custom)
 * - List (added affiliations)
 * - Button (add, edit, delete)
 *
 * **Status:** Placeholder - awaiting implementation
 */
const AffiliationPlaceholder = () => {
  return (
    <Box sx={{ p: 6, textAlign: "center" }}>
      <Typography variant="h1" gutterBottom>
        07 - Affiliation
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Placeholder story. Implementation pending.
      </Typography>
      <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
        Figma reference: /reference/ReX steps/7 - Affiliation/
      </Typography>
    </Box>
  );
};

const meta: Meta<typeof AffiliationPlaceholder> = {
  title: "ReX Flow/07 - Affiliation",
  component: AffiliationPlaceholder,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AffiliationPlaceholder>;

export const Placeholder: Story = {};
