"use client";
import React from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Link,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";

const radioOptions = ["Female", "Male", "Other"] as const;

export const RadioButtonsSection = React.memo(() => {
  const [controlledValue, setControlledValue] = React.useState("female");
  const [quizValue, setQuizValue] = React.useState("");
  const [quizError, setQuizError] = React.useState(false);
  const [quizHelperText, setQuizHelperText] = React.useState("Choose wisely");
  const [sizeColorValue, setSizeColorValue] = React.useState("primary");

  const handleControlledChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setControlledValue((event.target as HTMLInputElement).value);
    },
    [],
  );

  const handleQuizChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuizValue((event.target as HTMLInputElement).value);
      setQuizError(false);
      setQuizHelperText(" ");
    },
    [],
  );

  const handleQuizSubmit = React.useCallback(() => {
    if (quizValue === "best") {
      setQuizError(false);
      setQuizHelperText("You got it!");
      return;
    }

    if (quizValue === "worst") {
      setQuizError(true);
      setQuizHelperText("Sorry, wrong answer.");
      return;
    }

    setQuizError(true);
    setQuizHelperText("Please select an option.");
  }, [quizValue]);

  const handleSizeColorChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSizeColorValue((event.target as HTMLInputElement).value);
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
        Radio Buttons
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based radio patterns for single-choice input with keyboard and
          label accessibility built in.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-radio-button/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Radio Group docs
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
                  Grouped Radios
                </Typography>

                <FormControl>
                  <FormLabel id="kitchen-radio-group-label">Gender</FormLabel>
                  <RadioGroup
                    aria-labelledby="kitchen-radio-group-label"
                    defaultValue="female"
                    name="kitchen-radio-group"
                  >
                    {radioOptions.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option.toLowerCase()}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Row Direction
                </Typography>

                <FormControl>
                  <FormLabel id="kitchen-row-radio-group-label">Role</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="kitchen-row-radio-group-label"
                    name="kitchen-row-radio-group"
                    defaultValue="author"
                  >
                    <FormControlLabel
                      value="author"
                      control={<Radio />}
                      label="Author"
                    />
                    <FormControlLabel
                      value="reviewer"
                      control={<Radio />}
                      label="Reviewer"
                    />
                    <FormControlLabel
                      value="editor"
                      control={<Radio />}
                      label="Editor"
                    />
                    <FormControlLabel
                      value="disabled"
                      disabled
                      control={<Radio />}
                      label="Disabled"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Controlled Group
                </Typography>

                <FormControl>
                  <FormLabel id="kitchen-controlled-radio-group-label">
                    Controlled value
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="kitchen-controlled-radio-group-label"
                    name="kitchen-controlled-radio-group"
                    value={controlledValue}
                    onChange={handleControlledChange}
                  >
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                  </RadioGroup>
                  <FormHelperText>
                    Selected: {controlledValue || "none"}
                  </FormHelperText>
                </FormControl>
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
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Demonstrates small/default size and common color tokens.
              </Typography>

              <RadioGroup
                name="kitchen-size-color-radio-group"
                value={sizeColorValue}
                onChange={handleSizeColorChange}
              >
                <FormControlLabel
                  value="primary"
                  control={<Radio size="small" color="primary" />}
                  label="Primary (small)"
                />
                <FormControlLabel
                  value="secondary"
                  control={<Radio color="secondary" />}
                  label="Secondary"
                />
                <FormControlLabel
                  value="success"
                  control={<Radio color="success" />}
                  label="Success"
                />
                <FormControlLabel
                  value="default"
                  control={<Radio color="default" />}
                  label="Default"
                />
              </RadioGroup>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Validation Pattern
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Error state pattern when no option is selected or a wrong choice
                is submitted.
              </Typography>

              <FormControl error={quizError}>
                <FormLabel id="kitchen-radio-quiz-label">
                  Pop quiz: MUI is...
                </FormLabel>
                <RadioGroup
                  aria-labelledby="kitchen-radio-quiz-label"
                  name="kitchen-radio-quiz"
                  value={quizValue}
                  onChange={handleQuizChange}
                >
                  <FormControlLabel
                    value="best"
                    control={<Radio />}
                    label="The best"
                  />
                  <FormControlLabel
                    value="worst"
                    control={<Radio />}
                    label="The worst"
                  />
                </RadioGroup>
                <FormHelperText>{quizHelperText}</FormHelperText>
              </FormControl>

              <Box sx={{ mt: 1.5 }}>
                <Link
                  component="button"
                  type="button"
                  underline="hover"
                  onClick={handleQuizSubmit}
                  sx={{ typography: "body2" }}
                >
                  Check answer
                </Link>
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
});

RadioButtonsSection.displayName = "RadioButtonsSection";
