"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useHeaderConfig } from "@/contexts/HeaderContext";
import { useAuth } from "@/components/auth/AuthProvider";
import { getUserManuscripts } from "@/services/dataService";
import type { ManuscriptWithUserRole } from "@/lib/supabase";

import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";

import ArticleIcon from "@mui/icons-material/Article";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function ArticleListingPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [manuscripts, setManuscripts] = React.useState<
    ManuscriptWithUserRole[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  // Configure header
  useHeaderConfig({
    logoAffix: "Reviewer Dashboard",
    containerProps: { maxWidth: "lg" },
  });

  // Fetch all manuscripts assigned to user
  React.useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;

      setLoading(true);
      try {
        const userManuscripts = await getUserManuscripts(user.id);
        setManuscripts(userManuscripts);
      } catch (error) {
        console.error("Error fetching manuscripts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const handleViewArticle = (manuscriptId: string) => {
    router.push(`/reviewer-dashboard/${manuscriptId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (manuscripts.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h1" fontWeight={600} sx={{ mb: 3 }}>
          My Articles
        </Typography>
        <Alert severity="info">
          No manuscripts assigned to you. Please contact an administrator.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={600} sx={{ mb: 1 }}>
          My Articles
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {manuscripts.length} manuscript{manuscripts.length !== 1 ? "s" : ""}{" "}
          assigned to you
        </Typography>
      </Box>

      {/* Manuscript Grid */}
      <Grid container spacing={3}>
        {manuscripts.map((manuscript) => {
          const daysOld = Math.floor(
            (Date.now() - new Date(manuscript.submission_date).getTime()) /
              (1000 * 60 * 60 * 24)
          );

          return (
            <Grid size={{ xs: 12, md: 6 }} key={manuscript.id}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: 2,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Manuscript ID and Status Chips */}
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{ mb: 2 }}
                  >
                    <Chip
                      label={`ID ${manuscript.id.split("-")[0]}`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={manuscript.status.replace("_", " ").toUpperCase()}
                      size="small"
                      color={
                        manuscript.status === "accepted"
                          ? "success"
                          : manuscript.status === "rejected"
                          ? "error"
                          : "primary"
                      }
                    />
                    {manuscript.user_role && (
                      <Chip
                        label={manuscript.user_role.toUpperCase()}
                        size="small"
                        color="secondary"
                      />
                    )}
                  </Stack>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    component="h2"
                    fontWeight={600}
                    sx={{
                      mb: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {manuscript.title}
                  </Typography>

                  {/* Authors */}
                  <Stack
                    direction="row"
                    spacing={0.5}
                    flexWrap="wrap"
                    sx={{ mb: 2 }}
                  >
                    {manuscript.authors.slice(0, 3).map((author, index) => (
                      <Chip
                        key={index}
                        label={author}
                        size="small"
                        variant="outlined"
                        sx={{ mb: 0.5 }}
                      />
                    ))}
                    {manuscript.authors.length > 3 && (
                      <Chip
                        label={`+${manuscript.authors.length - 3} more`}
                        size="small"
                        variant="outlined"
                        sx={{ mb: 0.5 }}
                      />
                    )}
                  </Stack>

                  {/* Metadata */}
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      <strong>Journal:</strong> {manuscript.journal}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      <strong>Subject:</strong> {manuscript.subject_area}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Submitted:</strong>{" "}
                      {new Date(manuscript.submission_date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}{" "}
                      ({daysOld} days ago)
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    endIcon={<ChevronRightIcon />}
                    onClick={() => handleViewArticle(manuscript.id)}
                    fullWidth
                  >
                    View Article
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
