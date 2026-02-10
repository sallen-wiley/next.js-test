"use client";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Alert,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Autocomplete,
  TextField,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { createClient } from "@/utils/supabase/client";
import {
  ingestReviewerData,
  validateIngestionData,
  type IngestionData,
  type IngestionStats,
  type IngestionProgress,
} from "@/lib/ingestion/reviewerIngestion";
import { useHeaderConfig } from "@/contexts/HeaderContext";
import { getAllUsers } from "@/services";
import type { UserProfile } from "@/types/roles";
import type { Manuscript } from "@/lib/supabase";
import Link from "next/link";

export default function DataIngestionPage() {
  useHeaderConfig({
    logoAffix: "Data Ingestion",
    containerProps: { maxWidth: "lg" },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<IngestionProgress | null>(null);
  const [stats, setStats] = useState<IngestionStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedStatus, setSelectedStatus] =
    useState<Manuscript["status"]>("submitted");
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load users on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    loadUsers();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith(".json")) {
        setError("Please select a JSON file (.json)");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
      setError(null);
      setStats(null);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      // Simulate file input change
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        handleFileSelect({
          target: fileInputRef.current,
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);
    setStats(null);
    setProgress(null);

    try {
      // Read file
      const fileContent = await selectedFile.text();
      const data = JSON.parse(fileContent);

      // Validate structure
      validateIngestionData(data);

      // Get Supabase client (uses user's auth token + RLS)
      const supabase = createClient();

      // Ingest data with progress callback (pass selected status)
      const result = await ingestReviewerData(
        supabase,
        data as IngestionData,
        (progress) => {
          setProgress(progress);
        },
        selectedStatus, // Pass the selected status
      );

      // If user selected, assign manuscript to user
      if (selectedUserId && result.manuscriptId) {
        try {
          // Check if assignment already exists
          const { data: existing } = await supabase
            .from("user_manuscripts")
            .select("id, is_active")
            .eq("user_id", selectedUserId)
            .eq("manuscript_id", result.manuscriptId)
            .maybeSingle();

          if (existing?.is_active) {
            console.log("User already assigned to this manuscript");
          } else if (existing && !existing.is_active) {
            // Reactivate existing assignment
            await supabase
              .from("user_manuscripts")
              .update({
                is_active: true,
                role: "editor",
                updated_at: new Date().toISOString(),
              })
              .eq("id", existing.id);
          } else {
            // Create new assignment
            await supabase.from("user_manuscripts").insert({
              user_id: selectedUserId,
              manuscript_id: result.manuscriptId,
              role: "editor",
              assigned_date: new Date().toISOString(),
              is_active: true,
            });
          }
        } catch (assignErr) {
          console.error("Failed to assign user to manuscript:", assignErr);
          // Don't fail the whole operation if assignment fails
        }
      }

      setStats(result);
      setSelectedFile(null);
      setSelectedUserId(""); // Reset user selection
      setSelectedStatus("submitted"); // Reset status
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const getProgressPercent = () => {
    if (!progress) return 0;
    if (progress.phase === "manuscript") return 10;
    if (progress.phase === "complete") return 100;
    if (progress.currentReviewer && progress.totalReviewers) {
      return 10 + (progress.currentReviewer / progress.totalReviewers) * 90;
    }
    return 0;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Reviewer Data Ingestion
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Upload a JSON file containing manuscript and reviewer suggestions data.
        The system will automatically process and import the data into the
        database.
      </Typography>

      {/* File Upload Area */}
      <Paper
        variant="outlined"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        sx={{
          p: 4,
          textAlign: "center",
          borderStyle: "dashed",
          borderWidth: 2,
          borderColor: selectedFile ? "primary.main" : "divider",
          bgcolor: selectedFile ? "action.hover" : "background.paper",
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "action.hover",
          },
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        <UploadFileIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />

        {selectedFile ? (
          <>
            <Typography variant="h6" gutterBottom>
              {selectedFile.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Drop JSON file here or click to select
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Maximum file size: 10MB
            </Typography>
          </>
        )}
      </Paper>

      {/* Configuration Options */}
      {selectedFile && !isProcessing && (
        <Stack spacing={2} sx={{ mt: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="status-select-label">Manuscript Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={selectedStatus}
              label="Manuscript Status"
              onChange={(e) =>
                setSelectedStatus(e.target.value as Manuscript["status"])
              }
            >
              <MenuItem value="submitted">Submitted</MenuItem>
              <MenuItem value="pending_editor_assignment">
                Pending Editor Assignment
              </MenuItem>
              <MenuItem value="awaiting_reviewers">Awaiting Reviewers</MenuItem>
              <MenuItem value="under_review">Under Review</MenuItem>
              <MenuItem value="reviews_in_progress">
                Reviews In Progress
              </MenuItem>
              <MenuItem value="reviews_complete">Reviews Complete</MenuItem>
              <MenuItem value="revision_required">Revision Required</MenuItem>
              <MenuItem value="minor_revision">Minor Revision</MenuItem>
              <MenuItem value="major_revision">Major Revision</MenuItem>
              <MenuItem value="conditionally_accepted">
                Conditionally Accepted
              </MenuItem>
              <MenuItem value="accepted">Accepted</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="desk_rejected">Desk Rejected</MenuItem>
              <MenuItem value="withdrawn">Withdrawn</MenuItem>
            </Select>
            <FormHelperText>
              Set the initial status for the manuscript
            </FormHelperText>
          </FormControl>

          <Autocomplete
            options={users}
            getOptionLabel={(option) => option.full_name || option.email}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={users.find((u) => u.id === selectedUserId) || null}
            onChange={(_, newValue) => setSelectedUserId(newValue?.id || "")}
            disabled={isLoadingUsers}
            renderOption={(props, option) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { key, ...otherProps } =
                props as React.HTMLAttributes<HTMLLIElement> & {
                  key: string;
                };
              return (
                <li key={option.id} {...otherProps}>
                  <Box>
                    <Typography variant="body2">
                      {option.full_name || option.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.email} • {option.role}
                    </Typography>
                  </Box>
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assign to User (Optional)"
                placeholder={
                  isLoadingUsers ? "Loading users..." : "Search users..."
                }
                helperText={
                  isLoadingUsers
                    ? "Loading users..."
                    : "Assign manuscript to a user as editor"
                }
              />
            )}
            fullWidth
          />
        </Stack>
      )}

      {/* Upload Button */}
      {selectedFile && !isProcessing && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleUpload}
            disabled={isProcessing}
          >
            Upload and Process
          </Button>
        </Box>
      )}

      {/* Progress */}
      {isProcessing && progress && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" gutterBottom>
            {progress.message}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={getProgressPercent()}
            sx={{ height: 8, borderRadius: 1 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            {Math.round(getProgressPercent())}% complete
          </Typography>
        </Box>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" icon={<ErrorIcon />} sx={{ mt: 3 }}>
          <Typography variant="body2" fontWeight="medium">
            Error
          </Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      )}

      {/* Success Stats */}
      {stats && (
        <Alert
          severity={stats.errors.length > 0 ? "warning" : "success"}
          icon={<CheckCircleIcon />}
          sx={{ mt: 3 }}
        >
          <Typography variant="body2" fontWeight="medium" gutterBottom>
            Ingestion Complete
          </Typography>
          <Button
            component={Link}
            href={`/reviewer-dashboard/${stats.manuscriptId}`}
            variant="outlined"
            size="small"
            endIcon={<OpenInNewIcon />}
            sx={{ mb: 2 }}
          >
            View Manuscript
          </Button>
          <List dense disablePadding>
            <ListItem disablePadding>
              <ListItemText
                primary={`Manuscripts: ${stats.manuscriptsProcessed}`}
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                primary={`Reviewers: ${stats.reviewersProcessed}`}
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                primary={`Matches: ${stats.matchesCreated}`}
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                primary={`Publications: ${stats.publicationsInserted}`}
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            {stats.retractionsInserted > 0 && (
              <ListItem disablePadding>
                <ListItemText
                  primary={`Retractions: ${stats.retractionsInserted}`}
                  primaryTypographyProps={{ variant: "body2" }}
                />
              </ListItem>
            )}
          </List>

          {stats.errors.length > 0 && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="body2"
                fontWeight="medium"
                color="error"
                gutterBottom
              >
                Errors ({stats.errors.length}):
              </Typography>
              <Stack spacing={0.5}>
                {stats.errors.map((err, i) => (
                  <Typography key={i} variant="caption" color="error">
                    • {err.reviewer}: {err.error}
                  </Typography>
                ))}
              </Stack>
            </>
          )}
        </Alert>
      )}

      {/* Instructions */}
      <Paper sx={{ mt: 4, p: 3, bgcolor: "background.default" }}>
        <Typography variant="h6" gutterBottom>
          File Format
        </Typography>
        <Typography variant="body2" paragraph>
          The JSON file should contain:
        </Typography>
        <Box component="pre" sx={{ fontSize: "0.75rem", overflow: "auto" }}>
          {`{
  "manuscriptData": {
    "systemId": "...",
    "title": "...",
    "authors": [...],
    ...
  },
  "reviewers": [
    {
      "email": "...",
      "givenNames": "...",
      "surname": "...",
      "score": 0.95,
      ...
    }
  ]
}`}
        </Box>
      </Paper>
    </Container>
  );
}
