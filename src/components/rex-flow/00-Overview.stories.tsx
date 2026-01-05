import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";

const FlowOverview = () => {
  const steps = [
    {
      number: 1,
      title: "My Submissions",
      description: "Dashboard showing all manuscript submissions",
    },
    {
      number: 2,
      title: "Progress Board",
      description: "Visual progress tracking for submissions",
    },
    {
      number: 3,
      title: "Article Type",
      description: "Select manuscript type and category",
    },
    {
      number: 4,
      title: "Upload Manuscript",
      description: "Upload manuscript files and documents",
    },
    {
      number: 5,
      title: "Title",
      description: "Enter manuscript title and subtitle",
    },
    {
      number: 6,
      title: "Abstract",
      description: "Provide manuscript abstract",
    },
    {
      number: 7,
      title: "Affiliation",
      description: "Add author institutional affiliations",
    },
    {
      number: 8,
      title: "Authors",
      description: "List all contributing authors",
    },
    {
      number: 9,
      title: "Author Details",
      description: "Detailed information for each author",
    },
    {
      number: 10,
      title: "Match Organizations",
      description: "Link authors to organizations",
    },
    {
      number: 11,
      title: "Additional Information",
      description: "Supplementary submission details",
    },
    {
      number: 12,
      title: "Open Access",
      description: "Choose open access options",
    },
    {
      number: 13,
      title: "Final Review",
      description: "Review all submission information",
    },
    {
      number: 14,
      title: "Submission Overview",
      description: "Complete submission summary",
    },
    {
      number: 15,
      title: "Confetti Screen",
      description: "Submission confirmation celebration",
    },
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 1400 }}>
      <Typography variant="h3" gutterBottom>
        ReX Submission Flow
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Complete manuscript submission journey with 15 sequential steps. Each
        step includes Desktop and Mobile layouts with multiple states (Default,
        Empty, Error, Draft, Revision).
      </Typography>

      <Box sx={{ mb: 4, p: 3, bgcolor: "info.lighter", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Flow Overview
        </Typography>
        <Typography variant="body2">
          <strong>Total Steps:</strong> 15
          <br />
          <strong>Layouts:</strong> Desktop & Mobile
          <br />
          <strong>States:</strong> Default, Empty, Error, Draft, Revision
          <br />
          <strong>Design System:</strong> ReX Components
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {steps.map((step) => (
          <Grid key={step.number} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}>
              <Box
                sx={{
                  height: 120,
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `linear-gradient(135deg, #005274 0%, #003952 100%)`,
                }}>
                <Typography
                  variant="h2"
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: "3rem",
                  }}>
                  {step.number}
                </Typography>
              </Box>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          mt: 6,
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
        }}>
        <Typography variant="h6" gutterBottom>
          Usage
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Navigate to individual step stories to see detailed screens with all
          layout variations and states. Each story shows side-by-side
          comparisons of Desktop/Mobile layouts.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Next:</strong> Click through steps 1-15 in the left sidebar to
          explore each screen in detail.
        </Typography>
      </Box>
    </Box>
  );
};

const meta: Meta<typeof FlowOverview> = {
  title: "ReX Components/Submission Flow/00 - Overview",
  component: FlowOverview,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Complete overview of the ReX manuscript submission flow with 15 sequential steps.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
