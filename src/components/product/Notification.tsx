import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import WarningIcon from "@mui/icons-material/WarningAmberOutlined";
import ErrorIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTimeOutlined";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import PersonIcon from "@mui/icons-material/PersonOutline";
import Stack from "@mui/material/Stack";

export type NotificationPreviewType =
  | "comments"
  | "mentions"
  | "replies"
  | "system"
  | "reminders"
  | "success"
  | "info"
  | "warning"
  | "error";

interface NotificationPreviewProps {
  open: boolean;
  onClose: () => void;
  type: NotificationPreviewType;
  title?: string;
  message?: string;
}

const notificationExamples: Record<
  NotificationPreviewType,
  {
    severity: AlertColor;
    icon: React.ReactNode;
    title: string;
    message: string;
  }
> = {
  comments: {
    severity: "info",
    icon: <InfoIcon fontSize="inherit" />,
    title: "New Comment",
    message: "You have a new comment on your article.",
  },
  mentions: {
    severity: "info",
    icon: <PersonIcon fontSize="inherit" />,
    title: "Mentioned",
    message: "You were mentioned in a discussion.",
  },
  replies: {
    severity: "info",
    icon: <EmailIcon fontSize="inherit" />,
    title: "New Reply",
    message: "Someone replied to your comment.",
  },
  system: {
    severity: "warning",
    icon: <WarningIcon fontSize="inherit" />,
    title: "System Alert",
    message: "Scheduled maintenance tonight from 2-4 AM.",
  },
  reminders: {
    severity: "info",
    icon: <AccessTimeIcon fontSize="inherit" />,
    title: "Reminder",
    message: "Don't forget to submit your review by tomorrow.",
  },
  success: {
    severity: "success",
    icon: <CheckCircleIcon fontSize="inherit" />,
    title: "Success!",
    message: "Your changes have been saved.",
  },
  info: {
    severity: "info",
    icon: <InfoIcon fontSize="inherit" />,
    title: "Information",
    message: "This is an informational notification.",
  },
  warning: {
    severity: "warning",
    icon: <WarningIcon fontSize="inherit" />,
    title: "Warning",
    message: "Please check your input.",
  },
  error: {
    severity: "error",
    icon: <ErrorIcon fontSize="inherit" />,
    title: "Error",
    message: "Something went wrong. Please try again.",
  },
};

const Notification: React.FC<NotificationPreviewProps> = ({
  open,
  onClose,
  type,
  title,
  message,
}) => {
  const {
    severity,
    icon,
    title: defaultTitle,
    message: defaultMessage,
  } = notificationExamples[type];
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={onClose}
        severity={severity}
        icon={icon}
        sx={{ minWidth: 320 }}
      >
        <Stack>
          <strong>{title || defaultTitle}</strong>
          <span>{message || defaultMessage}</span>
        </Stack>
      </MuiAlert>
    </Snackbar>
  );
};

export default Notification;
