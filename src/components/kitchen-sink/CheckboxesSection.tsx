"use client";
import React from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

const checkboxLabel = { inputProps: { "aria-label": "Checkbox demo" } };

export const CheckboxesSection = React.memo(() => {
  const [checked, setChecked] = React.useState<[boolean, boolean]>([
    true,
    false,
  ]);

  const handleParentChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked([event.target.checked, event.target.checked]);
    },
    [],
  );

  const handleFirstChildChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked([event.target.checked, checked[1]]);
    },
    [checked],
  );

  const handleSecondChildChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked([checked[0], event.target.checked]);
    },
    [checked],
  );

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Checkboxes
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based examples for selecting one or more items from a set.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-checkbox/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Checkbox docs
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
              Core Examples
            </Typography>

            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Basic + Label
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox {...checkboxLabel} defaultChecked />}
                    label="Checked by default"
                  />
                  <FormControlLabel
                    control={<Checkbox {...checkboxLabel} />}
                    label="Unchecked"
                  />
                  <FormControlLabel
                    disabled
                    control={<Checkbox {...checkboxLabel} />}
                    label="Disabled"
                  />
                  <FormControlLabel
                    required
                    control={<Checkbox {...checkboxLabel} />}
                    label="Required"
                  />
                </FormGroup>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Size + Color
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ minWidth: 48, typography: "mono" as const }}
                    >
                      Size
                    </Typography>
                    <Checkbox {...checkboxLabel} defaultChecked size="small" />
                    <Checkbox {...checkboxLabel} defaultChecked size="medium" />
                    <Checkbox
                      {...checkboxLabel}
                      defaultChecked
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                    sx={{ gap: 1 }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ minWidth: 48, typography: "mono" as const }}
                    >
                      Color
                    </Typography>
                    <Checkbox
                      {...checkboxLabel}
                      defaultChecked
                      color="primary"
                    />
                    <Checkbox
                      {...checkboxLabel}
                      defaultChecked
                      color="secondary"
                    />
                    <Checkbox
                      {...checkboxLabel}
                      defaultChecked
                      color="success"
                    />
                    <Checkbox
                      {...checkboxLabel}
                      defaultChecked
                      color="default"
                    />
                  </Stack>
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
                Indeterminate Pattern
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Parent-child selection with a visual indeterminate state.
              </Typography>

              <FormControlLabel
                label="Parent"
                control={
                  <Checkbox
                    checked={checked[0] && checked[1]}
                    indeterminate={checked[0] !== checked[1]}
                    onChange={handleParentChange}
                  />
                }
              />

              <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
                <FormControlLabel
                  label="Child 1"
                  control={
                    <Checkbox
                      checked={checked[0]}
                      onChange={handleFirstChildChange}
                    />
                  }
                />
                <FormControlLabel
                  label="Child 2"
                  control={
                    <Checkbox
                      checked={checked[1]}
                      onChange={handleSecondChildChange}
                    />
                  }
                />
              </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Label Placement
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                End and bottom placements from the docs pattern.
              </Typography>

              <FormControl component="fieldset">
                <FormLabel component="legend">Placement</FormLabel>
                <FormGroup row>
                  <FormControlLabel
                    value="end"
                    control={<Checkbox />}
                    label="End"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="bottom"
                    control={<Checkbox />}
                    label="Bottom"
                    labelPlacement="bottom"
                  />
                </FormGroup>
              </FormControl>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
});

CheckboxesSection.displayName = "CheckboxesSection";
