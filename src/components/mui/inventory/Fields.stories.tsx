import React, { useState } from "react";
import { TextField, Typography, Box, Popover } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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

export const SimpleField = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  return (
    <Box>
      {fieldAssumptions}
      <br />
      <IconButton
        aria-label="info"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        style={{
          color: "#1976d2",
          background: "#f5f5f5",
          borderRadius: 8,
          marginBottom: 8,
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
      >
        <InfoOutlinedIcon style={{ fontSize: 28 }} />
      </IconButton>
      <Popover
        id="info-icon-popover"
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <div style={{ padding: 16, minWidth: 180 }}>
          Informações adicionais aqui.
        </div>
      </Popover>
      <TextField fullWidth label="Input Field" variant="outlined" />
    </Box>
  );
};

export const InfoIconPopover = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div style={{ padding: 40 }}>
      <IconButton
        aria-label="info"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        style={{ color: "#1976d2", background: "#f5f5f5", borderRadius: 8 }}
      >
        <InfoOutlinedIcon />
      </IconButton>
      <Popover
        id="info-icon-popover"
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <div style={{ padding: 16, minWidth: 180 }}>
          Informações adicionais aqui.
        </div>
      </Popover>
    </div>
  );
};
