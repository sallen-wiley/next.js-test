import React from "react";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
} from "@mui/material";

export default function ArticleCard() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  return (
    <Paper elevation={3} sx={{ borderLeft: 4, borderColor: "error.main" }}>
      {/* Alert */}
      <Alert severity="info">This article is in draft status</Alert>
      {/* Header */}
      <Grid container sx={{ p: 4 }} spacing={4}>
        {/* cover */}
        <Grid size="auto">
          <Skeleton variant="rectangular" width={130} height={170} />
        </Grid>
        {/* Title and actions */}
        <Grid size="grow">
          <Stack spacing={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Link
                href="#"
                variant="h5"
                color="inherit"
                underline="hover"
                sx={{
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Article Title
              </Link>
              <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                slotProps={{
                  paper: {
                    sx: {
                      overflow: "visible",
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        transform: "translate(-50%, -50%) rotate(45deg)",
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        zIndex: 0,
                      },
                    },
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    /* Manage submission */ setAnchorEl(null);
                  }}
                >
                  <ListItemIcon>
                    <ArrowForwardRoundedIcon />
                  </ListItemIcon>
                  <ListItemText>Manage submission</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    /* Delete submission */ setAnchorEl(null);
                  }}
                >
                  <ListItemIcon>
                    <DeleteOutlineRoundedIcon />
                  </ListItemIcon>
                  <ListItemText>Delete submission</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
            {/* Chips row */}
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip
                label="In revision"
                color="info"
                variant="outlined"
                size="small"
              />
              <Chip label="Revision 2" variant="outlined" size="small" />
            </Stack>
            {/* Metadata Groups */}
            <Stack direction="column" spacing={0.5}>
              {/* Article Data */}
              <Stack
                direction="row"
                useFlexGap
                sx={{ flexWrap: "wrap", columnGap: 2, rowGap: 0.5 }}
              >
                <Typography variant="body2">
                  Manuscript ID: <b>1ab23c4d5g</b>
                </Typography>
                <Typography variant="body2">
                  Article type: <b>Original Research</b>
                </Typography>
                <Typography variant="body2">
                  DOI: <b>10.1002/ddr.88849</b>
                </Typography>
                <Typography variant="body2">
                  DOI Link:{" "}
                  <Link
                    sx={{ fontWeight: "bold" }}
                    href="https://doi.org/10.1002/ddr.88849"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://doi.org/10.1002/ddr.88849
                  </Link>
                </Typography>
              </Stack>
              {/* Publication Data */}
              <Stack
                direction="row"
                useFlexGap
                sx={{ flexWrap: "wrap", columnGap: 2, rowGap: 0.5 }}
              >
                <Typography variant="body2">
                  Publication: <b>Journal of Camouflage Genetics</b>
                </Typography>
                <Typography variant="body2">
                  Issue: <b>Volume 21, Issue 12</b>
                </Typography>
              </Stack>
              {/* Author Data */}
              <Stack
                direction="row"
                useFlexGap
                sx={{ flexWrap: "wrap", columnGap: 2, rowGap: 0.5 }}
              >
                <Typography variant="body2">
                  Submission owner: <b>Mark Massives</b>
                </Typography>
                <Typography variant="body2">
                  Responsible corresponding author: <b>Mark Massives</b>
                </Typography>
              </Stack>
            </Stack>
            <Divider sx={{ my: 2 }} />
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}
