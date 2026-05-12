"use client";
import React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grid,
  Grow,
  Link,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const buttonSizes = ["small", "medium", "large"] as const;

const acceptedVariations = [
  {
    label: "Primary Contained",
    variant: "contained" as const,
    color: "primary" as const,
  },
  {
    label: "Primary Outlined",
    variant: "outlined" as const,
    color: "primary" as const,
  },
  {
    label: "Primary Text",
    variant: "text" as const,
    color: "primary" as const,
  },
];

const splitOptions = [
  "Create a merge commit",
  "Squash and merge",
  "Rebase and merge",
];

export const ButtonGroupsSection = React.memo(() => {
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleSplitAction = React.useCallback(() => {
    console.info(`Selected action: ${splitOptions[selectedIndex]}`);
  }, [selectedIndex]);

  const handleMenuItemClick = React.useCallback(
    (_event: React.MouseEvent<HTMLLIElement>, index: number) => {
      setSelectedIndex(index);
      setOpen(false);
    },
    [],
  );

  const handleToggle = React.useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, []);

  const handleClose = React.useCallback((event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  }, []);

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Button Groups
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          These examples mirror the accepted button variations and include
          docs-based use cases from the MUI Button Group component.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-button-group/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Button Group docs
          </Link>
          .
        </Typography>
      </Stack>

      <Grid container spacing={3} alignItems="center">
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ typography: "mono" as const }}
            >
              Accepted Variations
            </Typography>

            <Stack spacing={2}>
              {acceptedVariations.map(({ label, variant, color }) => (
                <Box
                  key={label}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      lg: "170px minmax(0, 1fr)",
                    },
                    alignItems: "start",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ minWidth: 170, pt: { lg: 0.75 } }}
                  >
                    {label}
                  </Typography>

                  <Stack spacing={1}>
                    {buttonSizes.map((size) => (
                      <Box
                        key={`${label}-${size}`}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            sm: "64px minmax(0, 1fr)",
                          },
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            typography: "mono" as const,
                            textTransform: "capitalize",
                          }}
                        >
                          {size}
                        </Typography>

                        <Box sx={{ minWidth: 0, overflowX: "auto", pb: 0.25 }}>
                          <ButtonGroup
                            variant={variant}
                            color={color}
                            size={size}
                            aria-label={`${label} ${size} button group`}
                          >
                            <Button>One</Button>
                            <Button>Two</Button>
                            <Button>Three</Button>
                          </ButtonGroup>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ))}
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
                Vertical Group
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Useful for compact action stacks in side panels and dense
                toolbars.
              </Typography>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <ButtonGroup
                  orientation="vertical"
                  variant="outlined"
                  aria-label="vertical outlined group"
                >
                  <Button>First</Button>
                  <Button>Second</Button>
                  <Button>Third</Button>
                </ButtonGroup>

                <ButtonGroup
                  orientation="vertical"
                  variant="contained"
                  color="primary"
                  aria-label="vertical contained group"
                >
                  <Button>First</Button>
                  <Button>Second</Button>
                  <Button>Third</Button>
                </ButtonGroup>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Split Button
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Docs pattern: primary action + adjacent menu for related
                alternatives.
              </Typography>

              <Box>
                <ButtonGroup
                  variant="contained"
                  ref={anchorRef}
                  aria-label="button group with a nested menu"
                >
                  <Button onClick={handleSplitAction}>
                    {splitOptions[selectedIndex]}
                  </Button>
                  <Button
                    size="small"
                    aria-controls={open ? "split-button-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-label="select action"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                  >
                    <ArrowDropDownIcon />
                  </Button>
                </ButtonGroup>

                <Popper
                  sx={{ zIndex: 1 }}
                  open={open}
                  anchorEl={anchorRef.current}
                  role={undefined}
                  transition
                  disablePortal
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "bottom"
                            ? "center top"
                            : "center bottom",
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList id="split-button-menu" autoFocusItem>
                            {splitOptions.map((option, index) => (
                              <MenuItem
                                key={option}
                                selected={index === selectedIndex}
                                onClick={(event) =>
                                  handleMenuItemClick(event, index)
                                }
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
});

ButtonGroupsSection.displayName = "ButtonGroupsSection";
