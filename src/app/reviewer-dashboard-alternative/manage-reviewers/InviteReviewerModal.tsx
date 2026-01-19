"use client";
import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface InviteReviewerModalProps {
  open: boolean;
  onClose: () => void;
  onInvite: (name: string, email: string) => Promise<void>;
  onAddToQueue: (name: string, email: string) => Promise<void>;
}

export function InviteReviewerModal({
  open,
  onClose,
  onInvite,
  onAddToQueue,
}: InviteReviewerModalProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setSubmitting(false);
    }
  }, [open]);

  const handleInvite = async () => {
    if (!email.trim()) return;

    setSubmitting(true);
    try {
      await onInvite(name.trim(), email.trim());
      onClose();
    } catch (error) {
      console.error("Error inviting reviewer:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToQueue = async () => {
    if (!email.trim()) return;

    setSubmitting(true);
    try {
      await onAddToQueue(name.trim(), email.trim());
      onClose();
    } catch (error) {
      console.error("Error adding to queue:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", pr: 1 }}>
        Invite Reviewer Manually
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            ml: "auto",
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Mayer"
          />
          <TextField
            fullWidth
            required
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jmayer@gmail.com"
            error={submitting && !email.trim()}
            helperText={submitting && !email.trim() ? "Email is required" : ""}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="neutral"
          onClick={handleAddToQueue}
          disabled={submitting || !email.trim()}
        >
          Add to Queue
        </Button>
        <Button
          variant="contained"
          onClick={handleInvite}
          disabled={submitting || !email.trim()}
        >
          Invite Reviewer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
