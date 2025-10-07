import React, { useState, useRef, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Chip,
  Divider,
  Avatar,
  Stack,
  Button,
  Menu,
  MenuItem,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseRounded";
import NotificationsIcon from "@mui/icons-material/NotificationsRounded";
import InfoIcon from "@mui/icons-material/InfoRounded";
import WarningIcon from "@mui/icons-material/WarningRounded";
import PersonIcon from "@mui/icons-material/PersonRounded";
import EmailIcon from "@mui/icons-material/EmailRounded";
import SecurityIcon from "@mui/icons-material/SecurityRounded";

import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material/SvgIcon";

interface Notification {
  id: number;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  icon: OverridableComponent<SvgIconTypeMap<object, "svg">> & {
    muiName: string;
  };
  unread: boolean;
  articleTitle?: string; // Optional academic article title
}

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  open,
  onClose,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "success",
      title: "Profile Updated",
      message: "Your profile information has been successfully updated.",
      timestamp: "2 minutes ago",
      icon: PersonIcon,
      unread: true,
    },
    {
      id: 2,
      type: "info",
      title: "New Message",
      message: "You have received a new message from John Doe.",
      timestamp: "5 minutes ago",
      icon: EmailIcon,
      unread: true,
      articleTitle: "Deep Learning for Natural Language Processing",
    },
    {
      id: 3,
      type: "warning",
      title: "Storage Almost Full",
      message: "Your storage is 85% full. Consider upgrading your plan.",
      timestamp: "1 hour ago",
      icon: WarningIcon,
      unread: false,
    },
    {
      id: 4,
      type: "error",
      title: "Login Failed",
      message: "Multiple failed login attempts detected from unknown device.",
      timestamp: "2 hours ago",
      icon: SecurityIcon,
      unread: true,
    },
    {
      id: 5,
      type: "info",
      title: "System Maintenance",
      message: "Scheduled maintenance will occur tonight from 2-4 AM.",
      timestamp: "3 hours ago",
      icon: InfoIcon,
      unread: false,
    },
  ]);

  // DND State
  const [doNotDisturb, setDoNotDisturb] = useState<{
    active: boolean;
    until: number | null;
  }>({ active: false, until: null });
  const [dndCountdown, setDndCountdown] = useState<string>("");
  const dndIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [dndMenuAnchor, setDndMenuAnchor] = useState<null | HTMLElement>(null);

  // Helper to format countdown (minutes only)
  const formatCountdown = (ms: number) => {
    if (ms <= 0) return "0m";
    const totalMinutes = Math.ceil(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // DND Countdown effect (update every minute)
  useEffect(() => {
    if (doNotDisturb.active && doNotDisturb.until) {
      if (dndIntervalRef.current) clearInterval(dndIntervalRef.current);
      setDndCountdown(formatCountdown(doNotDisturb.until - Date.now()));
      dndIntervalRef.current = setInterval(() => {
        const msLeft = doNotDisturb.until! - Date.now();
        setDndCountdown(formatCountdown(msLeft));
        if (msLeft <= 0) {
          setDoNotDisturb({ active: false, until: null });
        }
      }, 60000); // update every minute
      return () => {
        if (dndIntervalRef.current) clearInterval(dndIntervalRef.current);
      };
    } else {
      setDndCountdown("");
      if (dndIntervalRef.current) clearInterval(dndIntervalRef.current);
    }
  }, [doNotDisturb]);

  // DND Controls
  const handleSetDnd = (durationMs: number | null) => {
    setDndMenuAnchor(null);
    if (durationMs === null) {
      setDoNotDisturb({ active: true, until: null });
    } else {
      setDoNotDisturb({ active: true, until: Date.now() + durationMs });
    }
  };
  const handleCancelDnd = () => setDoNotDisturb({ active: false, until: null });

  const unreadCount = notifications.filter((n) => n.unread).length;

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "success.main";
      case "warning":
        return "warning.main";
      case "error":
        return "error.main";
      case "info":
      default:
        return "info.main";
    }
  };

  const dismissNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, unread: false }))
    );
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100vw", sm: 400 },
          maxWidth: 400,
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          pt: "80px",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="h6" component="h2">
              Notifications
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{ color: "inherit" }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Header Actions Row: Unread Chip left, actions right */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              mb: 1,
            }}
          >
            {/* Unread Chip left-aligned */}
            <Chip
              label={`${unreadCount} unread`}
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "inherit",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            />
            {/* Actions right-aligned */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {unreadCount > 0 && (
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  onClick={markAllAsRead}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Mark all as read
                </Button>
              )}
              <Button
                variant="outlined"
                color={doNotDisturb.active ? "warning" : "inherit"}
                size="small"
                onClick={(e) => setDndMenuAnchor(e.currentTarget)}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                {doNotDisturb.active
                  ? doNotDisturb.until
                    ? `DND: ${dndCountdown} left`
                    : "DND: Permanent"
                  : "Do Not Disturb"}
              </Button>
              <Menu
                anchorEl={dndMenuAnchor}
                open={Boolean(dndMenuAnchor)}
                onClose={() => setDndMenuAnchor(null)}
              >
                <MenuItem onClick={() => handleSetDnd(30 * 60 * 1000)}>
                  30 minutes
                </MenuItem>
                <MenuItem onClick={() => handleSetDnd(60 * 60 * 1000)}>
                  1 hour
                </MenuItem>
                <MenuItem onClick={() => handleSetDnd(2 * 60 * 60 * 1000)}>
                  2 hours
                </MenuItem>
                <MenuItem onClick={() => handleSetDnd(null)}>
                  Permanently
                </MenuItem>
                {doNotDisturb.active && (
                  <MenuItem
                    onClick={handleCancelDnd}
                    sx={{ color: "error.main" }}
                  >
                    Disable DND
                  </MenuItem>
                )}
              </Menu>
            </Box>
          </Box>
        </Box>

        {/* Notifications List (scrollable area, includes DND alert) */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* DND Alert at top of list if active */}
          {doNotDisturb.active && (
            <Alert
              severity="warning"
              action={
                <Button color="inherit" size="small" onClick={handleCancelDnd}>
                  Disable
                </Button>
              }
              sx={{ mb: 2, flexShrink: 0 }}
            >
              Do Not Disturb is enabled.{" "}
              {doNotDisturb.until
                ? `New push notifications are paused for ${dndCountdown}.`
                : "Push notifications are paused permanently."}
            </Alert>
          )}
          {notifications.length === 0 ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
                textAlign: "center",
              }}
            >
              <NotificationsIcon
                sx={{
                  fontSize: 64,
                  color: "text.secondary",
                  mb: 2,
                }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You&apos;re all caught up! New notifications will appear here.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={0} sx={{ flex: 1 }}>
              {notifications.map((notification, index) => {
                const IconComponent = notification.icon;
                return (
                  <React.Fragment key={notification.id}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: 0,
                        bgcolor: notification.unread
                          ? "action.hover"
                          : "transparent",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        "&:hover": {
                          bgcolor: "action.selected",
                        },
                      }}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          {/* Notification Avatar */}
                          <Avatar
                            sx={{
                              bgcolor: getNotificationColor(notification.type),
                              width: 40,
                              height: 40,
                            }}
                          >
                            <IconComponent sx={{ fontSize: 20 }} />
                          </Avatar>

                          {/* Notification Content */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mb: 0.5,
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: notification.unread ? 600 : 400,
                                  color: "text.primary",
                                }}
                              >
                                {notification.title}
                              </Typography>
                              {notification.unread && (
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    bgcolor: "primary.main",
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                            </Box>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {notification.message}
                            </Typography>
                            {notification.articleTitle && (
                              <Typography
                                variant="caption"
                                sx={{ mb: 1, fontStyle: "italic" }}
                              >
                                {notification.articleTitle}
                              </Typography>
                            )}

                            <Box
                              sx={{
                                mt: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {notification.timestamp}
                              </Typography>

                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dismissNotification(notification.id);
                                }}
                                sx={{
                                  opacity: 0.6,
                                  transition: "opacity 0.2s",
                                  "&:hover": {
                                    opacity: 1,
                                    bgcolor: "action.hover",
                                  },
                                }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </Stack>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default NotificationCenter;
