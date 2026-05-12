"use client";
import React from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FolderIcon from "@mui/icons-material/Folder";
import PageviewIcon from "@mui/icons-material/Pageview";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { deepOrange, deepPurple, green, pink } from "@mui/material/colors";

const avatar1 = "https://mui.com/static/images/avatar/1.jpg";
const avatar2 = "https://mui.com/static/images/avatar/2.jpg";
const avatar3 = "https://mui.com/static/images/avatar/3.jpg";
const avatar4 = "https://mui.com/static/images/avatar/4.jpg";
const avatar5 = "https://mui.com/static/images/avatar/5.jpg";

export const AvatarsSection = React.memo(() => {
  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Avatars
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based avatar patterns for images, initials, icons, grouped users,
          and status indicators.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-avatar/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Avatar docs
          </Link>
          .
        </Typography>
      </Stack>

      <Grid container spacing={3} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ typography: "mono" as const }}
            >
              Core Patterns
            </Typography>

            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Image Avatars
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Avatar alt="Remy Sharp" src={avatar1} />
                  <Avatar alt="Travis Howard" src={avatar2} />
                  <Avatar alt="Cindy Baker" src={avatar3} />
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Letter Avatars
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Avatar>H</Avatar>
                  <Avatar sx={{ bgcolor: deepOrange[500] }}>N</Avatar>
                  <Avatar sx={{ bgcolor: deepPurple[500] }}>OP</Avatar>
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Icon Avatars
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                  <Avatar sx={{ bgcolor: pink[500] }}>
                    <PageviewIcon />
                  </Avatar>
                  <Avatar sx={{ bgcolor: green[500] }}>
                    <AssignmentIcon />
                  </Avatar>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Size + Variants + Fallback
              </Typography>

              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Size
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src={avatar1}
                      sx={{ width: 24, height: 24 }}
                    />
                    <Avatar alt="Remy Sharp" src={avatar1} />
                    <Avatar
                      alt="Remy Sharp"
                      src={avatar1}
                      sx={{ width: 56, height: 56 }}
                    />
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Variants
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <Avatar sx={{ bgcolor: deepOrange[500] }} variant="square">
                      N
                    </Avatar>
                    <Avatar sx={{ bgcolor: green[500] }} variant="rounded">
                      <AssignmentIcon />
                    </Avatar>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Fallback order
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <Avatar sx={{ bgcolor: deepOrange[500] }} alt="Remy Sharp">
                      B
                    </Avatar>
                    <Avatar
                      sx={{ bgcolor: deepOrange[500] }}
                      alt="Remy Sharp"
                    />
                    <Avatar />
                  </Stack>
                </Box>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Group + Badge
              </Typography>

              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Avatar group
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <AvatarGroup max={4}>
                      <Avatar alt="Remy Sharp" src={avatar1} />
                      <Avatar alt="Travis Howard" src={avatar2} />
                      <Avatar alt="Cindy Baker" src={avatar3} />
                      <Avatar alt="Agnes Walker" src={avatar4} />
                      <Avatar alt="Trevor Henderson" src={avatar5} />
                    </AvatarGroup>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total count
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <AvatarGroup total={24}>
                      <Avatar alt="Remy Sharp" src={avatar1} />
                      <Avatar alt="Travis Howard" src={avatar2} />
                      <Avatar alt="Agnes Walker" src={avatar4} />
                      <Avatar alt="Trevor Henderson" src={avatar5} />
                    </AvatarGroup>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Badge avatar
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      variant="dot"
                      color="success"
                    >
                      <Avatar alt="Remy Sharp" src={avatar1} />
                    </Badge>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      badgeContent={
                        <Avatar
                          alt="Small Avatar"
                          src={avatar1}
                          sx={{ width: 22, height: 22 }}
                        />
                      }
                    >
                      <Avatar alt="Travis Howard" src={avatar2} />
                    </Badge>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
});

AvatarsSection.displayName = "AvatarsSection";
