"use client";
import * as React from "react";
import { useHeaderConfig } from "@/contexts/HeaderContext";
import { useAuth } from "@/components/auth/AuthProvider";
import { useUserProfile } from "@/hooks/useRoles";

// LogRocket type declaration
declare global {
  interface Window {
    LogRocket?: {
      identify: (
        userId: string,
        userTraits: Record<string, string | number | boolean>
      ) => void;
      init: (appId: string) => void;
    };
  }
}
import {
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Tooltip,
  Avatar,
  Alert,
  Tabs,
  Tab,
  Badge,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

// Icons
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import QueueIcon from "@mui/icons-material/Queue";
import FilterListIcon from "@mui/icons-material/FilterList";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import ScheduleIcon from "@mui/icons-material/Schedule";
import StarIcon from "@mui/icons-material/Star";

import {
  mockPotentialReviewers,
  mockReviewInvitations,
  mockInvitationQueue,
} from "@/services/dataService";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reviewer-tabpanel-${index}`}
      aria-labelledby={`reviewer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ReviewerInvitationDashboard() {
  // Authentication and user data
  const { user } = useAuth();
  const { profile } = useUserProfile();

  // LogRocket user identification
  React.useEffect(() => {
    if (user && profile && typeof window !== "undefined" && window.LogRocket) {
      window.LogRocket.identify(user.id, {
        name: profile.full_name || profile.email.split("@")[0],
        email: profile.email,
        role: profile.role,
        department: profile.department || "Unknown",
        isActive: profile.is_active,
        // Add custom variables for this dashboard context
        currentPage: "reviewer-dashboard",
        userAgent: navigator.userAgent,
        createdAt: profile.created_at,
        lastLogin: profile.last_login || "Never",
      });
    }
  }, [user, profile]);

  const [tabValue, setTabValue] = React.useState(0);
  const [sortBy, setSortBy] = React.useState<string>("match_score");
  const [filterAvailability, setFilterAvailability] = React.useState<string[]>([
    "available",
  ]);
  const [minMatchScore, setMinMatchScore] = React.useState<number>(70);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedReviewers, setSelectedReviewers] = React.useState<string[]>(
    []
  );

  // State for interactive features
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "info" | "warning" | "error"
  >("success");
  const [confirmDialog, setConfirmDialog] = React.useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [simulatedInvitations, setSimulatedInvitations] = React.useState(
    mockReviewInvitations
  );
  const [simulatedQueue, setSimulatedQueue] =
    React.useState(mockInvitationQueue);

  // Filter and sort reviewers
  const filteredReviewers = React.useMemo(() => {
    const filtered = mockPotentialReviewers.filter((reviewer) => {
      // Filter by availability
      if (
        filterAvailability.length > 0 &&
        !filterAvailability.includes(reviewer.availability_status)
      ) {
        return false;
      }

      // Filter by minimum match score
      if (reviewer.match_score < minMatchScore) {
        return false;
      }

      // Filter by search term
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          reviewer.name.toLowerCase().includes(search) ||
          reviewer.affiliation.toLowerCase().includes(search) ||
          reviewer.expertise_areas.some((area) =>
            area.toLowerCase().includes(search)
          )
        );
      }

      return true;
    });

    // Sort reviewers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "match_score":
          return b.match_score - a.match_score;
        case "response_rate":
          return b.response_rate - a.response_rate;
        case "quality_score":
          return b.quality_score - a.quality_score;
        case "current_load":
          return a.current_review_load - b.current_review_load;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [sortBy, filterAvailability, minMatchScore, searchTerm]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleReviewerSelect = (reviewerId: string) => {
    setSelectedReviewers((prev) =>
      prev.includes(reviewerId)
        ? prev.filter((id) => id !== reviewerId)
        : [...prev, reviewerId]
    );
  };

  // Interactive functions for demo purposes
  const showSnackbar = (
    message: string,
    severity: "success" | "info" | "warning" | "error" = "success"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const showConfirmDialog = (
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    setConfirmDialog({
      open: true,
      title,
      message,
      onConfirm,
    });
  };

  const handleInviteReviewer = (reviewerId: string) => {
    const reviewer = mockPotentialReviewers.find((r) => r.id === reviewerId);
    if (!reviewer) return;

    showConfirmDialog(
      "Send Invitation",
      `Send review invitation to ${reviewer.name} (${reviewer.affiliation})?`,
      () => {
        // Simulate sending invitation
        const newInvitation = {
          id: `inv-${Date.now()}`,
          manuscript_id: "ms-001",
          reviewer_id: reviewerId,
          invited_date: new Date().toISOString(),
          due_date: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(), // 30 days from now
          status: "pending" as const,
          invitation_round: 1,
          reminder_count: 0,
          notes: "Invitation sent via dashboard",
        };

        setSimulatedInvitations((prev) => [...prev, newInvitation]);
        setSelectedReviewers((prev) => prev.filter((id) => id !== reviewerId));
        showSnackbar(`Invitation sent to ${reviewer.name}`, "success");

        // Switch to invitations tab to show the result
        setTimeout(() => setTabValue(1), 1000);
      }
    );
  };

  const handleAddToQueue = (reviewerId: string) => {
    const reviewer = mockPotentialReviewers.find((r) => r.id === reviewerId);
    if (!reviewer) return;

    showConfirmDialog(
      "Add to Queue",
      `Add ${reviewer.name} to the invitation queue?`,
      () => {
        // Simulate adding to queue
        const newQueuePosition =
          Math.max(...simulatedQueue.map((q) => q.queue_position), 0) + 1;
        const scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() + newQueuePosition * 7); // Weekly intervals

        const newQueueItem = {
          id: `queue-${Date.now()}`,
          manuscript_id: "ms-001",
          reviewer_id: reviewerId,
          queue_position: newQueuePosition,
          created_date: new Date().toISOString(),
          scheduled_send_date: scheduledDate.toISOString(),
          priority: "normal" as const,
          notes: "Added via dashboard",
        };

        setSimulatedQueue((prev) => [...prev, newQueueItem]);
        setSelectedReviewers((prev) => prev.filter((id) => id !== reviewerId));
        showSnackbar(
          `${reviewer.name} added to queue (Position ${newQueuePosition})`,
          "info"
        );

        // Switch to queue tab to show the result
        setTimeout(() => setTabValue(2), 1000);
      }
    );
  };

  const handleBatchInvite = () => {
    if (selectedReviewers.length === 0) return;

    const reviewerNames = selectedReviewers
      .map((id) => mockPotentialReviewers.find((r) => r.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    showConfirmDialog(
      "Send Batch Invitations",
      `Send invitations to ${selectedReviewers.length} reviewers: ${reviewerNames}?`,
      () => {
        selectedReviewers.forEach((reviewerId) => {
          const newInvitation = {
            id: `inv-${Date.now()}-${reviewerId}`,
            manuscript_id: "ms-001",
            reviewer_id: reviewerId,
            invited_date: new Date().toISOString(),
            due_date: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "pending" as const,
            invitation_round: 1,
            reminder_count: 0,
            notes: "Batch invitation via dashboard",
          };

          setSimulatedInvitations((prev) => [...prev, newInvitation]);
        });

        setSelectedReviewers([]);
        showSnackbar(`Sent ${selectedReviewers.length} invitations`, "success");
        setTimeout(() => setTabValue(1), 1000);
      }
    );
  };

  const handleBatchAddToQueue = () => {
    if (selectedReviewers.length === 0) return;

    const reviewerNames = selectedReviewers
      .map((id) => mockPotentialReviewers.find((r) => r.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    showConfirmDialog(
      "Add to Queue",
      `Add ${selectedReviewers.length} reviewers to queue: ${reviewerNames}?`,
      () => {
        let currentMaxPosition = Math.max(
          ...simulatedQueue.map((q) => q.queue_position),
          0
        );

        selectedReviewers.forEach((reviewerId) => {
          currentMaxPosition += 1;
          const scheduledDate = new Date();
          scheduledDate.setDate(
            scheduledDate.getDate() + currentMaxPosition * 7
          );

          const newQueueItem = {
            id: `queue-${Date.now()}-${reviewerId}`,
            manuscript_id: "ms-001",
            reviewer_id: reviewerId,
            queue_position: currentMaxPosition,
            created_date: new Date().toISOString(),
            scheduled_send_date: scheduledDate.toISOString(),
            priority: "normal" as const,
            notes: "Batch added via dashboard",
          };

          setSimulatedQueue((prev) => [...prev, newQueueItem]);
        });

        setSelectedReviewers([]);
        showSnackbar(
          `Added ${selectedReviewers.length} reviewers to queue`,
          "info"
        );
        setTimeout(() => setTabValue(2), 1000);
      }
    );
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "available":
        return "success";
      case "busy":
        return "warning";
      case "unavailable":
        return "error";
      case "sabbatical":
        return "info";
      default:
        return "default";
    }
  };

  const getInvitationStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "success";
      case "declined":
        return "error";
      case "pending":
        return "warning";
      case "expired":
        return "error";
      case "completed":
        return "info";
      case "overdue":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircleIcon fontSize="small" />;
      case "declined":
        return <CancelIcon fontSize="small" />;
      case "pending":
        return <PendingIcon fontSize="small" />;
      case "expired":
      case "overdue":
        return <ScheduleIcon fontSize="small" />;
      default:
        return <MailOutlineIcon fontSize="small" />;
    }
  };

  // Configure header for reviewer dashboard
  useHeaderConfig({
    logoAffix: "Review Dashboard",
    containerProps: { maxWidth: false },
  });

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Reviewer Invitation Dashboard
            </Typography>
            {/* Manuscript Details Card */}
            <Card
              sx={{
                mb: 3,
                display: "flex",
                borderRadius: 1.5,
                overflow: "hidden",
                borderLeft: "4px solid",
                borderLeftColor: "warning.main",
              }}
            >
              <CardContent sx={{ flex: 1, p: 0, pb: "0 !important" }}>
                {/* Header Section */}
                <Box sx={{ p: 2, pb: 1 }}>
                  {/* Top Row - ID, Status, Action Badge */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        ID 5694305
                      </Typography>
                      <Chip
                        label="COMMISSIONED"
                        size="small"
                        variant="outlined"
                        sx={{
                          height: 20,
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                        }}
                      />
                    </Box>
                    <Chip
                      label="RESPOND TO INVITE V1"
                      size="small"
                      color="warning"
                      sx={{
                        height: 24,
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        "& .MuiChip-label": {
                          px: 1,
                        },
                      }}
                    />
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    color="secondary"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      lineHeight: 1.5,
                      mb: 2,
                    }}
                  >
                    A Key Major Guideline for Engineering Bioactive
                    Multicomponent Nanofunctionalization for Biomedicine and
                    Other Applications: Fundamental Models Confirmed by Both
                    Direct and Indirect Evidence
                  </Typography>

                  {/* Authors Row */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Richard Bennet
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Chip
                        label="SA"
                        size="small"
                        color="neutral"
                        sx={{
                          height: 16,
                          minWidth: 16,
                        }}
                      />
                      <Chip
                        label="CA"
                        size="small"
                        color="neutral"
                        sx={{
                          height: 16,
                          minWidth: 16,
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.primary">
                      ,{" "}
                      <Box component="span" sx={{ fontWeight: 700 }}>
                        Johnathan Smith
                      </Box>
                    </Typography>
                  </Box>

                  {/* Details Row */}
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700 }}
                        color="text.secondary"
                      >
                        Article Type:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Research Article
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700 }}
                        color="text.secondary"
                      >
                        Academic Editor:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cambria Whitfield
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700 }}
                        color="text.secondary"
                      >
                        Reviewer Reports:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <Box component="span" sx={{ fontWeight: 700 }}>
                          3
                        </Box>{" "}
                        invited,{" "}
                        <Box component="span" sx={{ fontWeight: 700 }}>
                          1
                        </Box>{" "}
                        agreed
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Footer Section */}
                <Box
                  sx={[
                    {
                      bgcolor: "background.default",
                      p: 2,
                      pt: 1.5,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid",
                      borderTopColor: "divider",
                    },
                    (theme) =>
                      theme.applyStyles("dark", {
                        bgcolor: "action.hover",
                      }),
                  ]}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700 }}
                      color="text.secondary"
                    >
                      Journal:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Abstract and Applied Analysis
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700 }}
                      color="text.secondary"
                    >
                      Submitted on:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 400, color: "text.primary" }}
                    >
                      15.02.2023 (an hour ago)
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="reviewer dashboard tabs"
          >
            <Tab
              label={
                <Badge badgeContent={filteredReviewers.length} color="primary">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonAddIcon fontSize="small" />
                    Potential Reviewers
                  </Box>
                </Badge>
              }
            />
            <Tab
              label={
                <Badge
                  badgeContent={mockReviewInvitations.length}
                  color="secondary"
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <MailOutlineIcon fontSize="small" />
                    Sent Invitations
                  </Box>
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={simulatedQueue.length} color="warning">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <QueueIcon fontSize="small" />
                    Invitation Queue
                  </Box>
                </Badge>
              }
            />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          {/* Potential Reviewers Tab */}
          <Grid container spacing={3}>
            {/* Filters and Controls */}
            <Grid size={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <FilterListIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Search & Filter Reviewers
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      label="Search reviewers"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Name, affiliation, expertise..."
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Sort by</InputLabel>
                      <Select
                        value={sortBy}
                        label="Sort by"
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <MenuItem value="match_score">Match Score</MenuItem>
                        <MenuItem value="response_rate">Response Rate</MenuItem>
                        <MenuItem value="quality_score">Quality Score</MenuItem>
                        <MenuItem value="current_load">Current Load</MenuItem>
                        <MenuItem value="name">Name</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Availability</InputLabel>
                      <Select
                        multiple
                        value={filterAvailability}
                        label="Availability"
                        onChange={(e) =>
                          setFilterAvailability(e.target.value as string[])
                        }
                      >
                        <MenuItem value="available">Available</MenuItem>
                        <MenuItem value="busy">Busy</MenuItem>
                        <MenuItem value="unavailable">Unavailable</MenuItem>
                        <MenuItem value="sabbatical">Sabbatical</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <TextField
                      fullWidth
                      label="Min Match Score"
                      type="number"
                      value={minMatchScore}
                      onChange={(e) => setMinMatchScore(Number(e.target.value))}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        disabled={selectedReviewers.length === 0}
                        startIcon={<MailOutlineIcon />}
                        onClick={handleBatchInvite}
                      >
                        Invite Selected ({selectedReviewers.length})
                      </Button>
                      <Button
                        variant="outlined"
                        disabled={selectedReviewers.length === 0}
                        startIcon={<QueueIcon />}
                        onClick={handleBatchAddToQueue}
                      >
                        Add to Queue
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Reviewers Table */}
            <Grid size={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">Select</TableCell>
                      <TableCell>Reviewer</TableCell>
                      <TableCell align="center">Match Score</TableCell>
                      <TableCell align="center">Availability</TableCell>
                      <TableCell align="center">Current Load</TableCell>
                      <TableCell align="center">Response Rate</TableCell>
                      <TableCell align="center">Quality Score</TableCell>
                      <TableCell align="center">Avg Review Time</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredReviewers.map((reviewer) => (
                      <TableRow
                        key={reviewer.id}
                        hover
                        sx={{
                          backgroundColor:
                            reviewer.conflicts_of_interest.length > 0
                              ? (theme) =>
                                  theme.vars?.palette?.error?.main
                                    ? `${theme.vars.palette.error.main}08`
                                    : "rgba(211, 47, 47, 0.03)"
                              : "inherit",
                          borderLeft:
                            reviewer.conflicts_of_interest.length > 0
                              ? (theme) =>
                                  `4px solid ${
                                    theme.vars?.palette?.error?.main ||
                                    "#d32f2f"
                                  }`
                              : "4px solid transparent",
                          "&:hover": {
                            backgroundColor:
                              reviewer.conflicts_of_interest.length > 0
                                ? (theme) =>
                                    theme.vars?.palette?.error?.main
                                      ? `${theme.vars.palette.error.main}12`
                                      : "rgba(211, 47, 47, 0.06)"
                                : (theme) =>
                                    theme.vars?.palette?.action?.hover ||
                                    "rgba(0, 0, 0, 0.04)",
                          },
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Box
                            sx={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedReviewers.includes(reviewer.id)}
                              onChange={() => handleReviewerSelect(reviewer.id)}
                              disabled={
                                reviewer.conflicts_of_interest.length > 0
                              }
                              style={{
                                opacity:
                                  reviewer.conflicts_of_interest.length > 0
                                    ? 0.5
                                    : 1,
                                cursor:
                                  reviewer.conflicts_of_interest.length > 0
                                    ? "not-allowed"
                                    : "pointer",
                              }}
                            />
                            {reviewer.conflicts_of_interest.length > 0 && (
                              <CancelIcon
                                sx={{
                                  position: "absolute",
                                  top: "-2px",
                                  right: "-8px",
                                  fontSize: 16,
                                  color: "error.main",
                                  pointerEvents: "none",
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar sx={{ bgcolor: "primary.main" }}>
                              {reviewer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 600,
                                  color:
                                    reviewer.conflicts_of_interest.length > 0
                                      ? "text.primary"
                                      : "inherit",
                                  opacity:
                                    reviewer.conflicts_of_interest.length > 0
                                      ? 0.8
                                      : 1,
                                }}
                              >
                                {reviewer.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color:
                                    reviewer.conflicts_of_interest.length > 0
                                      ? "text.secondary"
                                      : "text.secondary",
                                  opacity:
                                    reviewer.conflicts_of_interest.length > 0
                                      ? 0.7
                                      : 1,
                                }}
                              >
                                {reviewer.affiliation}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {reviewer.department}
                              </Typography>
                              <Box sx={{ mt: 0.5 }}>
                                {reviewer.expertise_areas
                                  .slice(0, 3)
                                  .map((area, index) => (
                                    <Chip
                                      key={index}
                                      label={area}
                                      size="small"
                                      variant="outlined"
                                      sx={{
                                        mr: 0.5,
                                        mb: 0.5,
                                        fontSize: "0.7rem",
                                      }}
                                    />
                                  ))}
                              </Box>
                              {reviewer.conflicts_of_interest.length > 0 && (
                                <Chip
                                  label={`Conflict: ${reviewer.conflicts_of_interest.join(
                                    ", "
                                  )}`}
                                  color="error"
                                  size="small"
                                  icon={<CancelIcon />}
                                  sx={{
                                    mt: 1,
                                    fontWeight: 600,
                                    "& .MuiChip-label": {
                                      fontWeight: 600,
                                    },
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            <Typography variant="h6" color="primary">
                              {reviewer.match_score}%
                            </Typography>
                            {reviewer.match_score >= 90 && (
                              <StarIcon color="warning" fontSize="small" />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={reviewer.availability_status}
                            color={
                              getAvailabilityColor(
                                reviewer.availability_status
                              ) as
                                | "success"
                                | "warning"
                                | "error"
                                | "info"
                                | "default"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box>
                            <Typography variant="body2">
                              {reviewer.current_review_load}/
                              {reviewer.max_review_capacity}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={
                                (reviewer.current_review_load /
                                  reviewer.max_review_capacity) *
                                100
                              }
                              sx={{ mt: 0.5, width: 40 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            variant="body2"
                            color={
                              reviewer.response_rate >= 80
                                ? "success.main"
                                : "warning.main"
                            }
                          >
                            {reviewer.response_rate}%
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="primary">
                            {reviewer.quality_score}%
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {reviewer.average_review_time_days} days
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            <Tooltip
                              title={
                                reviewer.conflicts_of_interest.length > 0
                                  ? "Cannot invite - Conflict of interest"
                                  : "Invite immediately"
                              }
                            >
                              <span>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  disabled={
                                    reviewer.conflicts_of_interest.length > 0
                                  }
                                  onClick={() =>
                                    handleInviteReviewer(reviewer.id)
                                  }
                                  sx={{
                                    "&.Mui-disabled": {
                                      color: (theme) =>
                                        theme.vars?.palette?.error?.main ||
                                        "#d32f2f",
                                      opacity: 0.8,
                                    },
                                  }}
                                >
                                  <MailOutlineIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip
                              title={
                                reviewer.conflicts_of_interest.length > 0
                                  ? "Cannot queue - Conflict of interest"
                                  : "Add to queue"
                              }
                            >
                              <span>
                                <IconButton
                                  size="small"
                                  color="secondary"
                                  disabled={
                                    reviewer.conflicts_of_interest.length > 0
                                  }
                                  onClick={() => handleAddToQueue(reviewer.id)}
                                  sx={{
                                    "&.Mui-disabled": {
                                      color: (theme) =>
                                        theme.vars?.palette?.error?.main ||
                                        "#d32f2f",
                                      opacity: 0.8,
                                    },
                                  }}
                                >
                                  <QueueIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Sent Invitations Tab */}
          <Grid container spacing={3}>
            <Grid size={12}>
              <Typography variant="h6" gutterBottom>
                Invitation Status Overview
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Reviewer</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Invited Date</TableCell>
                      <TableCell align="center">Response Date</TableCell>
                      <TableCell align="center">Due Date</TableCell>
                      <TableCell align="center">Round</TableCell>
                      <TableCell align="center">Reminders</TableCell>
                      <TableCell>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {simulatedInvitations.map((invitation) => {
                      const reviewer = mockPotentialReviewers.find(
                        (r) => r.id === invitation.reviewer_id
                      );
                      return (
                        <TableRow key={invitation.id} hover>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Avatar sx={{ bgcolor: "primary.main" }}>
                                {reviewer?.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2">
                                  {reviewer?.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {reviewer?.affiliation}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={invitation.status}
                              color={
                                getInvitationStatusColor(invitation.status) as
                                  | "success"
                                  | "warning"
                                  | "error"
                                  | "info"
                                  | "default"
                              }
                              icon={getStatusIcon(invitation.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            {new Date(
                              invitation.invited_date
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="center">
                            {invitation.response_date
                              ? new Date(
                                  invitation.response_date
                                ).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell align="center">
                            {new Date(invitation.due_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={`Round ${invitation.invitation_round}`}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Badge
                              badgeContent={invitation.reminder_count}
                              color="warning"
                            >
                              <MailOutlineIcon />
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {invitation.notes || "-"}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Invitation Queue Tab */}
          <Grid container spacing={3}>
            <Grid size={12}>
              <Typography variant="h6" gutterBottom>
                Scheduled Invitation Queue
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Queue Position</TableCell>
                      <TableCell>Reviewer</TableCell>
                      <TableCell align="center">Match Score</TableCell>
                      <TableCell align="center">Scheduled Send Date</TableCell>
                      <TableCell align="center">Priority</TableCell>
                      <TableCell align="center">Created Date</TableCell>
                      <TableCell>Notes</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {simulatedQueue.map((queueItem) => {
                      const reviewer = mockPotentialReviewers.find(
                        (r) => r.id === queueItem.reviewer_id
                      );
                      return (
                        <TableRow key={queueItem.id} hover>
                          <TableCell align="center">
                            <Chip
                              label={queueItem.queue_position}
                              color="primary"
                              sx={{ fontWeight: "bold" }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Avatar sx={{ bgcolor: "secondary.main" }}>
                                {reviewer?.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2">
                                  {reviewer?.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {reviewer?.affiliation}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" color="primary">
                              {reviewer?.match_score}%
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {new Date(
                              queueItem.scheduled_send_date
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={queueItem.priority}
                              color={
                                queueItem.priority === "high"
                                  ? "error"
                                  : queueItem.priority === "normal"
                                  ? "info"
                                  : "default"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            {new Date(
                              queueItem.created_date
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {queueItem.notes || "-"}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="center"
                            >
                              <Tooltip title="Send now">
                                <IconButton size="small" color="primary">
                                  <MailOutlineIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Remove from queue">
                                <IconButton size="small" color="error">
                                  <CancelIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="primary">
                  {
                    mockPotentialReviewers.filter((r) => r.match_score >= 90)
                      .length
                  }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  High Match Reviewers (90%+)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="success.main">
                  {
                    simulatedInvitations.filter((i) => i.status === "accepted")
                      .length
                  }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accepted Invitations
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="warning.main">
                  {
                    simulatedInvitations.filter((i) => i.status === "pending")
                      .length
                  }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Responses
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="info.main">
                  {simulatedQueue.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Queued Invitations
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({
            open: false,
            title: "",
            message: "",
            onConfirm: () => {},
          })
        }
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirmDialog({
                open: false,
                title: "",
                message: "",
                onConfirm: () => {},
              })
            }
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              confirmDialog.onConfirm();
              setConfirmDialog({
                open: false,
                title: "",
                message: "",
                onConfirm: () => {},
              });
            }}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
