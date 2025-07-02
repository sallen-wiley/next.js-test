import React, { useState } from "react";
import {
  Divider,
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  Rating,
  Box,
  Typography,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import FeedbackRoundedIcon from "@mui/icons-material/FeedbackRounded";
import NewReleasesRoundedIcon from "@mui/icons-material/NewReleasesRounded";
import LiveChat from "./LiveChat";

const SupportMenuFabMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showChat, setShowChat] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLiveChat = () => {
    setAnchorEl(null);
    setShowChat(true);
  };
  const handleLeaveFeedback = () => {
    setAnchorEl(null);
    setShowFeedback(true);
  };
  const handleFeedbackSubmit = () => {
    setShowFeedback(false);
    setFeedbackText("");
    setRating(null);
    setSnackbarOpen(true);
  };
  const handleFeedbackClose = () => {
    setShowFeedback(false);
  };
  const handleSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <>
      {!showChat && (
        <Fab
          color="primary"
          onClick={handleOpen}
          sx={{
            position: "fixed",
            bottom: 24,
            left: "100vw",
            transform: "translateX(-100%) translateX(-24px)", // Fix for menu's overriding overflow and removing scroll bar Always 24px from right, regardless of width
            zIndex: 1000,
          }}
          aria-label="Open support menu"
        >
          <HelpOutlineIcon />
        </Fab>
      )}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MenuItem onClick={handleLiveChat}>
          <ListItemIcon>
            <ChatBubbleRoundedIcon fontSize="small" />
          </ListItemIcon>
          Live Chat
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <HelpOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          Help Center
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLeaveFeedback}>
          <ListItemIcon>
            <FeedbackRoundedIcon fontSize="small" />
          </ListItemIcon>
          Leave feedback
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <NewReleasesRoundedIcon fontSize="small" />
          </ListItemIcon>
          Release notes
        </MenuItem>
      </Menu>
      {/* Feedback Modal */}
      <Dialog open={showFeedback} onClose={handleFeedbackClose}>
        <DialogTitle>Leave Feedback</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography component="legend">Your experience</Typography>
            <Rating
              name="product-rating"
              value={rating}
              onChange={(_event, newValue) => setRating(newValue)}
            />
            <TextField
              label="Additional feedback"
              multiline
              minRows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              fullWidth
            />
            <Typography variant="caption" color="text.secondary">
              Need genuine support?&nbsp;
              <Button
                size="small"
                onClick={() => {
                  setShowFeedback(false);
                  setShowChat(true);
                }}
              >
                Go to Live Chat
              </Button>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFeedbackClose}>Cancel</Button>
          <Button
            onClick={handleFeedbackSubmit}
            variant="contained"
            disabled={!rating && !feedbackText}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {/* Feedback Submitted Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Feedback submitted successfully. Thank you!
        </Alert>
      </Snackbar>
      {showChat && <LiveChat onClose={() => setShowChat(false)} />}
    </>
  );
};

export default SupportMenuFabMenu;
