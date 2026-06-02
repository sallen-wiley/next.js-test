"use client";

import * as React from "react";
import { useHeaderConfig } from "@/contexts/HeaderContext";
import { usePageTheme } from "@/hooks/usePageTheme";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import type { ChipProps } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";

type QueueStatus = "inProgress" | "new" | "overdue";

type WorkQueueRow = {
  id: number;
  articleId: string;
  journalDiscipline: string;
  dueDays: number;
  status: QueueStatus;
  actionLabel: "Continue" | "Start";
};

const workQueueRows: WorkQueueRow[] = [
  {
    id: 1,
    articleId: "2026-87-32A",
    journalDiscipline: "J.Biol .Chem. /Biomedicine",
    dueDays: 3,
    status: "inProgress",
    actionLabel: "Continue",
  },
  {
    id: 2,
    articleId: "2026-87-32A",
    journalDiscipline: "J.Biol .Chem. /Biomedicine",
    dueDays: 3,
    status: "new",
    actionLabel: "Start",
  },
  {
    id: 3,
    articleId: "2026-87-32A",
    journalDiscipline: "J.Biol .Chem. /Biomedicine",
    dueDays: 3,
    status: "new",
    actionLabel: "Start",
  },
  {
    id: 4,
    articleId: "2026-87-32A",
    journalDiscipline: "J.Biol .Chem. /Biomedicine",
    dueDays: 3,
    status: "new",
    actionLabel: "Start",
  },
  {
    id: 5,
    articleId: "2026-87-32A",
    journalDiscipline: "J.Biol .Chem. /Biomedicine",
    dueDays: 3,
    status: "new",
    actionLabel: "Start",
  },
  {
    id: 6,
    articleId: "2026-87-32A",
    journalDiscipline: "J.Biol .Chem. /Biomedicine",
    dueDays: 3,
    status: "new",
    actionLabel: "Start",
  },
  {
    id: 7,
    articleId: "2026-87-32A",
    journalDiscipline: "J.Biol .Chem. /Biomedicine",
    dueDays: 1,
    status: "new",
    actionLabel: "Start",
  },
  {
    id: 8,
    articleId: "2026-87-32A",
    journalDiscipline: "J.Biol .Chem. /Biomedicine",
    dueDays: 1,
    status: "new",
    actionLabel: "Start",
  },
  {
    id: 9,
    articleId: "2026-87-32A",
    journalDiscipline: "J.Biol .Chem. /Biomedicine",
    dueDays: 0,
    status: "overdue",
    actionLabel: "Start",
  },
  {
    id: 10,
    articleId: "2026-87-32A",
    journalDiscipline: "J.Biol .Chem. /Biomedicine",
    dueDays: 0,
    status: "overdue",
    actionLabel: "Start",
  },
];

function getDueChipProps(dueDays: number): {
  label: string;
  color: ChipProps["color"];
} {
  if (dueDays <= 0) {
    return { label: "0 Day", color: "error" };
  }

  if (dueDays === 1) {
    return { label: "1 Day", color: "warning" };
  }

  return { label: `${dueDays} Days`, color: "info" };
}

function getStatusChipProps(status: QueueStatus): {
  label: string;
  color: ChipProps["color"];
} {
  switch (status) {
    case "inProgress":
      return { label: "In progress", color: "warning" };
    case "overdue":
      return { label: "Overdue", color: "error" };
    case "new":
    default:
      return { label: "New", color: "primary" };
  }
}

