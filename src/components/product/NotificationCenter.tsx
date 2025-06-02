import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Chip,
  Divider,
  Badge,
  Fab,
  Avatar,
  Stack,
  Button,
} from "@mui/material";
import {
  CloseRounded as CloseIcon,
  NotificationsRounded as NotificationsIcon,
  InfoRounded as InfoIcon,
  WarningRounded as WarningIcon,
  PersonRounded as PersonIcon,
  EmailRounded as EmailIcon,
  SecurityRounded as SecurityIcon,
} from "@mui/icons-material";

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
}

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, unread: false }))
    );
  };

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        onClick={() => setIsOpen(true)}
        sx={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </Fab>

      {/* Notification Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
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
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "primary.main",
              color: "primary.contrastText",
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
                onClick={() => setIsOpen(false)}
                sx={{ color: "inherit" }}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {notifications.length > 0 && (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label={`${unreadCount} unread`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "inherit",
                    fontSize: "0.75rem",
                  }}
                />
                {unreadCount > 0 && (
                  <Chip
                    label="Mark all read"
                    size="small"
                    onClick={markAllAsRead}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.1)",
                      color: "inherit",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.2)",
                      },
                    }}
                  />
                )}
              </Box>
            )}
          </Box>

          {/* Notifications List */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
            }}
          >
            {notifications.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
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
              <Stack spacing={0}>
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
                                bgcolor: getNotificationColor(
                                  notification.type
                                ),
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
                                  mb: 1,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {notification.message}
                              </Typography>

                              <Box
                                sx={{
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

          {/* Footer Actions */}
          {notifications.length > 0 && (
            <Box
              sx={{
                p: 2,
                borderTop: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={clearAllNotifications}
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Clear All
                </Button>
                <Button
                  color="success"
                  size="medium"
                  variant="contained"
                  endIcon={<InfoIcon />}
                >
                  Confirm
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default NotificationCenter;
