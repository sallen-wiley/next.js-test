import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseRounded";

export interface NotificationDrawerPreviewProps {
  notification: {
    type: "success" | "info" | "warning" | "error";
    title: string;
    message: string;
    timestamp?: string;
    icon: React.ElementType;
    unread?: boolean;
    articleTitle?: string;
  };
  onDismiss?: () => void;
}

const getNotificationColor = (type: string) => {
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

const NotificationDrawerPreview: React.FC<NotificationDrawerPreviewProps> = ({
  notification,
  onDismiss,
}) => {
  const IconComponent = notification.icon;
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        bgcolor: notification.unread ? "action.hover" : "background.paper",
        mb: 2,
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: getNotificationColor(notification.type),
              width: 40,
              height: 40,
            }}
          >
            <IconComponent sx={{ fontSize: 20 }} />
          </Avatar>
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
              <Typography variant="caption" sx={{ mb: 1, fontStyle: "italic" }}>
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
              <Typography variant="caption" color="text.secondary">
                {notification.timestamp}
              </Typography>
              {onDismiss && (
                <IconButton
                  size="small"
                  onClick={onDismiss}
                  sx={{
                    opacity: 0.6,
                    transition: "opacity 0.2s",
                    "&:hover": { opacity: 1, bgcolor: "action.hover" },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotificationDrawerPreview;
