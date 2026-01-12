"use client";

import * as React from "react";
import { Box, Typography, IconButton, Stack, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

interface ProfileHeaderProps {
  onClose: () => void;
  onEdit?: () => void;
  showEditButton: boolean;
}

export function ProfileHeader({
  onClose,
  onEdit,
  showEditButton,
}: ProfileHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        p: 3,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Typography variant="h4" sx={{ flexGrow: 1 }}>
        Reviewer Details
      </Typography>
      <Stack direction="row" spacing={1}>
        {showEditButton && onEdit && (
          <Tooltip title="Edit Reviewer">
            <IconButton onClick={onEdit} size="small" sx={{ mt: -1 }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <IconButton onClick={onClose} size="small" sx={{ mt: -1, mr: -1 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
}
