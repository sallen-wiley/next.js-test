import React from "react";
import MuiAlert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

export default function ReturnedToDraftAlert() {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <MuiAlert
        severity="warning"
        variant="standard"
        icon={<WarningAmberOutlinedIcon fontSize="inherit" />}
      >
        Returned to draft
      </MuiAlert>
    </Stack>
  );
}
