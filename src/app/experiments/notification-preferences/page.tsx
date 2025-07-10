"use client";
import { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormGroup,
  Button,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import Notification from "@/components/product/Notification";
import type { NotificationPreviewType } from "@/components/product/Notification";

// Notification type and settings interfaces
interface NotificationSetting {
  enabled: boolean;
  frequency: FrequencyOption;
  channel: DeliveryChannel;
}

type NotificationTypeKey =
  | "comments"
  | "mentions"
  | "replies"
  | "system"
  | "reminders";
type FrequencyOption = "Immediate" | "Daily Digest" | "Weekly";
type DeliveryChannel = "In-app" | "Email" | "Both";

const notificationTypes: { key: NotificationTypeKey; label: string }[] = [
  { key: "comments", label: "Comments" },
  { key: "mentions", label: "Mentions" },
  { key: "replies", label: "Replies" },
  { key: "system", label: "System Alerts" },
  { key: "reminders", label: "Reminders" },
];

const deliveryChannels: DeliveryChannel[] = ["In-app", "Email", "Both"];
const frequencyOptions: FrequencyOption[] = [
  "Immediate",
  "Daily Digest",
  "Weekly",
];

export default function NotificationPreferences() {
  const [settings, setSettings] = useState<
    Record<NotificationTypeKey, NotificationSetting>
  >(
    notificationTypes.reduce((acc, type) => {
      acc[type.key] = {
        enabled: true,
        frequency: "Immediate",
        channel: "Both",
      };
      return acc;
    }, {} as Record<NotificationTypeKey, NotificationSetting>)
  );
  const [quietHours, setQuietHours] = useState<{ start: string; end: string }>({
    start: "22:00",
    end: "07:00",
  });
  const [bulkEnabled, setBulkEnabled] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewType, setPreviewType] =
    useState<NotificationPreviewType | null>(null);

  const handleToggle =
    (key: NotificationTypeKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setSettings((prev) => ({
        ...prev,
        [key]: { ...prev[key], enabled: e.target.checked },
      }));
    };
  const handleFrequency =
    (key: NotificationTypeKey) =>
    (e: React.ChangeEvent<{ value: unknown }>) => {
      setSettings((prev) => ({
        ...prev,
        [key]: { ...prev[key], frequency: e.target.value as FrequencyOption },
      }));
    };
  const handleChannel =
    (key: NotificationTypeKey) =>
    (e: React.ChangeEvent<{ value: unknown }>) => {
      setSettings((prev) => ({
        ...prev,
        [key]: { ...prev[key], channel: e.target.value as DeliveryChannel },
      }));
    };
  const handleBulkToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBulkEnabled(e.target.checked);
    setSettings((prev) => {
      const updated = { ...prev };
      (Object.keys(updated) as NotificationTypeKey[]).forEach((k) => {
        updated[k].enabled = e.target.checked;
      });
      return updated;
    });
  };
  const handleQuietHours =
    (field: "start" | "end") => (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuietHours((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Notification Preferences
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Control how and when you receive notifications. Adjust preferences by
        type, frequency, channel, and more.
      </Typography>
      <Paper sx={{ p: 4, mt: 2 }}>
        <Stack spacing={3}>
          <FormControlLabel
            control={
              <Switch checked={bulkEnabled} onChange={handleBulkToggle} />
            }
            label="Enable all notifications"
          />
          <Divider />
          <Typography variant="h6">Notification Types sausage</Typography>
          <FormGroup>
            {notificationTypes.map((type) => (
              <Grid
                container
                alignItems="center"
                spacing={2}
                key={type.key}
                sx={{ mb: 1 }}
              >
                <Grid size={{ xs: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings[type.key].enabled}
                        onChange={handleToggle(type.key)}
                      />
                    }
                    label={type.label}
                  />
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <Select
                    value={settings[type.key].frequency}
                    onChange={(e) =>
                      handleFrequency(type.key)(
                        e as React.ChangeEvent<{ value: unknown }>
                      )
                    }
                    size="small"
                  >
                    {frequencyOptions.map((f) => (
                      <MenuItem value={f} key={f}>
                        {f}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <Select
                    value={settings[type.key].channel}
                    onChange={(e) =>
                      handleChannel(type.key)(
                        e as React.ChangeEvent<{ value: unknown }>
                      )
                    }
                    size="small"
                  >
                    {deliveryChannels.map((c) => (
                      <MenuItem value={c} key={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setPreviewType(type.key as NotificationPreviewType);
                      setPreviewOpen(true);
                    }}
                  >
                    Preview
                  </Button>
                </Grid>
              </Grid>
            ))}
          </FormGroup>
          <Divider />
          <Typography variant="h6">Quiet Hours</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Start"
              type="time"
              value={quietHours.start}
              onChange={handleQuietHours("start")}
              size="small"
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
            />
            <TextField
              label="End"
              type="time"
              value={quietHours.end}
              onChange={handleQuietHours("end")}
              size="small"
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
            />
          </Stack>
          <Divider />
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="primary">
              Save Changes
            </Button>
            <Button variant="outlined">Cancel</Button>
          </Stack>
          <Notification
            open={previewOpen && !!previewType}
            onClose={() => setPreviewOpen(false)}
            type={previewType || "info"}
          />
        </Stack>
      </Paper>
    </Container>
  );
}
