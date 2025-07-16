"use client";
import { useState } from "react";
// import MUI components
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Paper,
  Stack,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Checkbox,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ListItemText,
} from "@mui/material";
// import supporting components
import NotificationDrawerPreview from "./NotificationDrawerPreview";
import NotificationPreview from "./NotificationPreview";
// import icons
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import EditIcon from "@mui/icons-material/EditRounded";
import PreviewIcon from "@mui/icons-material/VisibilityRounded";
import FileCopyIcon from "@mui/icons-material/FileCopyRounded";
import SaveIcon from "@mui/icons-material/SaveRounded";
import ScheduleIcon from "@mui/icons-material/ScheduleRounded";
import BarChartIcon from "@mui/icons-material/BarChartRounded";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import WarningIcon from "@mui/icons-material/WarningAmberOutlined";
import ErrorIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutline";

// Define the severity type once
type NotificationSeverity = "info" | "success" | "warning" | "error";

// Define severity options for reuse
const SEVERITY_OPTIONS: { value: NotificationSeverity; label: string }[] = [
  { value: "info", label: "Info" },
  { value: "success", label: "Success" },
  { value: "warning", label: "Warning" },
  { value: "error", label: "Error" },
];

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
  [key: string]: unknown;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

interface NotificationTemplate {
  name: string;
  content: string;
  priority: NotificationSeverity;
  attachments: string[];
}

interface NotificationDraft {
  title: string;
  content: string;
  priority: NotificationSeverity;
  attachments: string[];
}

interface ScheduledNotification {
  title: string;
  audience: string[];
  date: string;
  recurring: boolean;
  status: string;
}

