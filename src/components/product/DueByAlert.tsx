import React from "react";
import MuiAlert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

export default function DueByAlert() {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <MuiAlert
        severity="info"
        variant="standard"
        icon={<AccessTimeOutlinedIcon fontSize="inherit" />}
      >
        Due by <b>DD Month YYYY</b> at <b>HH:MM GMT-4</b>
      </MuiAlert>
    </Stack>
  );
}
