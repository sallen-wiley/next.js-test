"use client";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Grid,
  Link,
  Pagination,
  PaginationItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export const PaginationSection = React.memo(() => {
  const [page, setPage] = React.useState(1);

  const handlePageChange = React.useCallback(
    (_event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
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
        Pagination
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based pagination patterns with our standard outlined + rounded
          styling for ranges, button behavior, icon customization, and
          controlled state.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-pagination/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Pagination docs
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
                  Outlined + Rounded States
                </Typography>
                <Stack spacing={1.5}>
                  <Pagination count={10} variant="outlined" shape="rounded" />
                  <Pagination
                    count={10}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                  />
                  <Pagination
                    count={10}
                    variant="outlined"
                    shape="rounded"
                    color="secondary"
                  />
                  <Pagination
                    count={10}
                    variant="outlined"
                    shape="rounded"
                    disabled
                  />
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Outlined + Rounded Sizes
                </Typography>
                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Small
                    </Typography>
                    <Pagination
                      count={10}
                      size="small"
                      variant="outlined"
                      shape="rounded"
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Medium
                    </Typography>
                    <Pagination count={10} variant="outlined" shape="rounded" />
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Large
                    </Typography>
                    <Pagination
                      count={10}
                      size="large"
                      variant="outlined"
                      shape="rounded"
                    />
                  </Box>
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Ranges
                </Typography>
                <Stack spacing={1.5}>
                  <Pagination
                    count={11}
                    defaultPage={6}
                    siblingCount={0}
                    variant="outlined"
                    shape="rounded"
                  />
                  <Pagination
                    count={11}
                    defaultPage={6}
                    variant="outlined"
                    shape="rounded"
                  />
                  <Pagination
                    count={11}
                    defaultPage={6}
                    siblingCount={0}
                    boundaryCount={2}
                    variant="outlined"
                    shape="rounded"
                  />
                  <Pagination
                    count={11}
                    defaultPage={6}
                    boundaryCount={2}
                    variant="outlined"
                    shape="rounded"
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
                Buttons + Custom Icons
              </Typography>

              <Stack spacing={1.5}>
                <Pagination
                  count={10}
                  showFirstButton
                  showLastButton
                  variant="outlined"
                  shape="rounded"
                />
                <Pagination
                  count={10}
                  hidePrevButton
                  hideNextButton
                  variant="outlined"
                  shape="rounded"
                />

                <Pagination
                  count={10}
                  variant="outlined"
                  shape="rounded"
                  renderItem={(item) => (
                    <PaginationItem
                      slots={{
                        previous: ArrowBackIcon,
                        next: ArrowForwardIcon,
                      }}
                      {...item}
                    />
                  )}
                />
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Controlled Pagination
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.5 }}
              >
                Page: {page}
              </Typography>

              <Pagination
                count={10}
                page={page}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
              />
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
});

PaginationSection.displayName = "PaginationSection";
