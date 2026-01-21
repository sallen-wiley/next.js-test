"use client";
import React from "react";
import { Paper, Typography, TextField, Stack, Grid } from "@mui/material";

export const InputsSection = React.memo(() => {
  const [formValues, setFormValues] = React.useState({
    standard: "",
    outlined: "",
    outlinedSmall: "",
    filled: "",
    multiline: "",
    number: "",
    numberSmall: "",
    date: "",
  });

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <Grid size={12}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Form Inputs
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Text Inputs
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Standard"
                variant="standard"
                fullWidth
                value={formValues.standard}
                onChange={handleChange("standard")}
              />
              <TextField
                label="Outlined (Default Size)"
                variant="outlined"
                fullWidth
                value={formValues.outlined}
                onChange={handleChange("outlined")}
              />
              <TextField
                label="Outlined (Small Size)"
                variant="outlined"
                size="small"
                fullWidth
                value={formValues.outlinedSmall}
                onChange={handleChange("outlinedSmall")}
              />
              <TextField
                label="Filled"
                variant="filled"
                fullWidth
                value={formValues.filled}
                onChange={handleChange("filled")}
              />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Special Inputs
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Multiline"
                multiline
                rows={3}
                fullWidth
                placeholder="Type multiple lines here..."
                value={formValues.multiline}
                onChange={handleChange("multiline")}
              />
              <TextField
                label="Number Input (Default)"
                type="number"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={formValues.number}
                onChange={handleChange("number")}
              />
              <TextField
                label="Number Input (Small)"
                type="number"
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={formValues.numberSmall}
                onChange={handleChange("numberSmall")}
              />
              <TextField
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={formValues.date}
                onChange={handleChange("date")}
              />
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
});

InputsSection.displayName = "InputsSection";
