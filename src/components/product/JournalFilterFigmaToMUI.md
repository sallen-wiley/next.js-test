# Figma Node to MUI Component Mapping for Journal Filter Component

- **.State=Journal filter open, Breakpoint=lg**
  - MUI: (none, use `Box`/`div` for layout if needed)
  - **left**
    - MUI: (none, use `Box`/`div` for layout if needed)
    - **<Autocomplete> (search input)**
      - MUI: `Autocomplete` (from `@mui/material/Autocomplete`)
      - **Label**
        - MUI: `InputLabel`
      - **Search Icon**
        - MUI: `InputAdornment` with `SearchIcon`
    - **<Select> (filter dropdown)**
      - MUI: `Select` (from `@mui/material/Select`)
      - **Label**
        - MUI: `InputLabel`
      - **Menu Items**
        - MUI: `MenuItem`
    - **Icon (left of select)**
      - MUI: `SvgIcon` or a custom icon component
  - **<Typography> (article count summary)**
    - MUI: `Typography` (`variant="body1"`)

---

This mapping pairs each Figma layer element with its closest MUI component, distinguishing between the Autocomplete (search) and Select (filter) elements as separate UI features.
