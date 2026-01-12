import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Typography } from "@mui/material";

/**
 * # 11 - Additional Information
 *
 * Supplementary manuscript metadata and declarations.
 *
 * ## Key Features
 * - Keywords input
 * - Subject area selection
 * - Funding information
 * - Conflict of interest declarations
 * - Ethics approval checkboxes
 *
 * ## MUI Components
 * - TextField (keywords, funding)
 * - Select (subject area)
 * - Checkbox (declarations)
 * - Button (navigation)
 *
 * **Status:** Placeholder - awaiting implementation
 */
const AdditionalInformationPlaceholder = () => {
  return (
    <Box sx={{ p: 6, textAlign: "center" }}>
      <Typography variant="h1" gutterBottom>
        11 - Additional Information
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Placeholder story. Implementation pending.
      </Typography>
      <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
        Figma reference: /reference/ReX steps/11 - Additional Information/
      </Typography>
    </Box>
  );
};

const meta: Meta<typeof AdditionalInformationPlaceholder> = {
  title: "ReX Flow/11 - Additional Information",
  component: AdditionalInformationPlaceholder,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AdditionalInformationPlaceholder>;

export const Placeholder: Story = {};
