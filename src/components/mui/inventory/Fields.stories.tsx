import React from "react";
import { TextField, Typography, Box } from "@mui/material";

export default {
  title: "Inventory/Fields",
};

const fieldAssumptions = (
  <Box sx={{ mt: 4 }}>
    <Typography variant="h6" gutterBottom>
      Field Assumptions
    </Typography>
    <Typography variant="subtitle1" gutterBottom>
      Approved
    </Typography>
    <Typography variant="body2" component="div">
      <ol>
        <li>Fields can have from 0 to many badges (icons) on the top line</li>
        <li>Field icons are cosmetic, affordance-only, not interactive</li>
        <li>
          Icons themselves should signal field criteria, with popover info if
          hover
        </li>
        <li>All fields should have object titles</li>
        <li>
          Only use placeholders for examples (dates, emails, DOI) or delayed
          interaction (after typing threshold)
        </li>
        <li>
          Placeholders should look different from user text (italic, less
          contrast)
        </li>
        <li>List fields should also have object titles</li>
      </ol>
    </Typography>
    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
      To review
    </Typography>
    <Typography variant="body2" component="div">
      <ol>
        <li>
          Hybrid mode policy: non-MUI products install MUI silently, and “flip”
          components to MUI version as they touch code
        </li>
        <li>
          Do MUI field titles pass screenreader accessibility rules?
          (Accessibility check needed)
        </li>
        <li>Discuss pass/fail badge (inline validation, min-max)</li>
        <li>Discuss info/alert icon mismatch</li>
        <li>
          Discuss hit targets and popover on tap, in touch screens (WCAG 2.5.5
          for Better Target Sizes)
        </li>
        <li>Placeholders and screen reader accessibility</li>
      </ol>
    </Typography>
  </Box>
);

export const SimpleField = () => (
  <Box>
    <TextField fullWidth label="Input Field" variant="outlined" />
    {fieldAssumptions}
  </Box>
);
