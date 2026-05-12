"use client";
import React from "react";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import {
  Box,
  Grid,
  Link,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

type Alignment = "left" | "center" | "right" | "justify";

const alignmentButtons = [
  {
    value: "left" as Alignment,
    label: "left aligned",
    icon: <FormatAlignLeftIcon />,
  },
  {
    value: "center" as Alignment,
    label: "centered",
    icon: <FormatAlignCenterIcon />,
  },
  {
    value: "right" as Alignment,
    label: "right aligned",
    icon: <FormatAlignRightIcon />,
  },
  {
    value: "justify" as Alignment,
    label: "justified",
    icon: <FormatAlignJustifyIcon />,
    disabled: true,
  },
];

export const ToggleButtonsSection = React.memo(() => {
  const [alignment, setAlignment] = React.useState<Alignment | null>("left");
  const [formats, setFormats] = React.useState<string[]>(["bold", "italic"]);
  const [enforcedAlignment, setEnforcedAlignment] =
    React.useState<Alignment>("left");
  const [sizeAlignment, setSizeAlignment] = React.useState<Alignment>("left");
  const [platform, setPlatform] = React.useState("web");
  const [view, setView] = React.useState("list");

  const handleAlignment = React.useCallback(
    (_event: React.MouseEvent<HTMLElement>, newAlignment: Alignment | null) => {
      setAlignment(newAlignment);
    },
    [],
  );

  const handleFormats = React.useCallback(
    (_event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
      setFormats(newFormats);
    },
    [],
  );

  const handleEnforcedAlignment = React.useCallback(
    (_event: React.MouseEvent<HTMLElement>, newAlignment: Alignment | null) => {
      if (newAlignment !== null) {
        setEnforcedAlignment(newAlignment);
      }
    },
    [],
  );

  const handleSizeAlignment = React.useCallback(
    (_event: React.MouseEvent<HTMLElement>, newAlignment: Alignment | null) => {
      if (newAlignment !== null) {
        setSizeAlignment(newAlignment);
      }
    },
    [],
  );

  const handlePlatform = React.useCallback(
    (_event: React.MouseEvent<HTMLElement>, newPlatform: string | null) => {
      if (newPlatform !== null) {
        setPlatform(newPlatform);
      }
    },
    [],
  );

  const handleView = React.useCallback(
    (_event: React.MouseEvent<HTMLElement>, nextView: string | null) => {
      if (nextView !== null) {
        setView(nextView);
      }
    },
    [],
  );

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Toggle Buttons
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based toggle patterns for exclusive and multi-select choices with
          semantic grouping.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-toggle-button/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Toggle Button docs
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
                  Exclusive Selection
                </Typography>
                <ToggleButtonGroup
                  value={alignment}
                  exclusive
                  onChange={handleAlignment}
                  aria-label="text alignment"
                >
                  {alignmentButtons.map((button) => (
                    <ToggleButton
                      key={button.value}
                      value={button.value}
                      aria-label={button.label}
                      disabled={button.disabled}
                    >
                      {button.icon}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Multiple Selection
                </Typography>
                <ToggleButtonGroup
                  value={formats}
                  onChange={handleFormats}
                  aria-label="text formatting"
                >
                  <ToggleButton value="bold" aria-label="bold">
                    <FormatBoldIcon />
                  </ToggleButton>
                  <ToggleButton value="italic" aria-label="italic">
                    <FormatItalicIcon />
                  </ToggleButton>
                  <ToggleButton value="underlined" aria-label="underlined">
                    <FormatUnderlinedIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Enforce Value Set
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Keeps one option active at all times.
                </Typography>
                <ToggleButtonGroup
                  value={enforcedAlignment}
                  exclusive
                  onChange={handleEnforcedAlignment}
                  aria-label="enforced text alignment"
                >
                  <ToggleButton value="left" aria-label="left aligned">
                    <FormatAlignLeftIcon />
                  </ToggleButton>
                  <ToggleButton value="center" aria-label="centered">
                    <FormatAlignCenterIcon />
                  </ToggleButton>
                  <ToggleButton value="right" aria-label="right aligned">
                    <FormatAlignRightIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
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
                Size + Color
              </Typography>

              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ typography: "mono" as const }}
                  >
                    Sizes
                  </Typography>
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    <ToggleButtonGroup
                      size="small"
                      value={sizeAlignment}
                      exclusive
                      onChange={handleSizeAlignment}
                      aria-label="small sizes"
                    >
                      <ToggleButton value="left" aria-label="left aligned">
                        <FormatAlignLeftIcon />
                      </ToggleButton>
                      <ToggleButton value="center" aria-label="centered">
                        <FormatAlignCenterIcon />
                      </ToggleButton>
                      <ToggleButton value="right" aria-label="right aligned">
                        <FormatAlignRightIcon />
                      </ToggleButton>
                    </ToggleButtonGroup>

                    <ToggleButtonGroup
                      value={sizeAlignment}
                      exclusive
                      onChange={handleSizeAlignment}
                      aria-label="medium sizes"
                    >
                      <ToggleButton value="left" aria-label="left aligned">
                        <FormatAlignLeftIcon />
                      </ToggleButton>
                      <ToggleButton value="center" aria-label="centered">
                        <FormatAlignCenterIcon />
                      </ToggleButton>
                      <ToggleButton value="right" aria-label="right aligned">
                        <FormatAlignRightIcon />
                      </ToggleButton>
                    </ToggleButtonGroup>

                    <ToggleButtonGroup
                      size="large"
                      value={sizeAlignment}
                      exclusive
                      onChange={handleSizeAlignment}
                      aria-label="large sizes"
                    >
                      <ToggleButton value="left" aria-label="left aligned">
                        <FormatAlignLeftIcon />
                      </ToggleButton>
                      <ToggleButton value="center" aria-label="centered">
                        <FormatAlignCenterIcon />
                      </ToggleButton>
                      <ToggleButton value="right" aria-label="right aligned">
                        <FormatAlignRightIcon />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Stack>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ typography: "mono" as const }}
                  >
                    Color
                  </Typography>
                  <ToggleButtonGroup
                    color="primary"
                    value={platform}
                    exclusive
                    onChange={handlePlatform}
                    aria-label="platform"
                    sx={{ mt: 1 }}
                  >
                    <ToggleButton value="web">Web</ToggleButton>
                    <ToggleButton value="android">Android</ToggleButton>
                    <ToggleButton value="ios">iOS</ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Vertical Buttons
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Stacks toggle actions vertically with exclusive selection.
              </Typography>

              <ToggleButtonGroup
                orientation="vertical"
                value={view}
                exclusive
                onChange={handleView}
                aria-label="view selection"
              >
                <ToggleButton value="list" aria-label="list">
                  <ViewListIcon />
                </ToggleButton>
                <ToggleButton value="module" aria-label="module">
                  <ViewModuleIcon />
                </ToggleButton>
                <ToggleButton value="quilt" aria-label="quilt">
                  <ViewQuiltIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
});

ToggleButtonsSection.displayName = "ToggleButtonsSection";
