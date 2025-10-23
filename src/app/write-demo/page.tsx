"use client";
import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Stack,
  Alert,
  CircularProgress,
  Divider,
  Grid,
} from "@mui/material";
import { useCreateArticle } from "@/hooks/useMutations";
import { useArticles } from "@/hooks/useApi";
import { useRoleAccess } from "@/hooks/useRoles";

export default function WriteOperationsDemo() {
  const [refreshKey, setRefreshKey] = useState(0);
  const createMutation = useCreateArticle();
  const { data: articles, loading: articlesLoading } = useArticles({
    page: 1,
    limit: 5,
    refreshKey,
  });
  const { profile, requiresRole } = useRoleAccess();

  // Check if user can perform write operations
  const canWriteArticles = requiresRole(["admin", "designer"]);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    journal: "",
    abstract: "",
    keywords: "",
    status: "submitted" as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createMutation.createArticle({
        ...formData,
        authors: formData.authors.split(",").map((a) => a.trim()),
        keywords: formData.keywords
          ? formData.keywords.split(",").map((k) => k.trim())
          : [],
      });

      // Clear form
      setFormData({
        title: "",
        authors: "",
        journal: "",
        abstract: "",
        keywords: "",
        status: "submitted",
      });

      // Refresh articles list
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to create article:", error);
    }
  };

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Write Operations Demo
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        This demonstrates create operations working with both mock and real data
        modes.
      </Typography>

      {/* Role and Permission Info */}
      <Paper sx={{ p: 2, mb: 4, bgcolor: "background.default" }}>
        <Typography variant="h6" gutterBottom>
          Access Control Status
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Current Role:</strong> {profile?.role || "Not authenticated"}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Write Permission:</strong>{" "}
          {canWriteArticles ? (
            <span style={{ color: "green" }}>✓ Granted (Admin/Designer)</span>
          ) : (
            <span style={{ color: "red" }}>✗ Denied</span>
          )}
        </Typography>
        {!canWriteArticles && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Only users with <strong>admin</strong> or <strong>designer</strong>{" "}
            roles can create, update, or delete articles.
            {!profile && " Please log in to access write operations."}
          </Alert>
        )}
      </Paper>

      <Grid container spacing={4}>
        {/* Create Article Form */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Create New Article
            </Typography>

            {createMutation.success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Article created successfully!
              </Alert>
            )}

            {createMutation.error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Error: {createMutation.error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Title"
                  value={formData.title}
                  onChange={handleChange("title")}
                  required
                  fullWidth
                  disabled={!canWriteArticles}
                />

                <TextField
                  label="Authors (comma-separated)"
                  value={formData.authors}
                  onChange={handleChange("authors")}
                  required
                  fullWidth
                  placeholder="Dr. Jane Smith, Prof. John Doe"
                  disabled={!canWriteArticles}
                />

                <TextField
                  label="Journal"
                  value={formData.journal}
                  onChange={handleChange("journal")}
                  required
                  fullWidth
                  disabled={!canWriteArticles}
                />

                <TextField
                  label="Abstract"
                  value={formData.abstract}
                  onChange={handleChange("abstract")}
                  required
                  fullWidth
                  multiline
                  rows={4}
                  disabled={!canWriteArticles}
                />

                <TextField
                  label="Keywords (comma-separated)"
                  value={formData.keywords}
                  onChange={handleChange("keywords")}
                  fullWidth
                  placeholder="machine learning, AI, research"
                  disabled={!canWriteArticles}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    !canWriteArticles ||
                    createMutation.loading ||
                    !formData.title ||
                    !formData.authors
                  }
                  startIcon={
                    createMutation.loading ? (
                      <CircularProgress size={20} />
                    ) : null
                  }
                >
                  {createMutation.loading
                    ? "Creating..."
                    : canWriteArticles
                    ? "Create Article"
                    : "Access Denied"}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>

        {/* Recent Articles */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Articles
            </Typography>

            {articlesLoading ? (
              <Stack alignItems="center" sx={{ py: 4 }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Loading articles...
                </Typography>
              </Stack>
            ) : articles?.data ? (
              <Stack spacing={2}>
                {articles.data.map((article, index) => (
                  <Paper
                    key={article.id || index}
                    variant="outlined"
                    sx={{ p: 2 }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      {article.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Array.isArray(article.authors)
                        ? article.authors.join(", ")
                        : article.authors}
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      {article.journal} • {article.status}
                    </Typography>
                  </Paper>
                ))}

                <Divider />

                <Typography variant="caption" color="text.secondary">
                  Showing {articles.data.length} of{" "}
                  {articles.pagination?.total || 0} articles
                </Typography>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No articles found
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Technical Info */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: "background.default" }}>
        <Typography variant="h6" gutterBottom>
          How This Works
        </Typography>
        <Typography variant="body2" paragraph>
          • <strong>Role-Based Access</strong>: Only admin and designer roles
          can create/update/delete articles
        </Typography>
        <Typography variant="body2" paragraph>
          • <strong>API Authorization</strong>: Server-side role checking on all
          write endpoints
        </Typography>
        <Typography variant="body2" paragraph>
          • <strong>Database Policies</strong>: Row-level security enforces
          permissions at the database level
        </Typography>
        <Typography variant="body2" paragraph>
          • <strong>Mock Mode</strong>: Creates articles in memory (resets on
          server restart)
        </Typography>
        <Typography variant="body2" paragraph>
          • <strong>Real Mode</strong>: Creates articles in Supabase database
          with full authentication
        </Typography>
        <Typography variant="body2" paragraph>
          • <strong>Environment Toggle</strong>: Controlled by{" "}
          <code>USE_MOCK_DATA</code> environment variable
        </Typography>
        <Typography variant="body2">
          • <strong>Type Safety</strong>: Full TypeScript validation for all
          operations
        </Typography>
      </Paper>
    </Container>
  );
}
