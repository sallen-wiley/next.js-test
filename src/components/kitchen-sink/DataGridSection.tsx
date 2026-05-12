"use client";
import React from "react";
import { Box, Grid, Link, Paper, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";

type ReviewerRow = {
  id: number;
  firstName: string;
  lastName: string;
  expertise: string;
  status: "available" | "busy" | "unavailable";
  matchScore: number;
  invitations: number;
};

const rows: ReviewerRow[] = [
  {
    id: 1,
    firstName: "Ava",
    lastName: "Martinez",
    expertise: "Immunology",
    status: "available",
    matchScore: 96,
    invitations: 2,
  },
  {
    id: 2,
    firstName: "Noah",
    lastName: "Singh",
    expertise: "Genomics",
    status: "busy",
    matchScore: 91,
    invitations: 4,
  },
  {
    id: 3,
    firstName: "Mia",
    lastName: "Chen",
    expertise: "Bioinformatics",
    status: "available",
    matchScore: 89,
    invitations: 1,
  },
  {
    id: 4,
    firstName: "Liam",
    lastName: "Davis",
    expertise: "Neuroscience",
    status: "unavailable",
    matchScore: 84,
    invitations: 5,
  },
  {
    id: 5,
    firstName: "Sophia",
    lastName: "Kim",
    expertise: "Oncology",
    status: "available",
    matchScore: 93,
    invitations: 3,
  },
  {
    id: 6,
    firstName: "Ethan",
    lastName: "Patel",
    expertise: "Cardiology",
    status: "busy",
    matchScore: 87,
    invitations: 3,
  },
  {
    id: 7,
    firstName: "Olivia",
    lastName: "Garcia",
    expertise: "Epidemiology",
    status: "available",
    matchScore: 90,
    invitations: 2,
  },
  {
    id: 8,
    firstName: "Mason",
    lastName: "Taylor",
    expertise: "Machine Learning",
    status: "available",
    matchScore: 88,
    invitations: 1,
  },
];

const columns: GridColDef<ReviewerRow>[] = [
  { field: "id", headerName: "ID", width: 80 },
  {
    field: "firstName",
    headerName: "First name",
    minWidth: 120,
    flex: 1,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    minWidth: 120,
    flex: 1,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "Full name",
    minWidth: 160,
    flex: 1,
    sortable: false,
    valueGetter: (_value, row) =>
      `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim(),
  },
  {
    field: "expertise",
    headerName: "Expertise",
    minWidth: 160,
    flex: 1,
  },
  {
    field: "matchScore",
    headerName: "Match",
    type: "number",
    width: 110,
    valueFormatter: (value?: number) =>
      value === undefined ? "" : `${value}%`,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    type: "singleSelect",
    valueOptions: ["available", "busy", "unavailable"],
    editable: true,
  },
  {
    field: "invitations",
    headerName: "Invites",
    type: "number",
    width: 100,
  },
];

export const DataGridSection = React.memo(() => {
  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({ page: 0, pageSize: 5 });

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Data Grid
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Community (MIT) Data Grid demo using free features only: sorting,
          pagination, quick filter toolbar, checkbox selection, and inline cell
          editing.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/x/react-data-grid/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI X Data Grid docs
          </Link>
          .
        </Typography>
      </Stack>

      <Paper sx={{ p: 2 }}>
        <Box sx={{ height: 430, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              sorting: {
                sortModel: [{ field: "matchScore", sort: "desc" }],
              },
              filter: {
                filterModel: {
                  items: [],
                  quickFilterValues: ["available"],
                },
              },
            }}
            checkboxSelection
            disableRowSelectionOnClick
            showToolbar
          />
        </Box>
      </Paper>
    </Grid>
  );
});

DataGridSection.displayName = "DataGridSection";
