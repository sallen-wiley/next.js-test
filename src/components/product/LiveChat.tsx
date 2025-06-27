import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Stack,
  Avatar,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseRounded";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import TextField from "@mui/material/TextField";
import MinimizeRoundedIcon from "@mui/icons-material/MinimizeRounded";

const LiveChat = ({ onClose }: { onClose: () => void }) => {
  const [minimized, setMinimized] = useState(false);
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1300,
        width: 340,
        maxWidth: "100vw",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          height: minimized ? 56 : 340, // 56px header height, 340px expanded
          transition: "height 0.35s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            px: 2,
            py: 1.5,
            minHeight: 56,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <ChatBubbleOutlineIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600} component="span">
              Live Chat
            </Typography>
          </Stack>
          <Box>
            <IconButton
              onClick={() => setMinimized((m) => !m)}
              sx={{ color: "inherit" }}
              size="small"
              aria-label={minimized ? "Expand" : "Minimize"}
            >
              <MinimizeRoundedIcon />
            </IconButton>
            <IconButton
              onClick={onClose}
              sx={{ color: "inherit" }}
              size="small"
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        {/* Chat Body and Input Bar (no animation needed, just hidden) */}
        {!minimized && (
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                p: 2,
                bgcolor: "background.default",
                flex: 1,
                minHeight: 120,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                  W
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Wilson (AI Agent)
                  </Typography>
                  <Paper
                    sx={{ p: 1.5, bgcolor: "grey.50", mt: 0.5, maxWidth: 220 }}
                  >
                    <Typography variant="body2">
                      Hi! How can I help you today?
                    </Typography>
                  </Paper>
                </Box>
              </Stack>
            </Box>
            {/* Chat Input Bar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 1.5,
                borderTop: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <TextField
                size="small"
                placeholder="Type your message..."
                fullWidth
                sx={{ flex: 1 }}
              />
              <Button variant="contained" color="primary">
                Send
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default LiveChat;
