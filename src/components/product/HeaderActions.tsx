import React from "react";
import { Box, Button, IconButton, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircleRounded";

interface HeaderActionsProps {
  onNotificationClick: () => void;
  unreadCount?: number;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({
  onNotificationClick,
  unreadCount = 0,
}) => (
  <Box display="flex" alignItems="center" gap={2}>
    {/* Show full buttons with icons on lg and xl, icon button on md and below */}
    <Box
      sx={{
        display: { xs: "none", lg: "flex" },
        alignItems: "center",
        gap: 2,
      }}
    >
      <Button variant="text" startIcon={<AccountCircleIcon />}>
        My account
      </Button>
      <Badge badgeContent={unreadCount} color="error">
        <Button
          variant="text"
          startIcon={<NotificationsIcon sx={{ fontSize: 24 }} />}
          onClick={onNotificationClick}
          color="primary"
          aria-label="Show notifications"
          sx={{ position: "relative" }}
        >
          Notifications
        </Button>
      </Badge>
    </Box>
    <Box
      sx={{
        display: { xs: "flex", lg: "none" },
        alignItems: "center",
        gap: 2,
      }}
    >
      <IconButton color="primary" aria-label="My account">
        <AccountCircleIcon />
      </IconButton>
      <IconButton
        color="primary"
        onClick={onNotificationClick}
        aria-label="Show notifications"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{ fontSize: 24 }} />
        </Badge>
      </IconButton>
    </Box>
  </Box>
);

export default HeaderActions;
