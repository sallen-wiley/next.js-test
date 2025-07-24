"use client";
import { useState } from "react";
import {
  Container,
  Typography,
  Stack,
  Grid,
  TextField,
  Button,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import UndoIcon from "@mui/icons-material/Undo";

// Notification type
interface Notification {
  id: number;
  title: string;
  content: string;
  date: string;
  type: "success" | "info" | "warning" | "error";
  attachments: string[];
  actionItems: string[];
  dismissed: boolean;
  articleTitle?: string;
}

// Dummy data for notifications
const dummyNotifications: Notification[] = [
  {
    id: 1,
    title: "Document Approved",
    content: "You have a new comment on your article.",
    date: "2025-07-07",
    type: "info",
    attachments: ["file1.pdf"],
    actionItems: ["Review changes"],
    dismissed: false,
    articleTitle: "Deep Learning for NLP",
  },
  {
    id: 2,
    title: "Action Required",
    content: "Multiple failed login attempts detected from unknown device.",
    date: "2025-07-06",
    type: "error",
    attachments: [],
    actionItems: ["Update profile"],
    dismissed: false,
  },
  {
    id: 3,
    title: "Storage Almost Full",
    content: "Your storage is 85% full. Consider upgrading your plan.",
    date: "2025-07-05",
    type: "warning",
    attachments: [],
    actionItems: [],
    dismissed: false,
  },
  {
    id: 4,
    title: "Profile Updated",
    content: "Your profile information has been successfully updated.",
    date: "2025-07-04",
    type: "success",
    attachments: [],
    actionItems: [],
    dismissed: false,
  },
];

export default function NotificationsHistory() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [showUndo, setShowUndo] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [detailNotif, setDetailNotif] = useState<Notification | null>(null);

  // Filtered notifications (placeholder logic)
  const filtered = dummyNotifications.filter((n) => {
    return (
      (!type || n.type === type) &&
      (!search || n.content.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const handleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleBulkMarkRead = () => {
    // Placeholder: mark selected as read
    setShowUndo(true);
    setSelected([]);
  };

  const handleUndo = () => {
    setShowUndo(false);
  };

  const handleOpenDetail = (notif: Notification) => {
    setDetailNotif(notif);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setDetailNotif(null);
  };

  const handleExport = () => {
    // Placeholder: export logic
    alert("Exported notification history!");
  };

  return (
    <Container maxWidth="lg" sx={{ pt: "80px" }}>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        All Notifications
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              label="Search notifications"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={type}
                label="Type"
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="error">Error</MenuItem>
                <MenuItem value="success">Success</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            {/* Date range picker placeholder */}
            <TextField
              label="Date range"
              placeholder="Select range"
              fullWidth
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              fullWidth
            >
              Export
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {showUndo && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: "#fffbe6" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography>Notifications marked as read.</Typography>
            <Button startIcon={<UndoIcon />} onClick={handleUndo}>
              Undo
            </Button>
          </Stack>
        </Paper>
      )}
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} mb={2}>
          <Button
            variant="outlined"
            disabled={selected.length === 0}
            onClick={handleBulkMarkRead}
          >
            Mark as Read
          </Button>
        </Stack>
        <List>
          {filtered.map((notif, idx) => (
            <>
              <ListItem
                key={notif.id}
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      onClick={() => handleOpenDetail(notif)}
                    >
                      <Typography variant="body2">View</Typography>
                    </IconButton>
                    <Checkbox
                      edge="end"
                      checked={selected.includes(notif.id)}
                      onChange={() => handleSelect(notif.id)}
                    />
                  </>
                }
              >
                <ListItemText
                  primary={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Chip
                        label={notif.type}
                        color={
                          notif.type === "error"
                            ? "error"
                            : notif.type === "warning"
                            ? "warning"
                            : notif.type === "success"
                            ? "success"
                            : "info"
                        }
                        size="small"
                      />
                      <Typography fontWeight={600}>{notif.title}</Typography>
                    </Stack>
                  }
                  secondary={
                    <>
                      <Typography variant="body2">{notif.content}</Typography>
                      {notif.articleTitle && (
                        <Typography
                          variant="caption"
                          sx={{ fontStyle: "italic" }}
                        >
                          {notif.articleTitle}
                        </Typography>
                      )}
                      <Stack direction="row" spacing={1} mt={1}>
                        <Typography variant="caption" color="text.secondary">
                          {notif.date}
                        </Typography>
                      </Stack>
                    </>
                  }
                />
              </ListItem>
              {idx < filtered.length - 1 && <Divider />}
            </>
          ))}
        </List>
      </Paper>
      <Dialog
        open={openDetail}
        onClose={handleCloseDetail}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Notification Details</DialogTitle>
        <DialogContent>
          {detailNotif && (
            <Stack spacing={2}>
              <Typography variant="h6">{detailNotif.title}</Typography>
              <Typography>{detailNotif.content}</Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {detailNotif.date}
              </Typography>
              <Stack direction="row" spacing={1}>
                {detailNotif.attachments.map((a, i) => (
                  <Chip key={i} label={a} />
                ))}
              </Stack>
              <Typography variant="subtitle2">Action Items:</Typography>
              <ul>
                {detailNotif.actionItems.map((item, i) => (
                  <li key={item + i}>{item}</li>
                ))}
              </ul>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
