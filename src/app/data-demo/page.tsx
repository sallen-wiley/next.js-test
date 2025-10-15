// Enhanced kitchen sink page with real data integration
"use client";
import * as React from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useArticles } from "@/hooks/useApi";

export default function KitchenSinkWithData() {
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [refreshKey, setRefreshKey] = React.useState(0);

  const { data, loading, error } = useArticles({
    page,
    limit: 10,
    search: searchTerm,
    refreshKey,
  });

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1); // Reset to first page on search
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid size={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Real Data Integration Demo
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            This page demonstrates real data integration with your prototype
          </Typography>
        </Grid>

        {/* Search and Controls */}
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <form onSubmit={handleSearch} style={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Search articles"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter title or abstract keywords..."
                />
              </form>
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
              >
                Search
              </Button>
              <IconButton
                onClick={handleRefresh}
                disabled={loading}
                color="primary"
              >
                <RefreshIcon />
              </IconButton>
            </Stack>
          </Paper>
        </Grid>

        {/* Error State */}
        {error && (
          <Grid size={12}>
            <Alert severity="error">
              <AlertTitle>Error Loading Data</AlertTitle>
              {error}
            </Alert>
          </Grid>
        )}

        {/* Loading State */}
        {loading && (
          <Grid size={12}>
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Loading articles...
              </Typography>
            </Paper>
          </Grid>
        )}

        {/* Data Table */}
        {data && !loading && (
          <Grid size={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Authors</TableCell>
                    <TableCell>Journal</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Citation Count</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.data.map((article) => (
                    <TableRow key={article.id} hover>
                      <TableCell>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {article.title}
                        </Typography>
                        {article.doi && (
                          <Typography variant="caption" color="text.secondary">
                            DOI: {article.doi}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack direction="column" spacing={0.5}>
                          {article.authors
                            ?.slice(0, 3)
                            .map(
                              (
                                author:
                                  | string
                                  | { name: string; author?: { name: string } },
                                index: number
                              ) => (
                                <Typography key={index} variant="body2">
                                  {typeof author === "string"
                                    ? author
                                    : author.author?.name || author.name}
                                </Typography>
                              )
                            )}
                          {article.authors?.length > 3 && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              +{article.authors.length - 3} more
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {article.journal}
                        </Typography>
                        {article.publication_date && (
                          <Typography variant="caption" color="text.secondary">
                            {new Date(article.publication_date).getFullYear()}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={article.status}
                          color={
                            article.status === "published"
                              ? "success"
                              : article.status === "in_review"
                              ? "warning"
                              : "default"
                          }
                          size="small"
                        />
                        {article.open_access && (
                          <Chip
                            label="Open Access"
                            color="info"
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {article.citation_count || 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {data.pagination && (
                <TablePagination
                  component="div"
                  count={data.pagination.total}
                  page={data.pagination.page - 1}
                  onPageChange={(_, newPage) => setPage(newPage + 1)}
                  rowsPerPage={data.pagination.limit}
                  onRowsPerPageChange={() => {}} // Could implement this
                  rowsPerPageOptions={[10]}
                />
              )}
            </TableContainer>
          </Grid>
        )}

        {/* Summary Stats */}
        {data && (
          <Grid size={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Data Summary
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="h4" color="primary">
                    {data.pagination.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Articles
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="h4" color="success.main">
                    {data.data.filter((a) => a.status === "published").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Published
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="h4" color="warning.main">
                    {data.data.filter((a) => a.status === "in_review").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Review
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="h4" color="info.main">
                    {data.data.filter((a) => a.open_access).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Open Access
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
