import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Typography } from "@mui/material";

/**
 * # 12 - Open Access
 *
 * License selection and open access agreement.
 *
 * ## Key Features
 * - License type radio selection (CC BY, CC BY-NC, etc.)
 * - License details display
 * - Terms agreement checkbox
 * - Pricing information (if applicable)
 *
 * ## MUI Components
 * - RadioGroup (license selection)
 * - Typography (license details)
 * - Checkbox (agreements)
 * - Button (navigation)
 *
 * **Status:** Placeholder - awaiting implementation
 */
const OpenAccessPlaceholder = () => {
  return (
    <Box sx={{ p: 6, textAlign: "center" }}>
      <Typography variant="h1" gutterBottom>
        12 - Open Access
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Placeholder story. Implementation pending.
      </Typography>
      <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
        Figma reference: /reference/ReX steps/12 - Open Access/
      </Typography>
    </Box>
  );
};

const meta: Meta<typeof OpenAccessPlaceholder> = {
  title: "ReX Flow/12 - Open Access",
  component: OpenAccessPlaceholder,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof OpenAccessPlaceholder>;

export const Placeholder: Story = {};
