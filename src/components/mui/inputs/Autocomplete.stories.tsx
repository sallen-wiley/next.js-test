import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import top100Films from "./top100Films";
import Box from "@mui/material/Box";
import countries, { CountryType } from "./countries";
import Image from "next/image";
import CircularProgress from "@mui/material/CircularProgress";

const meta: Meta<typeof Autocomplete> = {
  title: "MUI Components/Inputs/Autocomplete",
  component: Autocomplete,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "MUI Autocomplete component using the top 100 films dataset.",
      },
    },
  },
  argTypes: {
    sx: { control: "object" },
    disabled: { control: "boolean" },
    autoHighlight: { control: "boolean" },
    // @ts-expect-error: helperText is not a valid prop for Autocomplete, but used in stories
    helperText: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

export const ComboBox: Story = {
  args: {
    sx: { width: 300 },
    disabled: false,
    // @ts-expect-error: helperText is not a valid prop for Autocomplete, but used in stories
    helperText: "Pick your favorite movie",
  },
  render: (args) => (
    <Autocomplete
      disablePortal
      options={top100Films}
      sx={args.sx}
      disabled={args.disabled}
      renderInput={(params: AutocompleteRenderInputParams) => (
        // @ts-expect-error: helperText is not a valid prop for Autocomplete, but used in stories
        <TextField {...params} label="Movie" helperText={args.helperText} />
      )}
      getOptionLabel={(option) => option.label}
    />
  ),
};

export const CountrySelect: Story = {
  args: {
    sx: { width: 300 },
    disabled: false,
    autoHighlight: true,
    // @ts-expect-error: helperText is not a valid prop for Autocomplete, but used in stories
    helperText: "Select a country from the list",
  },
  render: (args) => (
    <Autocomplete
      id="country-select-demo"
      sx={args.sx}
      options={countries}
      disabled={args.disabled}
      autoHighlight={args.autoHighlight}
      getOptionLabel={(option: CountryType) => option.label}
      renderOption={(
        props: React.HTMLAttributes<HTMLLIElement>,
        option: CountryType
      ) => (
        <Box
          component="li"
          {...props}
          sx={{
            ...props.style,
            "& > span": { mr: 2, flexShrink: 0 },
            fontFamily: "Open Sans, var(--font-open-sans), Arial, sans-serif",
            fontSize: "1rem",
            fontWeight: 400,
            lineHeight: 1.5,
            color: "inherit",
          }}
        >
          <span>
            <Image
              loading="lazy"
              width={20}
              height={14}
              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
              alt=""
              style={{ display: "inline-block", verticalAlign: "middle" }}
            />
          </span>
          {option.label} ({option.code}) +{option.phone}
        </Box>
      )}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          label="Choose a country"
          // @ts-expect-error: helperText is not a valid prop for Autocomplete, but used in stories
          helperText={args.helperText}
          slotProps={{
            htmlInput: {
              ...params.inputProps,
              autoComplete: "new-password",
            },
          }}
        />
      )}
    />
  ),
};

// Move type above usage
type GroupedFilmOption = {
  label: string;
  year: number;
  firstLetter: string;
};

// Compute grouped and sorted options outside of args for Storybook compatibility
const groupedFilmOptions: GroupedFilmOption[] = (
  Array.isArray(top100Films) ? top100Films : []
)
  .filter((option) => option && typeof option.label === "string")
  .map((option) => {
    const firstLetter = option.label[0]?.toUpperCase() || "";
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...option,
    };
  })
  .sort((a, b) => {
    if (a.firstLetter === "0-9" && b.firstLetter !== "0-9") return -1;
    if (a.firstLetter !== "0-9" && b.firstLetter === "0-9") return 1;
    return a.firstLetter.localeCompare(b.firstLetter);
  });

export const Grouped: Story = {
  args: {
    sx: { width: 300 },
    // @ts-expect-error: helperText is not a valid prop for Autocomplete, but used in stories
    helperText: "Grouped by first letter",
  },
  render: (args) => (
    <Autocomplete
      sx={args.sx}
      options={groupedFilmOptions}
      groupBy={(option: GroupedFilmOption) => option.firstLetter || ""}
      getOptionLabel={(option: GroupedFilmOption) => option.label}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          label="With categories"
          // @ts-expect-error: helperText is not a valid prop for Autocomplete, but used in stories
          helperText={args.helperText}
        />
      )}
    />
  ),
};

