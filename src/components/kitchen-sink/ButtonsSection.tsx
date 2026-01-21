"use client";
import React from "react";
import {
  Paper,
  Typography,
  Button,
  Stack,
  ButtonGroup,
  Grid,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export const ButtonsSection = React.memo(() => {
  return (
    <Grid size={12}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Buttons
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Button Variants
            </Typography>
            <Stack spacing={2}>
              <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
                sx={{ gap: 2 }}
              >
                <Button variant="text">Text</Button>
                <Button variant="contained">Contained</Button>
                <Button variant="outlined">Outlined</Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Button Colors
            </Typography>
            <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
              <Button variant="contained" color="primary">
                Primary
              </Button>
              <Button variant="contained" color="secondary">
                Secondary
              </Button>
              <Button variant="contained" color="success">
                Success
              </Button>
              <Button variant="contained" color="error">
                Error
              </Button>
              <Button variant="contained" color="warning">
                Warning
              </Button>
              <Button variant="contained" color="info">
                Info
              </Button>
              <Button variant="contained" color="neutral">
                Neutral
              </Button>
              <Button variant="contained" color="black">
                Black
              </Button>
              <Button variant="contained" color="white">
                White
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Button Sizes & Icons
            </Typography>
            <Stack spacing={2}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
                sx={{ gap: 1 }}
              >
                <Button size="small">Small</Button>
                <Button size="medium">Medium</Button>
                <Button size="large">Large</Button>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                sx={{ gap: 1 }}
              >
                <Button variant="contained" startIcon={<SendIcon />}>
                  Send
                </Button>
                <Button variant="contained" endIcon={<AddIcon />}>
                  Add
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  color="error"
                >
                  Delete
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Button Groups
            </Typography>
            <Stack spacing={2} alignItems="flex-start">
              <ButtonGroup variant="contained" aria-label="Basic button group">
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
              </ButtonGroup>
              <ButtonGroup
                variant="outlined"
                aria-label="Outlined button group"
              >
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
              </ButtonGroup>
              <ButtonGroup variant="text" aria-label="Text button group">
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
              </ButtonGroup>
              <ButtonGroup
                size="small"
                variant="outlined"
                color="secondary"
                aria-label="Small button group"
              >
                <Button>Small</Button>
                <Button>Group</Button>
              </ButtonGroup>
              <ButtonGroup
                orientation="vertical"
                variant="contained"
                aria-label="Vertical button group"
              >
                <Button>Top</Button>
                <Button>Middle</Button>
                <Button>Bottom</Button>
              </ButtonGroup>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
});

ButtonsSection.displayName = "ButtonsSection";
