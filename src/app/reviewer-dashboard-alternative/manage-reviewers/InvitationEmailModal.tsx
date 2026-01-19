"use client";
import * as React from "react";
import {
  Button,
  Box,
  Typography,
  TextField,
  Paper,
  Divider,
  Stack,
  IconButton,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
import MaximizeIcon from "@mui/icons-material/Maximize";
import type { Manuscript, PotentialReviewerWithMatch } from "@/lib/supabase";

interface InvitationEmailModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (customization: EmailCustomization) => void;
  reviewer: PotentialReviewerWithMatch | null;
  manuscript: Manuscript | null;
  action: "invite" | "queue";
}

export interface EmailCustomization {
  editorComment: string;
  signature: string;
}

export function InvitationEmailModal({
  open,
  onClose,
  onConfirm,
  reviewer,
  manuscript,
  action,
}: InvitationEmailModalProps) {
  const [editorComment, setEditorComment] = React.useState("");
  const [signature, setSignature] = React.useState(
    "Best regards,\nThe Editorial Team"
  );
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [confirmCloseOpen, setConfirmCloseOpen] = React.useState(false);

  const defaultSignature = "Best regards,\nThe Editorial Team";

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setEditorComment("");
      setSignature(defaultSignature);
      setIsMinimized(false);
    }
  }, [open]);

  const handleConfirm = () => {
    onConfirm({
      editorComment,
      signature,
    });
  };

  // Check if there are any customizations
  const hasCustomizations = () => {
    return editorComment.trim() !== "" || signature !== defaultSignature;
  };

  const handleClose = () => {
    if (hasCustomizations()) {
      setConfirmCloseOpen(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setConfirmCloseOpen(false);
    onClose();
  };

  if (!open || !reviewer || !manuscript) return null;

  const actionVerb = action === "invite" ? "Send Invitation" : "Add to Queue";

  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        width: isMinimized ? 300 : 600,
        maxWidth: "calc(100vw - 32px)",
        maxHeight: isMinimized ? "auto" : "calc(100vh - 32px)",
        zIndex: 1300,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {isMinimized ? `Email Preview` : `Preview & Customize ${actionVerb}`}
        </Typography>
        <Stack direction="row" spacing={0.5}>
          <IconButton
            onClick={() => setIsMinimized(!isMinimized)}
            size="small"
            sx={{ color: "inherit" }}
          >
            {isMinimized ? <MaximizeIcon /> : <MinimizeIcon />}
          </IconButton>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{ color: "inherit" }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Content - Collapsible */}
      <Collapse in={!isMinimized}>
        <Box
          sx={{
            p: 2,
            maxHeight: "calc(100vh - 180px)",
            overflowY: "auto",
          }}
        >
          <Stack spacing={3}>
            {/* Reviewer Info */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Recipient
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {reviewer.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {reviewer.email} • {reviewer.affiliation}
              </Typography>
            </Box>

            {/* Email Preview */}
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: "background.default",
                fontFamily: "monospace",
                fontSize: "0.875rem",
              }}
            >
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Email Preview
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                <Typography variant="body2" paragraph>
                  <strong>Subject:</strong> Invitation to Review:{" "}
                  {manuscript.title}
                </Typography>

                <Typography variant="body2" paragraph>
                  Dear Dr. {reviewer.name.split(" ").pop()},
                </Typography>

                <Typography variant="body2" paragraph>
                  We are writing to invite you to review the following
                  manuscript submitted to{" "}
                  <strong>{manuscript.journal || "our journal"}</strong>:
                </Typography>

                <Typography variant="body2" paragraph>
                  <strong>Title:</strong> {manuscript.title}
                  <br />
                  <strong>Authors:</strong>{" "}
                  {manuscript.authors?.join(", ") || "Not specified"}
                  <br />
                  <strong>Article Type:</strong>{" "}
                  {manuscript.article_type || "Research Article"}
                  {manuscript.keywords && manuscript.keywords.length > 0 && (
                    <>
                      <br />
                      <strong>Keywords:</strong>{" "}
                      {manuscript.keywords.join(", ")}
                    </>
                  )}
                </Typography>

                {manuscript.abstract && (
                  <Typography variant="body2" paragraph>
                    <strong>Abstract:</strong>
                    <br />
                    {manuscript.abstract}
                  </Typography>
                )}

                {editorComment && (
                  <Typography variant="body2" paragraph>
                    <strong>Editor&apos;s Note:</strong>
                    <br />
                    {editorComment}
                  </Typography>
                )}

                <Typography variant="body2" paragraph>
                  We would greatly appreciate your expertise in evaluating this
                  manuscript. The review is expected to be completed within 21
                  days.
                </Typography>

                <Typography variant="body2" paragraph>
                  Please respond to this invitation at your earliest
                  convenience.
                </Typography>

                <Typography variant="body2">
                  {signature.split("\n").map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line}
                      {idx < signature.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </Typography>
              </Box>
            </Paper>

            {/* Editor Comment Input */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Editor&apos;s Note (Optional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add a personal note or specific instructions for the reviewer..."
                value={editorComment}
                onChange={(e) => setEditorComment(e.target.value)}
                variant="outlined"
                size="small"
              />
            </Box>

            {/* Signature Input */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Email Signature
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                variant="outlined"
                size="small"
              />
            </Box>
          </Stack>
        </Box>

        {/* Footer - Actions */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            bgcolor: "background.paper",
          }}
        >
          <Button onClick={handleClose} color="neutral">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="primary"
            sx={{ textTransform: "uppercase" }}
          >
            {actionVerb}
          </Button>
        </Box>
      </Collapse>

      {/* Confirmation Dialog for Closing */}
      <Dialog
        open={confirmCloseOpen}
        onClose={() => setConfirmCloseOpen(false)}
      >
        <DialogTitle>Discard Changes?</DialogTitle>
        <DialogContent>
          <Typography>
            You have unsaved changes to the email. Are you sure you want to
            discard them?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCloseOpen(false)}>
            Keep Editing
          </Button>
          <Button
            onClick={handleConfirmClose}
            variant="contained"
            color="error"
          >
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
