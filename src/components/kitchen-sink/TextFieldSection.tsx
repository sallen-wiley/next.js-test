"use client";
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Box,
  Grid,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export const TextFieldSection = React.memo(() => {
  const [controlledName, setControlledName] = React.useState("Cat in the Hat");
  const [multilineValue, setMultilineValue] = React.useState("");
  const [numberValue, setNumberValue] = React.useState("");
  const [dateValue, setDateValue] = React.useState("");

  const handleControlledNameChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setControlledName(event.target.value);
    },
    [],
  );

  const handleMultilineChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setMultilineValue(event.target.value);
    },
    [],
  );

  const handleNumberChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNumberValue(event.target.value);
    },
    [],
  );

  const handleDateChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDateValue(event.target.value);
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
        Text Field
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based text field patterns for common form behaviors, validation,
          multiline input, and adornments.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-text-field/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Text Field docs
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
                  Basic + Size
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField label="Outlined (Default)" fullWidth />
                  <TextField label="Outlined (Small)" size="small" fullWidth />
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Form Props
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    required
                    label="Required"
                    defaultValue="Hello World"
                    helperText="Required field"
                    fullWidth
                  />
                  <TextField
                    disabled
                    label="Disabled"
                    defaultValue="Hello World"
                    fullWidth
                  />
                  <TextField
                    label="Read only"
                    defaultValue="Hello World"
                    slotProps={{ input: { readOnly: true } }}
                    fullWidth
                  />
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Controlled + Uncontrolled
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="Controlled"
                    value={controlledName}
                    onChange={handleControlledNameChange}
                    fullWidth
                  />
                  <TextField
                    label="Uncontrolled"
                    defaultValue="foo"
                    fullWidth
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
                Validation + Adornments
              </Typography>

              <Stack spacing={2}>
                <TextField
                  error
                  label="Error"
                  defaultValue="Hello World"
                  helperText="Incorrect entry."
                  fullWidth
                />
                <TextField
                  label="Weight"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">kg</InputAdornment>
                      ),
                    },
                  }}
                  fullWidth
                />
                <TextField
                  label="With icon"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircleIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                  fullWidth
                />
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Multiline + Input Types
              </Typography>

              <Stack spacing={2}>
                <TextField
                  label="Multiline"
                  multiline
                  maxRows={4}
                  placeholder="Type multiple lines here..."
                  value={multilineValue}
                  onChange={handleMultilineChange}
                  fullWidth
                />
                <TextField
                  label="Number"
                  type="number"
                  value={numberValue}
                  onChange={handleNumberChange}
                  fullWidth
                />
                <TextField
                  label="Date"
                  type="date"
                  value={dateValue}
                  onChange={handleDateChange}
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                />
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
});

TextFieldSection.displayName = "TextFieldSection";
