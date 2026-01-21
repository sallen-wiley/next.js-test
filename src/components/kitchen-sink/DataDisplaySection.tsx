"use client";
import React from "react";
import {
  Paper,
  Typography,
  Alert,
  AlertTitle,
  Chip,
  Avatar,
  AvatarGroup,
  Rating,
  LinearProgress,
  Stack,
  Box,
  Grid,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import SuccessIcon from "@mui/icons-material/CheckCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";

export const DataDisplaySection = React.memo(() => {
  const [rating, setRating] = React.useState(3.5);

  return (
    <Grid size={12}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Data Display
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Alerts
            </Typography>
            <Stack spacing={2}>
              <Alert severity="success" icon={<SuccessIcon />}>
                <AlertTitle>Success</AlertTitle>
                Operation completed successfully!
              </Alert>
              <Alert severity="info" icon={<InfoIcon />}>
                <AlertTitle>Information</AlertTitle>
                Here&apos;s some helpful information.
              </Alert>
              <Alert severity="warning" icon={<WarningIcon />}>
                <AlertTitle>Warning</AlertTitle>
                Please be careful with this action.
              </Alert>
              <Alert severity="error" icon={<ErrorIcon />}>
                <AlertTitle>Error</AlertTitle>
                Something went wrong!
              </Alert>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Chips & Avatars
            </Typography>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Chip Colors
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ gap: 1 }}
                >
                  <Chip label="Default" />
                  <Chip label="Primary" color="primary" />
                  <Chip label="Secondary" color="secondary" />
                  <Chip label="Success" color="success" />
                  <Chip label="Error" color="error" />
                  <Chip label="Warning" color="warning" />
                  <Chip label="Info" color="info" />
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Interactive Chips
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ gap: 1 }}
                >
                  <Chip label="Deletable" onDelete={() => {}} color="primary" />
                  <Chip
                    label="Clickable"
                    onClick={() => {}}
                    color="secondary"
                  />
                  <Chip label="With Avatar" avatar={<Avatar>M</Avatar>} />
                  <Chip
                    label="With Icon"
                    icon={<FavoriteIcon />}
                    variant="outlined"
                  />
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Avatar Group
                </Typography>
                <AvatarGroup max={4}>
                  <Avatar alt="User 1" sx={{ bgcolor: "primary.main" }}>
                    U1
                  </Avatar>
                  <Avatar alt="User 2" sx={{ bgcolor: "secondary.main" }}>
                    U2
                  </Avatar>
                  <Avatar alt="User 3" sx={{ bgcolor: "success.main" }}>
                    U3
                  </Avatar>
                  <Avatar alt="User 4" sx={{ bgcolor: "error.main" }}>
                    U4
                  </Avatar>
                  <Avatar alt="User 5" sx={{ bgcolor: "warning.main" }}>
                    U5
                  </Avatar>
                </AvatarGroup>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Rating
                </Typography>
                <Rating
                  value={rating}
                  onChange={(_, newValue) => setRating(newValue || 0)}
                  precision={0.5}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Progress
                </Typography>
                <LinearProgress variant="determinate" value={65} />
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
});

DataDisplaySection.displayName = "DataDisplaySection";
