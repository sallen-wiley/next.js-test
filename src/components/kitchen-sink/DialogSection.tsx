"use client";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Button,
  Dialog,
  type DialogProps,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Slide,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";

const DialogTransition = React.forwardRef(function DialogTransition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const DialogSection = React.memo(() => {
  const [openBasic, setOpenBasic] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [openForm, setOpenForm] = React.useState(false);
  const [openSlide, setOpenSlide] = React.useState(false);
  const [openFullScreen, setOpenFullScreen] = React.useState(false);
  const [openSizeDialog, setOpenSizeDialog] = React.useState(false);
  const [openScrollDialog, setOpenScrollDialog] = React.useState(false);
  const [scrollMode, setScrollMode] =
    React.useState<DialogProps["scroll"]>("paper");
  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>("sm");
  const [email, setEmail] = React.useState("");
  const scrollDescriptionRef = React.useRef<HTMLElement>(null);

  const openSizedDialog = React.useCallback(
    (width: DialogProps["maxWidth"]) => {
      setMaxWidth(width);
      setOpenSizeDialog(true);
    },
    [],
  );

  const handleSubmitForm = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setOpenForm(false);
    },
    [],
  );

  React.useEffect(() => {
    if (openScrollDialog && scrollDescriptionRef.current) {
      scrollDescriptionRef.current.focus();
    }
  }, [openScrollDialog]);

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Dialog
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based dialog patterns for critical actions, confirmations, forms,
          transitions, and responsive modal sizing.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-dialog/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Dialog docs
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
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Button variant="outlined" onClick={() => setOpenBasic(true)}>
                  Open basic dialog
                </Button>
                <Button variant="outlined" onClick={() => setOpenAlert(true)}>
                  Open alert dialog
                </Button>
                <Button variant="outlined" onClick={() => setOpenForm(true)}>
                  Open form dialog
                </Button>
              </Stack>

              <Typography variant="body2" color="text.secondary">
                Form dialog uses outlined input style to match our input policy.
              </Typography>
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
                Transition + Full Screen
              </Typography>

              <Stack spacing={1.5}>
                <Button variant="outlined" onClick={() => setOpenSlide(true)}>
                  Slide in alert dialog
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setOpenFullScreen(true)}
                >
                  Open full-screen dialog
                </Button>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Optional Sizes
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Button
                  variant="outlined"
                  onClick={() => openSizedDialog("xs")}
                >
                  xs
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => openSizedDialog("sm")}
                >
                  sm
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => openSizedDialog("md")}
                >
                  md
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => openSizedDialog("lg")}
                >
                  lg
                </Button>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Scrolling Long Content
              </Typography>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setScrollMode("paper");
                    setOpenScrollDialog(true);
                  }}
                >
                  scroll=paper
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setScrollMode("body");
                    setOpenScrollDialog(true);
                  }}
                >
                  scroll=body
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      <Dialog open={openBasic} onClose={() => setOpenBasic(false)}>
        <DialogTitle>Confirm action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This dialog confirms a focused user action before continuing.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBasic(false)}>Cancel</Button>
          <Button onClick={() => setOpenBasic(false)} autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        aria-labelledby="dialog-alert-title"
        aria-describedby="dialog-alert-description"
      >
        <DialogTitle id="dialog-alert-title">Use location service?</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-alert-description">
            Let the app access anonymous location data for better
            recommendations.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAlert(false)}>Disagree</Button>
          <Button onClick={() => setOpenAlert(false)} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1.5 }}>
            Enter your email address to receive occasional updates.
          </DialogContentText>
          <form onSubmit={handleSubmitForm}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="dialog-email"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <DialogActions sx={{ px: 0 }}>
              <Button onClick={() => setOpenForm(false)}>Cancel</Button>
              <Button type="submit">Subscribe</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openSlide}
        onClose={() => setOpenSlide(false)}
        keepMounted
        slots={{ transition: DialogTransition }}
      >
        <DialogTitle>Slide transition dialog</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This dialog uses the docs slide-in transition example with direction
            set to up.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSlide(false)}>Dismiss</Button>
          <Button onClick={() => setOpenSlide(false)}>Accept</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen
        open={openFullScreen}
        onClose={() => setOpenFullScreen(false)}
        slots={{ transition: DialogTransition }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpenFullScreen(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Full-screen dialog
            </Typography>
            <Button color="inherit" onClick={() => setOpenFullScreen(false)}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItemButton>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItemButton>
          <Divider />
          <ListItemButton>
            <ListItemText
              primary="Default notification ringtone"
              secondary="Tethys"
            />
          </ListItemButton>
        </List>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth={maxWidth}
        open={openSizeDialog}
        onClose={() => setOpenSizeDialog(false)}
      >
        <DialogTitle>Optional size: {maxWidth}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This dialog demonstrates max-width variants while keeping full width
            behavior enabled.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSizeDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openScrollDialog}
        onClose={() => setOpenScrollDialog(false)}
        scroll={scrollMode}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle>
        <DialogContent dividers={scrollMode === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={scrollDescriptionRef}
            tabIndex={-1}
          >
            {Array.from({ length: 40 })
              .map(
                () =>
                  "Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.",
              )
              .join("\n")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenScrollDialog(false)}>Cancel</Button>
          <Button onClick={() => setOpenScrollDialog(false)}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
});

DialogSection.displayName = "DialogSection";
