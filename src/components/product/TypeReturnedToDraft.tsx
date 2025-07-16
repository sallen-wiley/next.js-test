import React from "react";
import MuiAlert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function TypeReturnedToDraft() {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <MuiAlert severity="warning" variant="standard">
        Returned to draft
      </MuiAlert>
    </Stack>
  );
}
