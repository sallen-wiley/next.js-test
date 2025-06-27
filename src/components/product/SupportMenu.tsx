import React, { useState } from "react";
import {
  Fab,
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/CloseRounded";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import AccordionActions from "@mui/material/AccordionActions";
import LiveChat from "./LiveChat";

const SupportMenu = () => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      {!showChat && (
        <Fab
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
          aria-label="Open support menu"
        >
          <HelpOutlineIcon />
        </Fab>
      )}

      {/* Support Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100vw", sm: 360 },
            maxWidth: 360,
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            pt: "80px",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" component="h2">
                Support
              </Typography>
              <IconButton
                onClick={() => setOpen(false)}
                sx={{ color: "inherit" }}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Support Content */}
          <Box
            sx={{
              flex: 1,
              p: 3,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Contact Support CTA at the top */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2 }}
              onClick={() => {
                setOpen(false);
                setShowChat(true);
              }}
            >
              Contact Support (Live Chat)
            </Button>

            {/* Accordions Grouped Together */}
            <Box>
              {/* Help Center Accordion */}
              <Accordion
                expanded={expanded === "panel1"}
                onChange={(_, isExpanded) =>
                  setExpanded(isExpanded ? "panel1" : false)
                }
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography component="span">Help Center</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2">
                        How to Reset Your Password
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Step-by-step guide to securely reset your account
                        password.
                      </Typography>
                      <Button size="small" variant="text">
                        Read article
                      </Button>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">
                        Getting Started with the Dashboard
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Learn the basics of navigating and customizing your
                        dashboard.
                      </Typography>
                      <Button size="small" variant="text">
                        Read article
                      </Button>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">
                        Managing Notifications
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Tips for controlling and personalizing your notification
                        settings.
                      </Typography>
                      <Button size="small" variant="text">
                        Read article
                      </Button>
                    </Box>
                  </Stack>
                </AccordionDetails>
                <AccordionActions>
                  <Button size="small">All help articles</Button>
                </AccordionActions>
              </Accordion>

              {/* Submit Feedback Accordion */}
              <Accordion
                expanded={expanded === "panel2"}
                onChange={(_, isExpanded) =>
                  setExpanded(isExpanded ? "panel2" : false)
                }
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <Typography component="span">Submit Feedback</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      label="Your Feedback"
                      multiline
                      minRows={3}
                      fullWidth
                    />
                  </Stack>
                </AccordionDetails>
                <AccordionActions>
                  <Button>Cancel</Button>
                  <Button variant="contained" color="secondary">
                    Send Feedback
                  </Button>
                </AccordionActions>
              </Accordion>

              {/* Release Notes Accordion */}
              <Accordion
                expanded={expanded === "panel3"}
                onChange={(_, isExpanded) =>
                  setExpanded(isExpanded ? "panel3" : false)
                }
                defaultExpanded
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3-content"
                  id="panel3-header"
                >
                  <Typography component="span">Release Notes</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2">
                        Feature: Dark Mode
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Enjoy a new dark theme for comfortable night-time use.
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">
                        Update: Improved Dashboard
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        The dashboard now loads faster and is easier to
                        customize.
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">
                        New: Notification Center
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        All your alerts and messages in one place.
                      </Typography>
                      <Button size="small" variant="text">
                        Show me
                      </Button>
                    </Box>
                  </Stack>
                </AccordionDetails>
                <AccordionActions>
                  <Button size="small">All Release Notes</Button>
                </AccordionActions>
              </Accordion>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Live Chat */}
      {showChat && <LiveChat onClose={() => setShowChat(false)} />}
    </>
  );
};

export default SupportMenu;