export default function NotificationAdmin() {
  const [tab, setTab] = useState(0);

  // --- Notification Builder State ---
  const [notifTitle, setNotifTitle] = useState("");
  const [notifContent, setNotifContent] = useState("");
  const [notifPriority, setNotifPriority] =
    useState<NotificationSeverity>("info");
  const [notifAttachments, setNotifAttachments] = useState<string[]>([]);
  const [notifTemplates, setNotifTemplates] = useState<NotificationTemplate[]>(
    []
  );
  const [drafts, setDrafts] = useState<NotificationDraft[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // --- Scheduler State ---
  const [audience, setAudience] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [scheduled, setScheduled] = useState<ScheduledNotification[]>([]);

  // --- Analytics State ---
  const [analytics] = useState([
    {
      type: "Maintenance Alert",
      sent: 1200,
      opened: 900,
      clicked: 300,
      fatigue: 0.1,
      segment: "Authors",
    },
    {
      type: "Feature Announcement",
      sent: 800,
      opened: 500,
      clicked: 120,
      fatigue: 0.2,
      segment: "Editors",
    },
  ]);

  // --- Handlers ---
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) =>
    setTab(newValue);

  // Notification Builder Handlers - simplified
  const handleSaveDraft = () => {
    setDrafts([
      ...drafts,
      {
        title: notifTitle,
        content: notifContent,
        priority: notifPriority,
        attachments: notifAttachments,
      },
    ]);
    setNotifTitle("");
    setNotifContent("");
    setNotifPriority("info");
    setNotifAttachments([]);
  };

  const handleSaveTemplate = () => {
    setNotifTemplates([
      ...notifTemplates,
      {
        name: notifTitle || `Template ${notifTemplates.length + 1}`,
        content: notifContent,
        priority: notifPriority,
        attachments: notifAttachments,
      },
    ]);
  };

  const handleDuplicateDraft = (idx: number) => {
    setDrafts([
      ...drafts,
      { ...drafts[idx], title: drafts[idx].title + " (Copy)" },
    ]);
  };
  const handleDeleteDraft = (idx: number) => {
    setDrafts(drafts.filter((_, i) => i !== idx));
  };
  const handleApplyTemplate = (idx: number) => {
    const t = notifTemplates[idx];
    setNotifTitle(t.name);
    setNotifContent(t.content);
    setNotifPriority(t.priority);
    setNotifAttachments(t.attachments);
    setSelectedTemplate(t.name);
  };

  // Scheduler Handlers
  const handleSchedule = () => {
    setScheduled([
      ...scheduled,
      {
        title: notifTitle,
        audience,
        date: scheduleDate,
        recurring,
        status: "Scheduled",
      },
    ]);
    setAudience([]);
    setScheduleDate("");
    setRecurring(false);
  };
  const handleCancelSchedule = (idx: number) => {
    setScheduled(scheduled.filter((_, i) => i !== idx));
  };

  // --- UI ---
  return (
    <Container maxWidth="lg" sx={{ pt: "80px" }}>
      <Typography variant="h4" sx={{ mb: 2, mt: 4 }}>
        Notification Admin
      </Typography>
      <Paper>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          aria-label="admin notification tabs"
        >
          <Tab
            label="Notification Builder"
            icon={<EditIcon />}
            iconPosition="start"
          />
          <Tab label="Scheduler" icon={<ScheduleIcon />} iconPosition="start" />
          <Tab label="Analytics" icon={<BarChartIcon />} iconPosition="start" />
        </Tabs>
      </Paper>
      {/* Tab 1: Notification Builder */}
      <TabPanel value={tab} index={0}>
        <Stack spacing={3}>
          <Typography variant="h6">Create Notification</Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Title"
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Severity</InputLabel>
              <Select
                value={notifPriority}
                label="Severity"
                onChange={(e) =>
                  setNotifPriority(e.target.value as NotificationSeverity)
                }
              >
                {SEVERITY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <TextField
            label="Content"
            value={notifContent}
            onChange={(e) => setNotifContent(e.target.value)}
            multiline
            minRows={4}
            fullWidth
            placeholder="Write notification content here..."
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="outlined" component="label">
              Add Attachment
              <input
                type="file"
                hidden
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setNotifAttachments([
                      ...notifAttachments,
                      e.target.files[0].name,
                    ]);
                  }
                }}
              />
            </Button>
            {notifAttachments.map((a, i) => (
              <Chip
                key={i}
                label={a}
                onDelete={() =>
                  setNotifAttachments(
                    notifAttachments.filter((_, idx) => idx !== i)
                  )
                }
              />
            ))}
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveDraft}
            >
              Save Draft
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileCopyIcon />}
              onClick={handleSaveTemplate}
            >
              Save as Template
            </Button>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={() => setShowPreview(true)}
            >
              Preview
            </Button>
          </Stack>
          <Typography variant="subtitle1" sx={{ mt: 3 }}>
            Templates
          </Typography>
          <Stack direction="row" spacing={2}>
            {notifTemplates.map((t, i) => (
              <Chip
                key={i}
                label={t.name}
                onClick={() => handleApplyTemplate(i)}
                color={selectedTemplate === t.name ? "primary" : "default"}
              />
            ))}
          </Stack>
          <Typography variant="subtitle1" sx={{ mt: 3 }}>
            Drafts
          </Typography>
          <List>
            {drafts.map((d, i) => (
              <ListItem
                key={i}
                secondaryAction={
                  <>
                    <Tooltip title="Duplicate">
                      <IconButton onClick={() => handleDuplicateDraft(i)}>
                        <FileCopyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDeleteDraft(i)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                }
              >
                <ListItemText primary={d.title} secondary={d.content} />
              </ListItem>
            ))}
          </List>
        </Stack>
        <Dialog
          open={showPreview}
          onClose={() => setShowPreview(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Notification Preview</DialogTitle>
          <DialogContent>
            {/* Snackbar notification preview */}
            <NotificationPreview
              open={true}
              onClose={() => setShowPreview(false)}
              type={notifPriority}
              title={notifTitle || undefined}
              message={notifContent || undefined}
            />
            {/* Drawer-style notification preview */}
            <Box sx={{ mt: 4 }}>
              <NotificationDrawerPreview
                notification={{
                  type: notifPriority,
                  title: notifTitle || "Sample Title",
                  message: notifContent || "Sample content for notification.",
                  timestamp: "Just now",
                  icon:
                    notifPriority === "success"
                      ? CheckCircleIcon
                      : notifPriority === "warning"
                      ? WarningIcon
                      : notifPriority === "error"
                      ? ErrorIcon
                      : InfoIcon,
                  unread: true,
                }}
              />
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Attachments:
              </Typography>
              <Stack direction="row" spacing={1} mt={1}>
                {notifAttachments.map((a, i) => (
                  <Chip key={i} label={a} />
                ))}
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPreview(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </TabPanel>
      {/* Tab 2: Scheduler */}
      <TabPanel value={tab} index={1}>
        <Stack spacing={3}>
          <Typography variant="h6">Schedule Notification</Typography>
          <FormControl fullWidth>
            <InputLabel>Audience Segments</InputLabel>
            <Select
              multiple
              value={audience}
              onChange={(e) => setAudience(e.target.value as string[])}
              label="Audience Segments"
              renderValue={(selected) => (selected as string[]).join(", ")}
            >
              <MenuItem value="Authors">Authors</MenuItem>
              <MenuItem value="Editors">Editors</MenuItem>
              <MenuItem value="Reviewers">Reviewers</MenuItem>
              <MenuItem value="US">US</MenuItem>
              <MenuItem value="EMEA">EMEA</MenuItem>
              <MenuItem value="APAC">APAC</MenuItem>
              <MenuItem value="Premium">Premium</MenuItem>
              <MenuItem value="Standard">Standard</MenuItem>
            </Select>
          </FormControl>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Schedule Date"
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <FormControl>
              <Stack direction="row" alignItems="center">
                <Checkbox
                  checked={recurring}
                  onChange={(e) => setRecurring(e.target.checked)}
                />
                <Typography>Recurring</Typography>
              </Stack>
            </FormControl>
          </Stack>
          <Button variant="contained" onClick={handleSchedule}>
            Schedule Notification
          </Button>
          <Typography variant="subtitle1" sx={{ mt: 3 }}>
            Scheduled Notifications
          </Typography>
          <List>
            {scheduled.map((s, i) => (
              <ListItem
                key={i}
                secondaryAction={
                  <Tooltip title="Cancel">
                    <IconButton onClick={() => handleCancelSchedule(i)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemText
                  primary={`${s.title} (${s.audience.join(", ")})`}
                  secondary={`Date: ${s.date} | Recurring: ${
                    s.recurring ? "Yes" : "No"
                  } | Status: ${s.status}`}
                />
              </ListItem>
            ))}
          </List>
        </Stack>
      </TabPanel>
      {/* Tab 3: Analytics */}
      <TabPanel value={tab} index={2}>
        <Stack spacing={3}>
          <Typography variant="h6">Notification Analytics</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Segment</TableCell>
                  <TableCell>Sent</TableCell>
                  <TableCell>Opened</TableCell>
                  <TableCell>Clicked</TableCell>
                  <TableCell>Fatigue Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analytics.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.segment}</TableCell>
                    <TableCell>{row.sent}</TableCell>
                    <TableCell>{row.opened}</TableCell>
                    <TableCell>{row.clicked}</TableCell>
                    <TableCell>{(row.fatigue * 100).toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="outlined">Export Data</Button>
        </Stack>
      </TabPanel>
    </Container>
  );
}
