import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";

const MySubmissions = () => {
  const [selectedLayout, setSelectedLayout] = React.useState<
    "desktop" | "mobile"
  >("desktop");

  const states = [
    { name: "Default", description: "Dashboard with active submissions" },
    { name: "Empty", description: "No submissions available yet" },
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 1600 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Chip label="Step 1 of 15" color="primary" size="small" />
          <Typography variant="h3">My Submissions</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Landing page showing all manuscript submissions with their current
          status. Authors can view drafts, track progress, and initiate new
          submissions.
        </Typography>
      </Box>

      <Paper sx={{ mb: 4, p: 2 }}>
        <Tabs value={selectedLayout} onChange={(_, v) => setSelectedLayout(v)}>
          <Tab label="Desktop Layout" value="desktop" />
          <Tab label="Mobile Layout" value="mobile" />
        </Tabs>
      </Paper>

      <Grid container spacing={4}>
        {states.map((state) => (
          <Grid key={state.name} size={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                {state.name} State
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {state.description}
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  width: "100%",
                  height: selectedLayout === "desktop" ? 600 : 800,
                  bgcolor: "grey.100",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: 1,
                  borderColor: "divider",
                  backgroundImage: `url(/reference/ReX steps/1 - My submissions/Layout=${
                    selectedLayout === "desktop" ? "Desktop" : "Mobile"
                  },State=${state.name}.png)`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}>
                <Typography
                  variant="caption"
                  sx={{
                    bgcolor: "background.paper",
                    p: 1,
                    borderRadius: 1,
                    boxShadow: 1,
                  }}>
                  Layout: {selectedLayout === "desktop" ? "Desktop" : "Mobile"}{" "}
                  • State: {state.name}
                </Typography>
              </Box>

              <Box
                sx={{ mt: 2, p: 2, bgcolor: "info.lighter", borderRadius: 1 }}>
                <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                  📁 reference/ReX steps/1 - My submissions/Layout=
                  {selectedLayout === "desktop" ? "Desktop" : "Mobile"},State=
                  {state.name}.png
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          mt: 4,
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
        }}>
        <Typography variant="h6" gutterBottom>
          Key Features
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" gutterBottom>
              Default State:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • List of active submissions
              <br />
              • Status indicators for each manuscript
              <br />
              • Quick actions (edit, continue, view)
              <br />• New submission button
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" gutterBottom>
              Empty State:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Welcome message for first-time users
              <br />
              • Call-to-action to start first submission
              <br />
              • Guidance on the submission process
              <br />• Visual illustration
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const meta: Meta<typeof MySubmissions> = {
  title: "ReX Components/Submission Flow/01 - My Submissions",
  component: MySubmissions,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Step 1: Dashboard view showing all manuscript submissions. Includes Default and Empty states for both Desktop and Mobile layouts.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
