"use client";
import React from "react";
import {
  Paper,
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Switch,
  Slider,
  Stack,
  Box,
  Grid,
} from "@mui/material";

export const ControlsSection = React.memo(() => {
  const [checkboxStates, setCheckboxStates] = React.useState({
    primary: true,
    secondary: false,
    success: false,
    error: false,
    indeterminate: false,
  });

  const [radioValue, setRadioValue] = React.useState("primary");

  const [switchStates, setSwitchStates] = React.useState({
    switch1: true,
    switch2: false,
    switch3: true,
  });

  const [sliderValue, setSliderValue] = React.useState(30);
  const [rangeValue, setRangeValue] = React.useState<number[]>([20, 37]);

  return (
    <Grid size={12}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Selection Controls
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Checkboxes
            </Typography>
            <FormControl component="fieldset">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxStates.primary}
                      onChange={(e) =>
                        setCheckboxStates((prev) => ({
                          ...prev,
                          primary: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Primary"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color="secondary"
                      checked={checkboxStates.secondary}
                      onChange={(e) =>
                        setCheckboxStates((prev) => ({
                          ...prev,
                          secondary: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Secondary"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color="success"
                      checked={checkboxStates.success}
                      onChange={(e) =>
                        setCheckboxStates((prev) => ({
                          ...prev,
                          success: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Success"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color="error"
                      checked={checkboxStates.error}
                      onChange={(e) =>
                        setCheckboxStates((prev) => ({
                          ...prev,
                          error: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Error"
                />
                <FormControlLabel
                  control={<Checkbox disabled />}
                  label="Disabled"
                />
                <FormControlLabel
                  control={<Checkbox indeterminate />}
                  label="Indeterminate"
                />
              </FormGroup>
            </FormControl>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Radio Buttons
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={radioValue}
                onChange={(e) => setRadioValue(e.target.value)}
              >
                <FormControlLabel
                  value="primary"
                  control={<Radio />}
                  label="Primary"
                />
                <FormControlLabel
                  value="secondary"
                  control={<Radio color="secondary" />}
                  label="Secondary"
                />
                <FormControlLabel
                  value="error"
                  control={<Radio color="error" />}
                  label="Error"
                />
                <FormControlLabel
                  value="success"
                  control={<Radio color="success" />}
                  label="Success"
                />
                <FormControlLabel
                  value="disabled"
                  disabled
                  control={<Radio />}
                  label="Disabled"
                />
              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Switches & Sliders
            </Typography>
            <Stack spacing={3}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Switches</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={switchStates.switch1}
                        onChange={(e) =>
                          setSwitchStates((prev) => ({
                            ...prev,
                            switch1: e.target.checked,
                          }))
                        }
                      />
                    }
                    label="Primary"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={switchStates.switch2}
                        onChange={(e) =>
                          setSwitchStates((prev) => ({
                            ...prev,
                            switch2: e.target.checked,
                          }))
                        }
                        color="secondary"
                      />
                    }
                    label="Secondary"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={switchStates.switch3}
                        onChange={(e) =>
                          setSwitchStates((prev) => ({
                            ...prev,
                            switch3: e.target.checked,
                          }))
                        }
                        color="success"
                      />
                    }
                    label="Success"
                  />
                  <FormControlLabel
                    control={<Switch disabled />}
                    label="Disabled"
                  />
                </FormGroup>
              </FormControl>

              <Box>
                <Typography gutterBottom>Slider: {sliderValue}</Typography>
                <Slider
                  value={sliderValue}
                  onChange={(_, newValue) => setSliderValue(newValue as number)}
                  valueLabelDisplay="auto"
                  color="primary"
                />
              </Box>

              <Box>
                <Typography gutterBottom>
                  Range: {rangeValue.join(" - ")}
                </Typography>
                <Slider
                  value={rangeValue}
                  onChange={(_, newValue) =>
                    setRangeValue(newValue as number[])
                  }
                  valueLabelDisplay="auto"
                  color="secondary"
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
});

ControlsSection.displayName = "ControlsSection";
