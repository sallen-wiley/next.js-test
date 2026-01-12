"use client";

import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Paper,
  Typography,
  Chip,
  IconButton,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import type { ReviewerProfile, Publication } from "./profile-drawer/types";

interface PublicationsManagementDialogProps {
  open: boolean;
  onClose: () => void;
  reviewer: ReviewerProfile;
  manuscriptId: string;
  onSave: (publication: {
    id: string;
    title: string;
    doi?: string;
    journal_name?: string;
    authors?: string[];
    publication_date?: string;
    is_related: boolean;
  }) => Promise<void>;
}

export default function PublicationsManagementDialog({
  open,
  onClose,
  reviewer,
}: PublicationsManagementDialogProps) {
  const handleEditPublication = (publication: Publication) => {
    // TODO: Open edit dialog for publication
    console.log("Edit publication:", publication);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Manage Publications</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {reviewer.all_publications && reviewer.all_publications.length > 0 ? (
            reviewer.all_publications.map((pub) => (
              <Paper key={pub.id} variant="outlined" sx={{ p: 2 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body1">{pub.title}</Typography>
                      {pub.is_related && (
                        <Chip
                          label="RELATED"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {pub.journal_name} •{" "}
                      {pub.publication_date
                        ? new Date(pub.publication_date).getFullYear()
                        : "N/A"}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleEditPublication(pub)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Paper>
            ))
          ) : (
            <Typography color="text.secondary">
              No publications found for this reviewer.
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