export default function WileyCopyEditorPage() {
  const [workQueueTab, setWorkQueueTab] = React.useState(0);
  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({ page: 0, pageSize: 10 });

  const navLinks = React.useMemo(
    () => [
      {
        label: "Dashboard",
        href: "#dashboard",
        icon: <DashboardOutlinedIcon fontSize="small" />,
        active: false,
      },
      {
        label: "My Articles",
        href: "#my-articles",
        icon: <DescriptionOutlinedIcon fontSize="small" />,
        active: true,
      },
      {
        label: "History",
        href: "#history",
        icon: <HistoryOutlinedIcon fontSize="small" />,
        active: false,
      },
    ],
    [],
  );

  useHeaderConfig({ hideHeader: true });
  usePageTheme("researchexchange", { mode: "light" });

  const slaBreachedCount = React.useMemo(
    () => workQueueRows.filter((row) => row.status === "overdue").length,
    [],
  );

  const visibleRows = React.useMemo(() => {
    if (workQueueTab === 1) {
      return workQueueRows.filter((row) => row.status === "overdue");
    }

    return workQueueRows;
  }, [workQueueTab]);

  const columns = React.useMemo<GridColDef<WorkQueueRow>[]>(
    () => [
      {
        field: "articleId",
        headerName: "Article ID",
        minWidth: 150,
        flex: 0.9,
      },
      {
        field: "journalDiscipline",
        headerName: "Journal / Discipline",
        minWidth: 260,
        flex: 1.6,
      },
      {
        field: "dueDays",
        headerName: "Due In",
        minWidth: 160,
        flex: 0.9,
        type: "number",
        renderCell: (params) => {
          const dueChip = getDueChipProps(params.row.dueDays);

          return (
            <Chip
              size="small"
              color={dueChip.color}
              variant="outlined"
              icon={<AccessTimeRoundedIcon fontSize="small" />}
              label={dueChip.label}
            />
          );
        },
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 150,
        flex: 0.8,
        renderCell: (params) => {
          const statusChip = getStatusChipProps(params.row.status);

          return (
            <Chip
              size="small"
              color={statusChip.color}
              variant="outlined"
              label={statusChip.label}
            />
          );
        },
      },
      {
        field: "actionLabel",
        headerName: "Action",
        minWidth: 140,
        flex: 0.8,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Button size="small" variant="outlined">
            {params.row.actionLabel}
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <Box>
      <AppBar position="static" color="primary">
        <Container maxWidth={false}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ minHeight: 64 }}
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6" component="p">
                WILEY
              </Typography>

              <List
                component="nav"
                aria-label="Copyeditor navigation"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  p: 0,
                  m: 0,
                  gap: 0.5,
                }}
              >
                {navLinks.map((link) => (
                  <ListItem
                    key={link.label}
                    disablePadding
                    sx={{ width: "auto" }}
                  >
                    <ListItemButton
                      component="a"
                      href={link.href}
                      selected={link.active}
                      sx={{
                        px: 1.5,
                        py: 1,
                        borderRadius: 1,
                        color: "inherit",
                        "& .MuiListItemIcon-root": {
                          minWidth: 24,
                          color: "inherit",
                        },
                        "& .MuiListItemText-primary": {
                          typography: "body2",
                        },
                        "&.Mui-selected": {
                          bgcolor: "rgba(255, 255, 255, 0.16)",
                        },
                        "&.Mui-selected:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.24)",
                        },
                      }}
                    >
                      <ListItemIcon>{link.icon}</ListItemIcon>
                      <ListItemText primary={link.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={3}>
              <Badge badgeContent={2} color="error">
                <NotificationsNoneOutlinedIcon />
              </Badge>
              <Avatar sx={{ width: 32, height: 32 }}>WC</Avatar>
            </Stack>
          </Stack>
        </Container>
      </AppBar>

      <Container maxWidth={false} sx={{ py: 3 }}>
        <Stack spacing={0}>
          <Tabs
            value={workQueueTab}
            onChange={(_event, value) => setWorkQueueTab(value)}
            aria-label="Work queue filters"
          >
            <Tab label="All Active" />
            <Tab
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography component="span" variant="inherit">
                    SLA Breached
                  </Typography>
                  <Chip size="small" color="error" label={slaBreachedCount} />
                </Stack>
              }
            />
          </Tabs>

          <Paper>
            <Typography variant="h6" component="h1" sx={{ px: 1, py: 3 }}>
              All Article Work Queue
            </Typography>

            <Box sx={{ width: "100%" }}>
              <DataGrid
                rows={visibleRows}
                columns={columns}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10, 25]}
                autoHeight
                slotProps={{
                  toolbar: {
                    csvOptions: { disableToolbarButton: true },
                    printOptions: { disableToolbarButton: true },
                  },
                }}
                initialState={{
                  sorting: {
                    sortModel: [{ field: "dueDays", sort: "asc" }],
                  },
                }}
                disableRowSelectionOnClick
                showToolbar
              />
            </Box>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
