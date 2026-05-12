"use client";
import React from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Link,
  ListSubheader,
  MenuItem,
  NativeSelect,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";

const people = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const menuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const SelectSection = React.memo(() => {
  const [age, setAge] = React.useState("");
  const [nativeAge, setNativeAge] = React.useState(30);
  const [personName, setPersonName] = React.useState<string[]>([]);
  const [groupValue, setGroupValue] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);

  const handleAgeChange = React.useCallback((event: SelectChangeEvent) => {
    setAge(event.target.value);
  }, []);

  const handleNativeAgeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setNativeAge(Number(event.target.value));
    },
    [],
  );

  const handleMultipleChange = React.useCallback(
    (event: SelectChangeEvent<typeof personName>) => {
      const {
        target: { value },
      } = event;

      setPersonName(typeof value === "string" ? value.split(",") : value);
    },
    [],
  );

  const handleGroupChange = React.useCallback((event: SelectChangeEvent) => {
    setGroupValue(event.target.value);
  }, []);

  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpen = React.useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Select
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based select patterns for labeled menus, native mobile-friendly
          selects, and multi-select behavior.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-select/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Select docs
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
                  Outlined Selects
                </Typography>

                <Stack
                  direction="row"
                  spacing={2}
                  flexWrap="wrap"
                  sx={{ gap: 2 }}
                >
                  <FormControl sx={{ minWidth: 160 }}>
                    <InputLabel id="kitchen-select-outlined-label">
                      Age
                    </InputLabel>
                    <Select
                      labelId="kitchen-select-outlined-label"
                      id="kitchen-select-outlined"
                      value={age}
                      label="Age"
                      onChange={handleAgeChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                    <FormHelperText>Outlined</FormHelperText>
                  </FormControl>

                  <FormControl sx={{ minWidth: 160 }} size="small">
                    <InputLabel id="kitchen-select-outlined-small-label">
                      Age
                    </InputLabel>
                    <Select
                      labelId="kitchen-select-outlined-small-label"
                      id="kitchen-select-outlined-small"
                      value={age}
                      label="Age"
                      onChange={handleAgeChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                    <FormHelperText>Outlined small</FormHelperText>
                  </FormControl>
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Native Select
                </Typography>

                <FormControl sx={{ minWidth: 220 }}>
                  <InputLabel htmlFor="kitchen-native-select">Age</InputLabel>
                  <NativeSelect
                    value={nativeAge}
                    onChange={handleNativeAgeChange}
                    input={
                      <OutlinedInput label="Age" id="kitchen-native-select" />
                    }
                    inputProps={{
                      name: "age",
                    }}
                  >
                    <option value={10}>Ten</option>
                    <option value={20}>Twenty</option>
                    <option value={30}>Thirty</option>
                  </NativeSelect>
                </FormControl>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Grouped Options
                </Typography>

                <FormControl sx={{ minWidth: 220 }}>
                  <InputLabel id="kitchen-grouped-select-label">
                    Grouping
                  </InputLabel>
                  <Select
                    labelId="kitchen-grouped-select-label"
                    id="kitchen-grouped-select"
                    value={groupValue}
                    label="Grouping"
                    onChange={handleGroupChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <ListSubheader>Category 1</ListSubheader>
                    <MenuItem value="option-1">Option 1</MenuItem>
                    <MenuItem value="option-2">Option 2</MenuItem>
                    <ListSubheader>Category 2</ListSubheader>
                    <MenuItem value="option-3">Option 3</MenuItem>
                    <MenuItem value="option-4">Option 4</MenuItem>
                  </Select>
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
                Multiple Select
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Uses the docs pattern with chips rendered from selected values.
              </Typography>

              <FormControl sx={{ width: "100%", maxWidth: 360 }}>
                <InputLabel id="kitchen-select-multiple-label">
                  People
                </InputLabel>
                <Select
                  labelId="kitchen-select-multiple-label"
                  id="kitchen-select-multiple"
                  multiple
                  value={personName}
                  onChange={handleMultipleChange}
                  input={
                    <OutlinedInput
                      id="kitchen-select-multiple-input"
                      label="People"
                    />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  MenuProps={menuProps}
                >
                  {people.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Controlled Open State
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Explicitly controls open and close behavior with the `open`
                prop.
              </Typography>

              <Stack spacing={1.5}>
                <Button
                  variant="outlined"
                  onClick={handleOpen}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Open select
                </Button>

                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel id="kitchen-controlled-open-label">
                    Age
                  </InputLabel>
                  <Select
                    labelId="kitchen-controlled-open-label"
                    id="kitchen-controlled-open"
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={age}
                    label="Age"
                    onChange={handleAgeChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
});

SelectSection.displayName = "SelectSection";
