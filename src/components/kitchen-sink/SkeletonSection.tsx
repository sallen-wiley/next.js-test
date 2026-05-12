"use client";
import React from "react";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Link,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

const typographySkeletonVariants = ["h6", "body1", "caption"] as const;

export const SkeletonSection = React.memo(() => {
  const [loadingPreview, setLoadingPreview] = React.useState(true);

  const handleTogglePreview = React.useCallback(() => {
    setLoadingPreview((prev) => !prev);
  }, []);

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Skeleton
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based skeleton patterns for variant shapes, animation styles, and
          inferred sizing during loading states.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-skeleton/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Skeleton docs
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
                  Variants
                </Typography>

                <Stack spacing={1}>
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="rectangular" width={210} height={60} />
                  <Skeleton variant="rounded" width={210} height={60} />
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Animations
                </Typography>

                <Box sx={{ width: 300, maxWidth: "100%" }}>
                  <Skeleton />
                  <Skeleton animation="wave" />
                  <Skeleton animation={false} />
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Typography Inference
                </Typography>

                <Stack spacing={0.5}>
                  {typographySkeletonVariants.map((variant) => (
                    <Typography key={variant} component="div" variant={variant}>
                      <Skeleton />
                    </Typography>
                  ))}
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
                Children Inference
              </Typography>

              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Skeleton variant="circular">
                    <Avatar />
                  </Skeleton>

                  <Box sx={{ width: "100%", ml: 2 }}>
                    <Skeleton width="100%">
                      <Typography>.</Typography>
                    </Skeleton>
                  </Box>
                </Box>

                <Skeleton variant="rectangular" width="100%">
                  <Box sx={{ pt: "56.25%" }} />
                </Skeleton>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Usage Pattern
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.5 }}
              >
                Mirrors the docs approach of conditionally rendering content or
                a skeleton while data is loading.
              </Typography>

              <Button
                variant="outlined"
                onClick={handleTogglePreview}
                sx={{ mb: 2 }}
              >
                {loadingPreview ? "Show loaded state" : "Show loading state"}
              </Button>

              {loadingPreview ? (
                <Stack spacing={1}>
                  <Skeleton variant="rounded" width="100%" height={96} />
                  <Skeleton width="70%" />
                  <Skeleton width="45%" />
                </Stack>
              ) : (
                <Box
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ typography: "mono" as const }}
                  >
                    Loaded Content
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    This placeholder card represents the loaded state after the
                    skeleton is replaced.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
});

SkeletonSection.displayName = "SkeletonSection";
