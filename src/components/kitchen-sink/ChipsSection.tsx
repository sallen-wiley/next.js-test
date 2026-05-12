"use client";
import React from "react";
import DoneIcon from "@mui/icons-material/Done";
import FaceIcon from "@mui/icons-material/Face";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import Avatar from "@mui/material/Avatar";
import { Box, Chip, Grid, Link, Paper, Stack, Typography } from "@mui/material";

interface ChipItem {
  key: number;
  label: string;
}

const initialChipItems: readonly ChipItem[] = [
  { key: 0, label: "Angular" },
  { key: 1, label: "jQuery" },
  { key: 2, label: "Polymer" },
  { key: 3, label: "React" },
  { key: 4, label: "Vue.js" },
];

export const ChipsSection = React.memo(() => {
  const [chipItems, setChipItems] =
    React.useState<readonly ChipItem[]>(initialChipItems);

  const handleDelete = React.useCallback((chipToDelete: ChipItem) => {
    setChipItems((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key),
    );
  }, []);

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Chips
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based chip patterns for compact attributes, quick actions, and
          removable collections.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-chip/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Chip docs
          </Link>
          .
        </Typography>
      </Stack>

      <Grid container spacing={3} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ typography: "mono" as const }}
            >
              Core Patterns
            </Typography>

            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Basic Chip
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ gap: 1 }}
                >
                  <Chip label="Chip Filled" />
                  <Chip label="Chip Outlined" variant="outlined" />
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Chip Actions
                </Typography>
                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{ gap: 1 }}
                  >
                    <Chip label="Clickable" onClick={() => {}} />
                    <Chip
                      label="Clickable"
                      variant="outlined"
                      onClick={() => {}}
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{ gap: 1 }}
                  >
                    <Chip label="Deletable" onDelete={() => {}} />
                    <Chip
                      label="Deletable"
                      variant="outlined"
                      onDelete={() => {}}
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{ gap: 1 }}
                  >
                    <Chip
                      label="Clickable Deletable"
                      onClick={() => {}}
                      onDelete={() => {}}
                    />
                    <Chip
                      label="Custom delete icon"
                      onClick={() => {}}
                      onDelete={() => {}}
                      deleteIcon={<DoneIcon />}
                      variant="outlined"
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{ gap: 1 }}
                  >
                    <Chip
                      label="Clickable Link"
                      component="a"
                      href="#chips-section-link"
                      clickable
                    />
                    <Chip
                      label="Clickable Link"
                      component="a"
                      href="#chips-section-link"
                      variant="outlined"
                      clickable
                    />
                  </Stack>
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Chip Adornments
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ gap: 1 }}
                >
                  <Chip avatar={<Avatar>M</Avatar>} label="Avatar" />
                  <Chip
                    avatar={<Avatar alt="Natacha">N</Avatar>}
                    label="Avatar"
                    variant="outlined"
                  />
                  <Chip icon={<FaceIcon />} label="With Icon" />
                  <Chip
                    icon={<FaceIcon />}
                    label="With Icon"
                    variant="outlined"
                  />
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Color + Size
              </Typography>

              <Stack spacing={1.5}>
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ gap: 1 }}
                >
                  <Chip label="primary" color="primary" />
                  <Chip label="secondary" color="secondary" />
                  <Chip label="success" color="success" />
                  <Chip label="warning" color="warning" />
                  <Chip label="error" color="error" />
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ gap: 1 }}
                >
                  <Chip label="primary" color="primary" variant="outlined" />
                  <Chip label="success" color="success" variant="outlined" />
                  <Chip label="Small" size="small" />
                  <Chip
                    label="Small outlined"
                    size="small"
                    variant="outlined"
                  />
                </Stack>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Chip Array
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.5 }}
              >
                Removing a chip updates the collection state.
              </Typography>

              <Paper
                component="ul"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  listStyle: "none",
                  p: 0.5,
                  m: 0,
                }}
              >
                {chipItems.map((item) => {
                  const icon =
                    item.label === "React" ? <TagFacesIcon /> : undefined;

                  return (
                    <Box component="li" key={item.key} sx={{ m: 0.5 }}>
                      <Chip
                        icon={icon}
                        label={item.label}
                        onDelete={
                          item.label === "React"
                            ? undefined
                            : () => handleDelete(item)
                        }
                      />
                    </Box>
                  );
                })}
              </Paper>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      <Box id="chips-section-link" sx={{ position: "relative", top: -80 }} />
    </Grid>
  );
});

ChipsSection.displayName = "ChipsSection";
