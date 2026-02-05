"use client";

import { useState } from "react";
import {
  Button,
  Container,
  Typography,
  Alert,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  Chip,
  Card,
  CardContent,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { createClient } from "@/utils/supabase/client";
import {
  findManuscript,
  analyzeCleanupImpact,
  deleteManuscriptData,
  type ImpactAnalysis,
  type CleanupProgress,
} from "@/lib/cleanup/manuscriptCleanup";
import { useHeaderConfig } from "@/contexts/HeaderContext";

export default function DataCleanupPage() {
  useHeaderConfig({
    logoAffix: "Data Cleanup",
    containerProps: { maxWidth: "lg" },
  });

  const [identifier, setIdentifier] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [analysis, setAnalysis] = useState<ImpactAnalysis | null>(null);
  const [progress, setProgress] = useState<CleanupProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteComplete, setDeleteComplete] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleAnalyze = async () => {
    if (!identifier.trim()) {
      setError("Please enter a manuscript identifier");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);
    setDeleteComplete(false);

    try {
      const supabase = createClient();

      // Find manuscript
      setProgress({
        phase: "analyzing",
        message: "Finding manuscript...",
      });

      const manuscript = await findManuscript(supabase, identifier.trim());

      if (!manuscript) {
        setError(`Manuscript not found: ${identifier}`);
        setIsAnalyzing(false);
        setProgress(null);
        return;
      }

      // Analyze impact
      const result = await analyzeCleanupImpact(
        supabase,
        manuscript.id!,
        (progress) => {
          setProgress(progress);
        },
      );

      setAnalysis(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsAnalyzing(false);
      setProgress(null);
    }
  };

  const handleDelete = async () => {
    if (!analysis) return;

    setConfirmDialogOpen(false);
    setIsDeleting(true);
    setError(null);

    try {
      const supabase = createClient();
      const reviewerIds = analysis.reviewers.map((r) => r.id);

      await deleteManuscriptData(
        supabase,
        analysis.manuscript.id!,
        reviewerIds,
        (progress) => {
          setProgress(progress);
        },
      );

      setDeleteComplete(true);
      setAnalysis(null);
      setIdentifier("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsDeleting(false);
      setProgress(null);
    }
  };

  const totalRecords = analysis
    ? analysis.stats.manuscripts +
      analysis.stats.reviewers +
      analysis.stats.reviewerMatchesAcrossManuscripts +
      analysis.stats.publications +
      analysis.stats.retractions +
      analysis.stats.reviewInvitations +
      analysis.stats.invitationQueue +
      analysis.stats.userManuscripts +
      analysis.stats.publicationMatches
    : 0;

  const hasSharedReviewers = (analysis?.sharedReviewers.length || 0) > 0;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Manuscript Data Cleanup
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Remove a manuscript and all related reviewer data from the database.
        This operation will reverse a data ingestion.
      </Typography>

      {/* Search */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Manuscript Identifier"
            placeholder="Enter custom_id, system_id, submission_id, or UUID"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={isAnalyzing || isDeleting}
            helperText="Examples: 7832738, a1b2c3d4-e5f6-7890-abcd-ef1234567890"
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleAnalyze}
            disabled={isAnalyzing || isDeleting || !identifier.trim()}
            fullWidth
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Impact"}
          </Button>
        </Stack>
      </Paper>

      {/* Progress */}
      {(isAnalyzing || isDeleting) && progress && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            {progress.message}
          </Typography>
          <LinearProgress sx={{ mt: 1 }} />
        </Paper>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" icon={<WarningIcon />} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Success */}
      {deleteComplete && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight="medium">
            Cleanup Complete
          </Typography>
          <Typography variant="body2">
            All data has been successfully deleted.
          </Typography>
        </Alert>
      )}

      {/* Impact Analysis Results */}
      {analysis && !deleteComplete && (
        <Stack spacing={3}>
          {/* Manuscript Info */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Manuscript Found
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {analysis.manuscript.title}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {analysis.manuscript.custom_id && (
                  <Chip
                    label={`ID: ${analysis.manuscript.custom_id}`}
                    size="small"
                  />
                )}
                {analysis.manuscript.system_id && (
                  <Chip
                    label={`System: ${analysis.manuscript.system_id.substring(
                      0,
                      8,
                    )}...`}
                    size="small"
                  />
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Shared Reviewers Warning */}
          {hasSharedReviewers && (
            <Alert severity="warning" icon={<WarningIcon />}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                ⚠️ Cross-Manuscript Impact Detected
              </Typography>
              <Typography variant="body2">
                {analysis.sharedReviewers.length} reviewer
                {analysis.sharedReviewers.length === 1 ? " is" : "s are"} also
                matched to other manuscripts. Deleting will remove their data
                across all manuscripts.
              </Typography>
            </Alert>
          )}

          {/* Deletion Statistics */}
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Deletion Impact
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Manuscripts
                </Typography>
                <Typography variant="h6">
                  {analysis.stats.manuscripts}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Reviewers
                </Typography>
                <Typography variant="h6">{analysis.stats.reviewers}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Publications
                </Typography>
                <Typography variant="h6">
                  {analysis.stats.publications}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Reviewer Matches
                </Typography>
                <Typography variant="h6">
                  {analysis.stats.reviewerMatchesAcrossManuscripts}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Invitations
                </Typography>
                <Typography variant="h6">
                  {analysis.stats.reviewInvitations}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Queue Entries
                </Typography>
                <Typography variant="h6">
                  {analysis.stats.invitationQueue}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" color="error">
              Total Records: {totalRecords}
            </Typography>
          </Paper>

          {/* Reviewers List */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                Reviewers ({analysis.reviewers.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {analysis.reviewers.map((reviewer, index) => {
                  const isShared = analysis.sharedReviewers.some(
                    (sr) => sr.id === reviewer.id,
                  );
                  return (
                    <ListItem
                      key={reviewer.id}
                      sx={{
                        bgcolor: isShared ? "warning.lighter" : "transparent",
                      }}
                    >
                      <ListItemText
                        primary={
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography variant="body2">
                              {index + 1}. {reviewer.name}
                            </Typography>
                            {isShared && (
                              <Chip
                                label="Shared"
                                size="small"
                                color="warning"
                              />
                            )}
                          </Stack>
                        }
                        secondary={
                          <>
                            {reviewer.email}
                            {reviewer.affiliation &&
                              ` • ${reviewer.affiliation}`}
                          </>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </AccordionDetails>
          </Accordion>

          {/* Shared Reviewers Detail */}
          {hasSharedReviewers && (
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" color="warning.main">
                  Shared Reviewers ({analysis.sharedReviewers.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
                  These reviewers are matched to multiple manuscripts. Deleting
                  will affect the manuscripts listed below.
                </Alert>
                <List>
                  {analysis.sharedReviewers.map((reviewer) => (
                    <Paper
                      key={reviewer.id}
                      variant="outlined"
                      sx={{ p: 2, mb: 2 }}
                    >
                      <Typography variant="body1" fontWeight="medium">
                        {reviewer.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {reviewer.email}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" fontWeight="medium">
                        Also matched to:
                      </Typography>
                      <List dense>
                        {reviewer.otherManuscripts.map((ms) => (
                          <ListItem key={ms.id}>
                            <ListItemText
                              primary={ms.title}
                              secondary={
                                ms.custom_id ? `ID: ${ms.custom_id}` : undefined
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Delete Button */}
          <Button
            variant="contained"
            color="error"
            size="large"
            startIcon={<DeleteIcon />}
            onClick={() => setConfirmDialogOpen(true)}
            disabled={isDeleting}
            fullWidth
          >
            Delete All Data
          </Button>
        </Stack>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to permanently delete:
          </DialogContentText>
          <List dense sx={{ my: 2 }}>
            <ListItem>
              <ListItemText primary={`${totalRecords} total records`} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`${analysis?.stats.reviewers} reviewers (including all their data)`}
              />
            </ListItem>
            {hasSharedReviewers && (
              <ListItem>
                <ListItemText
                  primary={`${analysis?.sharedReviewers.length} shared reviewers (affects other manuscripts)`}
                  primaryTypographyProps={{ color: "error" }}
                />
              </ListItem>
            )}
          </List>
          <DialogContentText color="error" fontWeight="medium">
            ⚠️ This action cannot be undone!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
