import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Typography, Paper, Divider } from "@mui/material";

// ReX Typography Tokens from Figma
const rexTypography = {
  "main title": {
    family: "Open Sans",
    weight: "regular (400)",
    size: "25px",
  },
  subtitle: {
    family: "Open Sans",
    weight: "semibold (600)",
    size: "20px",
  },
  "item title": {
    family: "Open Sans",
    weight: "regular (400)",
    size: "20px",
  },
  text: {
    family: "Open Sans",
    weight: "regular (400)",
    size: "14px",
    variants: "italic, bold (semibold)",
  },
  button: {
    family: "Open Sans",
    weight: "semibold (600)",
    size: "14px",
  },
};

const TypeSpecRow = ({
  label,
  muiVariant,
  fontFamily,
  fontSize,
  fontWeight,
  example = "The quick brown fox jumps over the lazy dog",
}: {
  label: string;
  muiVariant:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body1"
    | "body2"
    | "button"
    | "subtitle1"
    | "subtitle2"
    | "caption"
    | "overline";
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  example?: string;
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          mb: 1,
          alignItems: "baseline",
        }}>
        <Typography
          variant="overline"
          sx={{
            minWidth: 120,
            color: "text.secondary",
          }}>
          {label}
        </Typography>
        <Box sx={{ flex: 1 }}>
          <Typography variant={muiVariant} sx={{ mb: 0.5 }}>
            {example}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              display: "block",
              fontFamily: "monospace",
            }}>
            {fontSize} • {fontWeight} • {fontFamily}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ opacity: 0.3 }} />
    </Box>
  );
};

const RexTypographyDemo = () => {
  return (
    <Box sx={{ p: 4, maxWidth: 1200 }}>
      <Typography variant="h3" gutterBottom>
        ReX Components - Typography Scale
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Typography tokens from Figma ReX Components (Proposed mode) mapped to
        MUI variants
      </Typography>

      {/* Figma Token Specifications */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Figma Design Tokens
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Font Family: Open Sans
          </Typography>
          <Box sx={{ mt: 3 }}>
            {Object.entries(rexTypography).map(([name, spec]) => (
              <Box key={name} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Size: {spec.size} • Weight: {spec.weight}
                  {"variants" in spec && ` • Variants: ${spec.variants}`}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>

      {/* MUI Typography Mapping */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          MUI Typography Variants
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Figma tokens mapped to Material-UI typography variants. Switch to
            &quot;rex&quot; theme to see exact specifications.
          </Typography>

          {/* Headings */}
          <Typography
            sx={{
              color: "primary.main",
              fontWeight: 600,
              mb: 2,
              display: "block",
            }}>
            Headings
          </Typography>

          <TypeSpecRow
            label="H1"
            muiVariant="h1"
            fontFamily="Open Sans"
            fontSize="25px"
            fontWeight="Regular (400)"
            example="Main Page Title"
          />

          <TypeSpecRow
            label="H2"
            muiVariant="h2"
            fontFamily="Open Sans"
            fontSize="20px"
            fontWeight="Semibold (600)"
            example="Section Subtitle"
          />

          <TypeSpecRow
            label="H3"
            muiVariant="h3"
            fontFamily="Open Sans"
            fontSize="20px"
            fontWeight="Regular (400)"
            example="Item or Card Title"
          />

          <TypeSpecRow
            label="H4"
            muiVariant="h4"
            fontFamily="Open Sans"
            fontSize="18px"
            fontWeight="Medium (500)"
            example="Subsection Heading"
          />

          <TypeSpecRow
            label="H5"
            muiVariant="h5"
            fontFamily="Open Sans"
            fontSize="16px"
            fontWeight="Medium (500)"
            example="Minor Heading"
          />

          <TypeSpecRow
            label="H6"
            muiVariant="h6"
            fontFamily="Open Sans"
            fontSize="14px"
            fontWeight="Semibold (600)"
            example="Smallest Heading"
          />

          {/* Body Text */}
          <Typography
            sx={{
              color: "primary.main",
              fontWeight: 600,
              mt: 4,
              mb: 2,
              display: "block",
            }}>
            Body Text
          </Typography>

          <TypeSpecRow
            label="Body 1"
            muiVariant="body1"
            fontFamily="Open Sans"
            fontSize="14px"
            fontWeight="Regular (400)"
            example="This is primary body text used for main content, descriptions, and paragraphs throughout the interface."
          />

          <TypeSpecRow
            label="Body 2"
            muiVariant="body2"
            fontFamily="Open Sans"
            fontSize="13px"
            fontWeight="Regular (400)"
            example="This is secondary body text for supporting content and less prominent information."
          />

          {/* UI Elements */}
          <Typography
            sx={{
              color: "primary.main",
              fontWeight: 600,
              mt: 4,
              mb: 2,
              display: "block",
            }}>
            UI Elements
          </Typography>

          <TypeSpecRow
            label="Button"
            muiVariant="button"
            fontFamily="Open Sans"
            fontSize="14px"
            fontWeight="Semibold (600)"
            example="Button Text"
          />

          <TypeSpecRow
            label="Subtitle1"
            muiVariant="subtitle1"
            fontFamily="Open Sans"
            fontSize="14px"
            fontWeight="Semibold (600)"
            example="Bold label or form field label"
          />

          <TypeSpecRow
            label="Subtitle2"
            muiVariant="subtitle2"
            fontFamily="Open Sans"
            fontSize="14px"
            fontWeight="Regular (400)"
            example="Regular label or metadata"
          />

          <TypeSpecRow
            label="Caption"
            muiVariant="caption"
            fontFamily="Open Sans"
            fontSize="12px"
            fontWeight="Regular (400)"
            example="Helper text, hints, and small annotations"
          />

          <TypeSpecRow
            label="Overline"
            muiVariant="overline"
            fontFamily="Open Sans"
            fontSize="11px"
            fontWeight="Semibold (600)"
            example="SMALL LABELS AND TAGS"
          />
        </Paper>
      </Box>

      {/* Text Variants Examples */}
      <Box>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Text Styling Examples
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" paragraph>
            Regular text with <strong>bold (semibold)</strong> and{" "}
            <em>italic</em> variants.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontWeight: 600 }}>
            This is bold text using semibold weight (600).
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontStyle: "italic" }}>
            This is italic text for emphasis or citations.
          </Typography>
          <Typography variant="body1">
            Combined:{" "}
            <strong>
              <em>bold italic text</em>
            </strong>{" "}
            for maximum emphasis.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

const meta: Meta<typeof RexTypographyDemo> = {
  title: "ReX Components/Typography Scale",
  component: RexTypographyDemo,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Complete typography scale for ReX Components design system, showing Figma design tokens mapped to MUI variants.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
