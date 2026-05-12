"use client";
import React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  Grid,
  Link,
  Paper,
  Rating,
  Stack,
  Typography,
} from "@mui/material";

const ratingLabels: { [index: number]: string } = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

const getRatingLabelText = (value: number) =>
  `${value} Star${value !== 1 ? "s" : ""}, ${ratingLabels[value]}`;

export const RatingSection = React.memo(() => {
  const [controlledValue, setControlledValue] = React.useState<number | null>(
    2,
  );
  const [hoverValue, setHoverValue] = React.useState(-1);
  const [customValue, setCustomValue] = React.useState<number | null>(3);

  const handleControlledChange = React.useCallback(
    (_event: React.SyntheticEvent, newValue: number | null) => {
      setControlledValue(newValue);
    },
    [],
  );

  const handleHoverChange = React.useCallback(
    (_event: React.SyntheticEvent, newValue: number | null) => {
      setControlledValue(newValue);
    },
    [],
  );

  const handleHoverActiveChange = React.useCallback(
    (_event: React.SyntheticEvent, newHover: number) => {
      setHoverValue(newHover);
    },
    [],
  );

  const handleCustomChange = React.useCallback(
    (_event: React.SyntheticEvent, newValue: number | null) => {
      setCustomValue(newValue);
    },
    [],
  );

  const feedbackLabel =
    controlledValue !== null
      ? ratingLabels[hoverValue !== -1 ? hoverValue : controlledValue]
      : "No rating";

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Rating
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based rating patterns for controlled feedback, precision, hover
          guidance, and icon customization.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-rating/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Rating docs
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
                  Basic Rating
                </Typography>

                <Stack spacing={1} sx={{ "& > legend": { mt: 0.5 } }}>
                  <Typography
                    component="legend"
                    variant="caption"
                    color="text.secondary"
                  >
                    Controlled
                  </Typography>
                  <Rating
                    name="rating-controlled"
                    value={controlledValue}
                    onChange={handleControlledChange}
                  />

                  <Typography
                    component="legend"
                    variant="caption"
                    color="text.secondary"
                  >
                    Read only
                  </Typography>
                  <Rating
                    name="rating-read-only"
                    value={controlledValue}
                    readOnly
                  />

                  <Typography
                    component="legend"
                    variant="caption"
                    color="text.secondary"
                  >
                    Disabled
                  </Typography>
                  <Rating
                    name="rating-disabled"
                    value={controlledValue}
                    disabled
                  />

                  <Typography
                    component="legend"
                    variant="caption"
                    color="text.secondary"
                  >
                    No rating given
                  </Typography>
                  <Rating name="rating-no-value" value={null} />
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Precision
                </Typography>

                <Stack spacing={1}>
                  <Rating
                    name="rating-half"
                    defaultValue={2.5}
                    precision={0.5}
                  />
                  <Rating
                    name="rating-half-read"
                    defaultValue={2.5}
                    precision={0.5}
                    readOnly
                  />
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Hover Feedback
                </Typography>

                <Box sx={{ width: 240, display: "flex", alignItems: "center" }}>
                  <Rating
                    name="rating-hover-feedback"
                    value={controlledValue}
                    precision={0.5}
                    getLabelText={getRatingLabelText}
                    onChange={handleHoverChange}
                    onChangeActive={handleHoverActiveChange}
                    emptyIcon={
                      <StarIcon sx={{ opacity: 0.55 }} fontSize="inherit" />
                    }
                  />
                  <Box sx={{ ml: 2 }}>{feedbackLabel}</Box>
                </Box>
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
                Size + Max
              </Typography>

              <Stack spacing={1.5}>
                <Rating
                  name="rating-size-small"
                  defaultValue={2}
                  size="small"
                />
                <Rating name="rating-size-medium" defaultValue={2} />
                <Rating
                  name="rating-size-large"
                  defaultValue={2}
                  size="large"
                />

                <Box sx={{ pt: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    10-star scale
                  </Typography>
                  <Rating name="rating-max-10" defaultValue={7} max={10} />
                </Box>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Custom Icons
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.5 }}
              >
                Heart icons with half-step precision and custom color treatment.
              </Typography>

              <Rating
                name="rating-custom-hearts"
                value={customValue}
                onChange={handleCustomChange}
                precision={0.5}
                getLabelText={(value: number) =>
                  `${value} Heart${value !== 1 ? "s" : ""}`
                }
                icon={<FavoriteIcon fontSize="inherit" />}
                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "error.main",
                  },
                  "& .MuiRating-iconHover": {
                    color: "error.dark",
                  },
                }}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Selected value: {customValue ?? "none"}
              </Typography>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
});

RatingSection.displayName = "RatingSection";
