"use client";
import React from "react";
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  Grid,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type FilmOption = {
  label: string;
  year: number;
};

type GroupedFilmOption = FilmOption & {
  firstLetter: string;
};

const filmOptions: readonly FilmOption[] = [
  { label: "The Shawshank Redemption", year: 1994 },
  { label: "The Godfather", year: 1972 },
  { label: "The Dark Knight", year: 2008 },
  { label: "12 Angry Men", year: 1957 },
  { label: "Pulp Fiction", year: 1994 },
  { label: "Inception", year: 2010 },
  { label: "Fight Club", year: 1999 },
  { label: "Goodfellas", year: 1990 },
  { label: "Interstellar", year: 2014 },
  { label: "Whiplash", year: 2014 },
  { label: "The Matrix", year: 1999 },
  { label: "The Prestige", year: 2006 },
];

const groupedFilmOptions: readonly GroupedFilmOption[] = [...filmOptions]
  .map((option) => {
    const firstLetter = option.label[0]?.toUpperCase() || "";

    return {
      ...option,
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
    };
  })
  .sort((a, b) => a.firstLetter.localeCompare(b.firstLetter));

const freeSoloOptions = filmOptions.map((option) => option.label);
const visibleChipLimit = 2;
const defaultFavoriteFilms = [
  filmOptions[1],
  filmOptions[4],
  filmOptions[9],
  filmOptions[5],
  filmOptions[8],
];

function sleep(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

export const AutocompleteSection = React.memo(() => {
  const [value, setValue] = React.useState<FilmOption | null>(filmOptions[0]);
  const [inputValue, setInputValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [asyncOptions, setAsyncOptions] = React.useState<readonly FilmOption[]>(
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (!open) {
      setAsyncOptions([]);
      return undefined;
    }

    (async () => {
      setLoading(true);
      await sleep(800);

      if (!active) {
        return;
      }

      setAsyncOptions(filmOptions);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [open]);

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Autocomplete
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based examples for common autocomplete input patterns.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-autocomplete/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Autocomplete docs
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
                  Combo Box
                </Typography>

                <Autocomplete
                  options={filmOptions}
                  value={value}
                  onChange={(_event, newValue) => {
                    setValue(newValue);
                  }}
                  inputValue={inputValue}
                  onInputChange={(_event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  isOptionEqualToValue={(option, optionValue) =>
                    option.label === optionValue.label
                  }
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField {...params} label="Movie" />
                  )}
                  sx={{ maxWidth: 360 }}
                />
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Free Solo
                </Typography>

                <Autocomplete
                  freeSolo
                  options={freeSoloOptions}
                  renderInput={(params) => (
                    <TextField {...params} label="Search input" />
                  )}
                  sx={{ maxWidth: 360 }}
                />
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Grouped Options
                </Typography>

                <Autocomplete
                  options={groupedFilmOptions}
                  groupBy={(option) => option.firstLetter}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField {...params} label="With categories" />
                  )}
                  sx={{ maxWidth: 360 }}
                />
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
                Multiple Values (Limited Chips)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Use multiple with limitTags={"{2}"} to show the first two
                selected chips and a +N count when the input is not focused.
              </Typography>

              <Autocomplete
                multiple
                limitTags={visibleChipLimit}
                options={filmOptions}
                getOptionLabel={(option) => option.label}
                defaultValue={defaultFavoriteFilms}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Favorites"
                    placeholder="Pick movies"
                    helperText="Focus to see all selected chips; click outside to collapse back to two. All selections are retained."
                  />
                )}
              />
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Multiple Values (Always Limited Chips)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Use renderValue to show only the first two selected chips and a
                +N count, even while the input is focused.
              </Typography>

              <Autocomplete
                multiple
                options={filmOptions}
                getOptionLabel={(option) => option.label}
                defaultValue={defaultFavoriteFilms}
                renderValue={(selected, getItemProps) => (
                  <>
                    {selected
                      .slice(0, visibleChipLimit)
                      .map((option, index) => {
                        const { key, ...itemProps } = getItemProps({ index });

                        return (
                          <Chip
                            key={key}
                            label={option.label}
                            {...itemProps}
                          />
                        );
                      })}
                    {selected.length > visibleChipLimit && (
                      <span
                        aria-label={`${selected.length - visibleChipLimit} more selected movies`}
                      >
                        +{selected.length - visibleChipLimit}
                      </span>
                    )}
                  </>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Favorites (always limited)"
                    placeholder="Pick movies"
                    helperText="Focus to compare: only two chips stay visible. All selections are retained; deselect hidden movies in the dropdown."
                  />
                )}
              />
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Async Load on Open
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Loads options only after interaction and shows a loading state.
              </Typography>

              <Autocomplete
                open={open}
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                options={asyncOptions}
                loading={loading}
                isOptionEqualToValue={(option, optionValue) =>
                  option.label === optionValue.label
                }
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Asynchronous"
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      },
                    }}
                  />
                )}
              />
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
});

AutocompleteSection.displayName = "AutocompleteSection";