// One time slot every 30 minutes.
const timeSlots = Array.from(new Array(24 * 2)).map(
  (_, index) =>
    `${index < 20 ? "0" : ""}${Math.floor(index / 2)}:${
      index % 2 === 0 ? "00" : "30"
    }`
);

export const DisabledOptions: Story = {
  args: {
    sx: { width: 300 },
    // @ts-expect-error: helperText is not a valid prop for Autocomplete, but used in stories
    helperText: "Some options are disabled",
  },
  render: (args) => (
    <Autocomplete
      options={timeSlots}
      sx={args.sx}
      getOptionDisabled={(option: string) =>
        option === timeSlots[0] || option === timeSlots[2]
      }
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          label="Disabled options"
          // @ts-expect-error: helperText is not a valid prop for Autocomplete, but used in stories
          helperText={args.helperText}
        />
      )}
    />
  ),
};

// Simulated async search as you type
const asyncFilms = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  { title: "The Lord of the Rings: The Return of the King", year: 2003 },
  { title: "The Good, the Bad and the Ugly", year: 1966 },
  { title: "Fight Club", year: 1999 },
  { title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001 },
  { title: "Star Wars: Episode V - The Empire Strikes Back", year: 1980 },
  { title: "Forrest Gump", year: 1994 },
  { title: "Inception", year: 2010 },
  { title: "The Lord of the Rings: The Two Towers", year: 2002 },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: "Goodfellas", year: 1990 },
  { title: "The Matrix", year: 1999 },
  { title: "Seven Samurai", year: 1954 },
  { title: "Star Wars: Episode IV - A New Hope", year: 1977 },
  { title: "City of God", year: 2002 },
  { title: "Se7en", year: 1995 },
  { title: "The Silence of the Lambs", year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: "Life Is Beautiful", year: 1997 },
  { title: "The Usual Suspects", year: 1995 },
  { title: "Léon: The Professional", year: 1994 },
  { title: "Spirited Away", year: 2001 },
  { title: "Saving Private Ryan", year: 1998 },
  { title: "Once Upon a Time in the West", year: 1968 },
  { title: "American History X", year: 1998 },
  { title: "Interstellar", year: 2014 },
];

function sleep(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export const SearchAsYouType: Story = {
  args: {
    sx: { width: 300 },
    disabled: false,
    // @ts-expect-error: helperText is not a valid prop for Autocomplete, but used in stories
    helperText: "Type to search for a film",
  },
  render: (args) => {
    const [inputValue, setInputValue] = React.useState("");
    const [options, setOptions] = React.useState<typeof asyncFilms>([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
      let active = true;
      if (inputValue === "") {
        setOptions([]);
        return undefined;
      }
      setLoading(true);
      (async () => {
        await sleep(3000); // Simulate network delay
        if (active) {
          setOptions(
            asyncFilms.filter((film) =>
              film.title.toLowerCase().includes(inputValue.toLowerCase())
            )
          );
          setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [inputValue]);

    return (
      <Autocomplete
        sx={args.sx}
        disabled={args.disabled}
        filterOptions={(x) => x} // disable built-in filtering
        options={options}
        loading={loading}
        inputValue={inputValue}
        noOptionsText="No options. Try typing."
        onInputChange={(_, value) => setInputValue(value)}
        getOptionLabel={(option) => option.title}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search as you type"
            // @ts-expect-error: helperText is not a valid prop for Autocomplete, but used in stories
            helperText={args.helperText}
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
    );
  },
};

export const LimitTags: Story = {
  args: {
    sx: { width: 500 },
    // @ts-expect-error: helperText is not a valid prop for Autocomplete, but used in stories
    helperText: "Select multiple favorites (max 2 tags shown)",
  },
  render: (args) => (
    <Autocomplete
      multiple
      limitTags={2}
      id="multiple-limit-tags"
      options={top100Films}
      getOptionLabel={(option) => option.label}
      defaultValue={[top100Films[13], top100Films[12], top100Films[11]]}
      renderInput={(params) => (
        <TextField
          {...params}
          label="limitTags"
          placeholder="Favorites"
          // @ts-expect-error: helperText is not a valid prop for Autocomplete, but used in stories
          helperText={args.helperText}
        />
      )}
      sx={args.sx}
    />
  ),
};
