"use client";
import React from "react";
import {
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export const BackdropSection = React.memo(() => {
  const [open, setOpen] = React.useState(false);

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Backdrop
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based backdrop pattern for emphasizing loading or blocking
          interactions during critical transitions.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-backdrop/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Backdrop docs
          </Link>
          .
        </Typography>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ typography: "mono" as const }}
        >
          Overlay Pattern
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Use a backdrop to communicate that the current process is in progress.
        </Typography>

        <Button variant="contained" onClick={() => setOpen(true)}>
          Show Backdrop
        </Button>

        <Backdrop
          sx={(theme) => ({
            color: "#fff",
            zIndex: (theme.vars || theme).zIndex.drawer + 1,
          })}
          open={open}
          onClick={() => setOpen(false)}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Paper>
    </Grid>
  );
});

BackdropSection.displayName = "BackdropSection";
