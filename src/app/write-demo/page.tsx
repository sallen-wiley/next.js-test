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

export default function WriteOperationsDemo() {
  const [refreshKey, setRefreshKey] = useState(0);
  const createMutation = useCreateArticle();
  const { data: articles, loading: articlesLoading } = useArticles({
    page: 1,
    limit: 5,
    refreshKey,
  });

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
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        This demonstrates create operations working with both mock and real data
        modes.
      </Typography>

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
                />

                <TextField
                  label="Authors (comma-separated)"
                  value={formData.authors}
                  onChange={handleChange("authors")}
                  required
                  fullWidth
                  placeholder="Dr. Jane Smith, Prof. John Doe"
                />

                <TextField
                  label="Journal"
                  value={formData.journal}
                  onChange={handleChange("journal")}
                  required
                  fullWidth
                />

                <TextField
                  label="Abstract"
                  value={formData.abstract}
                  onChange={handleChange("abstract")}
                  required
                  fullWidth
                  multiline
                  rows={4}
                />

                <TextField
                  label="Keywords (comma-separated)"
                  value={formData.keywords}
                  onChange={handleChange("keywords")}
                  fullWidth
                  placeholder="machine learning, AI, research"
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={
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
                  {createMutation.loading ? "Creating..." : "Create Article"}
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
          • <strong>Mock Mode</strong>: Creates articles in memory (resets on
          server restart)
        </Typography>
        <Typography variant="body2" paragraph>
          • <strong>Real Mode</strong>: Will create articles in Supabase
          database when configured
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
