"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { useHeaderConfig } from "@/contexts/HeaderContext";
import {
  Container,
  Typography,
  Grid,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Slider,
  Alert,
  Chip,
  FormControl,
  FormLabel,
  FormGroup,
  ToggleButton,
  ToggleButtonGroup,
  ButtonGroup,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  AlertTitle,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Badge,
  Avatar,
  AvatarGroup,
  Backdrop,
  Stack,
  Divider,
  Paper,
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  ListSubheader,
  Collapse,
  Drawer,
  Menu,
  MenuItem,
  BottomNavigation,
  BottomNavigationAction,
  Stepper,
  Step,
  StepLabel,
  Tabs,
  Tab,
  CircularProgress,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Rating,
  Skeleton,
  IconButton,
} from "@mui/material";

// Icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import SuccessIcon from "@mui/icons-material/CheckCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import FolderIcon from "@mui/icons-material/Folder";
import PrintIcon from "@mui/icons-material/Print";
import SaveIcon from "@mui/icons-material/Save";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import LogoutIcon from "@mui/icons-material/Logout";

import Fab from "@mui/material/Fab";

export default function Home() {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [rating, setRating] = React.useState(2);
  const [progress, setProgress] = React.useState(30);
  const [rangeValue, setRangeValue] = React.useState<number[]>([20, 37]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const [listExpanded, setListExpanded] = React.useState(false);
  const [bottomNavValue, setBottomNavValue] = React.useState(0);
  const [activeStep, setActiveStep] = React.useState(0);
  const [tabValue, setTabValue] = React.useState(0);
  const [toggleValue, setToggleValue] = React.useState<string[]>(["bold"]);
  const [speedDialOpen, setSpeedDialOpen] = React.useState(false);
  const [backdropOpen, setBackdropOpen] = React.useState(false);
  const [switchStates, setSwitchStates] = React.useState({
    switch1: true,
    switch2: false,
    switch3: true,
  });

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleToggleChange = (
    event: React.MouseEvent<HTMLElement>,
    newToggleValue: string[]
  ) => {
    setToggleValue(newToggleValue);
  };

  const handleSwitchChange =
    (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setSwitchStates((prev) => ({ ...prev, [name]: event.target.checked }));
    };

  const steps = [
    "Select campaign settings",
    "Create an ad group",
    "Create an ad",
  ];

  const speedDialActions = [
    { icon: <FileCopyIcon />, name: "Copy" },
    { icon: <SaveIcon />, name: "Save" },
    { icon: <PrintIcon />, name: "Print" },
    { icon: <ShareIcon />, name: "Share" },
  ];

  // Configure header for kitchen sink
  useHeaderConfig({
    logoAffix: "Component Library",
    containerProps: { maxWidth: "lg" },
  });

  return (
    <>
      <Box sx={{ flexGrow: 1, position: "relative" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ my: 4 }}>
            {/* Header */}
            <Grid size={12}>
              <Typography variant="h4" component="h1" gutterBottom>
                Kitchen Sink - Comprehensive Component Showcase
              </Typography>
              <Typography variant="body1" gutterBottom color="text.secondary">
                A comprehensive demonstration of Material-UI components
                including alerts, forms, buttons, navigation, menus, switches,
                typography, and data display elements.
              </Typography>
            </Grid>

            {/* Typography Showcase */}
            <Grid size={12}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ mt: 4 }}
              >
                Typography Stack
              </Typography>
              <Paper sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={2}>
                      <Typography variant="h1">Heading 1</Typography>
                      <Typography variant="h2">Heading 2</Typography>
                      <Typography variant="h3">Heading 3</Typography>
                      <Typography variant="h4">Heading 4</Typography>
                      <Typography variant="h5">Heading 5</Typography>
                      <Typography variant="h6">Heading 6</Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={2}>
                      <Typography variant="subtitle1">Subtitle 1</Typography>
                      <Typography variant="subtitle2">Subtitle 2</Typography>
                      <Typography variant="body1">
                        Body 1 - This is the default body text style used for
                        most content.
                      </Typography>
                      <Typography variant="body2">
                        Body 2 - This is a smaller body text often used for
                        secondary content.
                      </Typography>
                      <Typography variant="button">BUTTON TEXT</Typography>
                      <Typography variant="caption">Caption text</Typography>
                      <Typography variant="overline">OVERLINE TEXT</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Enhanced Button Showcase */}
            <Grid size={12}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ mt: 4 }}
              >
                Button Variations & Groups
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Button Variants
                    </Typography>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Contained Buttons
                        </Typography>
                        <Grid container spacing={1}>
                          <Button variant="contained">Primary</Button>
                          <Button variant="contained" color="secondary">
                            Secondary
                          </Button>
                          <Button variant="contained" color="neutral">
                            Neutral
                          </Button>
                          <Button variant="contained" color="success">
                            Success
                          </Button>
                          <Button variant="contained" color="error">
                            Error
                          </Button>
                          <Button variant="contained" color="warning">
                            Warning
                          </Button>
                          <Button variant="contained" color="info">
                            Info
                          </Button>
                          <Button variant="contained" color="black">
                            Black
                          </Button>
                          <Button variant="contained" color="white">
                            White
                          </Button>
                        </Grid>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Outlined Buttons
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          sx={{ gap: 1 }}
                        >
                          <Button variant="outlined">Primary</Button>
                          <Button variant="outlined" color="secondary">
                            Secondary
                          </Button>
                          <Button variant="outlined" color="success">
                            Success
                          </Button>
                          <Button variant="outlined" color="error">
                            Error
                          </Button>
                        </Stack>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Text Buttons
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          sx={{ gap: 1 }}
                        >
                          <Button variant="text">Primary</Button>
                          <Button variant="text" color="secondary">
                            Secondary
                          </Button>
                          <Button variant="text" color="success">
                            Success
                          </Button>
                          <Button variant="text" color="error">
                            Error
                          </Button>
                        </Stack>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Button Sizes
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          sx={{ gap: 1 }}
                          alignItems="center"
                        >
                          <Button variant="contained" size="small">
                            Small
                          </Button>
                          <Button variant="contained" size="medium">
                            Medium
                          </Button>
                          <Button variant="contained" size="large">
                            Large
                          </Button>
                          <Button variant="contained" size="extraLarge">
                            Extra Large
                          </Button>
                        </Stack>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Buttons with Icons
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          sx={{ gap: 1 }}
                          alignItems="center"
                        >
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<SendIcon />}
                          >
                            Send
                          </Button>
                          <Button
                            variant="contained"
                            size="medium"
                            startIcon={<SendIcon />}
                          >
                            Send
                          </Button>
                          <Button
                            variant="contained"
                            size="large"
                            startIcon={<SendIcon />}
                          >
                            Send
                          </Button>
                          <Button
                            variant="contained"
                            size="extraLarge"
                            startIcon={<SendIcon />}
                          >
                            Send
                          </Button>
                        </Stack>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Button Groups & Toggles
                    </Typography>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Button Group
                        </Typography>
                        <ButtonGroup
                          variant="contained"
                          aria-label="button group"
                        >
                          <Button>One</Button>
                          <Button>Two</Button>
                          <Button>Three</Button>
                        </ButtonGroup>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Toggle Button Group
                        </Typography>
                        <ToggleButtonGroup
                          value={toggleValue}
                          onChange={handleToggleChange}
                          aria-label="text formatting"
                        >
                          <ToggleButton value="bold" aria-label="bold">
                            <FormatBoldIcon />
                          </ToggleButton>
                          <ToggleButton value="italic" aria-label="italic">
                            <FormatItalicIcon />
                          </ToggleButton>
                          <ToggleButton
                            value="underlined"
                            aria-label="underlined"
                          >
                            <FormatUnderlinedIcon />
                          </ToggleButton>
                          <ToggleButton value="color" aria-label="color">
                            <FormatColorFillIcon />
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Icon Buttons with Various Colors
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <IconButton color="primary">
                            <FavoriteIcon />
                          </IconButton>
                          <IconButton color="secondary">
                            <ShareIcon />
                          </IconButton>
                          <IconButton color="success">
                            <CheckIcon />
                          </IconButton>
                          <IconButton color="error">
                            <DeleteIcon />
                          </IconButton>
                          <IconButton color="warning">
                            <WarningIcon />
                          </IconButton>
                          <IconButton color="info">
                            <InfoIcon />
                          </IconButton>
                        </Stack>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Floating Action Buttons
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Fab color="primary" aria-label="add">
                            <AddIcon />
                          </Fab>
                          <Fab color="secondary" aria-label="edit">
                            <EditIcon />
                          </Fab>
                          <Fab variant="extended">
                            <SendIcon sx={{ mr: 1 }} />
                            Extended
                          </Fab>
                        </Stack>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            {/* Enhanced Alert Variations */}
            <Grid size={12}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ mt: 4 }}
              >
                Alert Variations & Feedback
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Standard Alerts
                    </Typography>
                    <Stack spacing={2}>
                      <Alert severity="success" icon={<SuccessIcon />}>
                        <AlertTitle>Success</AlertTitle>
                        Operation completed successfully!
                      </Alert>
                      <Alert severity="info" icon={<InfoIcon />}>
                        <AlertTitle>Information</AlertTitle>
                        Here&apos;s some helpful information.
                      </Alert>
                      <Alert severity="warning" icon={<WarningIcon />}>
                        <AlertTitle>Warning</AlertTitle>
                        Please be careful with this action.
                      </Alert>
                      <Alert severity="error" icon={<ErrorIcon />}>
                        <AlertTitle>Error</AlertTitle>
                        Something went wrong!
                      </Alert>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Alert Variants
                    </Typography>
                    <Stack spacing={2}>
                      <Alert severity="success" variant="filled">
                        Filled success alert
                      </Alert>
                      <Alert severity="info" variant="outlined">
                        Outlined info alert
                      </Alert>
                      <Alert
                        severity="warning"
                        variant="standard"
                        action={
                          <Button color="inherit" size="small">
                            UNDO
                          </Button>
                        }
                      >
                        Standard warning with action
                      </Alert>
                      <Alert
                        severity="error"
                        variant="filled"
                        onClose={() => {}}
                      >
                        Filled error with close button
                      </Alert>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            {/* Comprehensive Form Elements */}
            <Grid size={12}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ mt: 4 }}
              >
                Form Elements & Controls
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Text Inputs
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        label="Standard"
                        variant="standard"
                        fullWidth
                      />
                      <TextField
                        label="Outlined"
                        variant="outlined"
                        fullWidth
                      />
                      <TextField label="Filled" variant="filled" fullWidth />
                      <TextField
                        label="Multiline"
                        multiline
                        rows={3}
                        fullWidth
                        placeholder="Type multiple lines here..."
                      />
                      <TextField
                        label="Number Input"
                        type="number"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                      <TextField
                        label="Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Stack>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Selection Controls
                    </Typography>
                    <Stack spacing={3}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Checkboxes</FormLabel>
                        <FormGroup>
                          <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label="Primary"
                          />
                          <FormControlLabel
                            control={<Checkbox color="secondary" />}
                            label="Secondary"
                          />
                          <FormControlLabel
                            control={<Checkbox color="success" />}
                            label="Success"
                          />
                          <FormControlLabel
                            control={<Checkbox color="error" />}
                            label="Error"
                          />
                          <FormControlLabel
                            control={<Checkbox disabled />}
                            label="Disabled"
                          />
                          <FormControlLabel
                            control={<Checkbox indeterminate />}
                            label="Indeterminate"
                          />
                        </FormGroup>
                      </FormControl>

                      <FormControl component="fieldset">
                        <FormLabel component="legend">Radio Buttons</FormLabel>
                        <RadioGroup defaultValue="option1">
                          <FormControlLabel
                            value="option1"
                            control={<Radio />}
                            label="Option 1"
                          />
                          <FormControlLabel
                            value="option2"
                            control={<Radio color="secondary" />}
                            label="Option 2"
                          />
                          <FormControlLabel
                            value="option3"
                            control={<Radio color="success" />}
                            label="Option 3"
                          />
                          <FormControlLabel
                            value="disabled"
                            disabled
                            control={<Radio />}
                            label="Disabled"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Switches & Sliders
                    </Typography>
                    <Stack spacing={3}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Switches</FormLabel>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={switchStates.switch1}
                                onChange={handleSwitchChange("switch1")}
                              />
                            }
                            label="Primary Switch"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={switchStates.switch2}
                                onChange={handleSwitchChange("switch2")}
                                color="secondary"
                              />
                            }
                            label="Secondary Switch"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={switchStates.switch3}
                                onChange={handleSwitchChange("switch3")}
                                color="success"
                              />
                            }
                            label="Success Switch"
                          />
                          <FormControlLabel
                            control={<Switch disabled />}
                            label="Disabled Switch"
                          />
                        </FormGroup>
                      </FormControl>

                      <Box>
                        <Typography gutterBottom>Continuous Slider</Typography>
                        <Slider
                          value={progress}
                          onChange={(_, newValue) =>
                            setProgress(newValue as number)
                          }
                          valueLabelDisplay="auto"
                          color="primary"
                        />
                      </Box>

                      <Box>
                        <Typography gutterBottom>Range Slider</Typography>
                        <Slider
                          value={rangeValue}
                          onChange={(_, newValue) =>
                            setRangeValue(newValue as number[])
                          }
                          valueLabelDisplay="auto"
                          color="secondary"
                        />
                      </Box>

                      <Box>
                        <Typography gutterBottom>Disabled Slider</Typography>
                        <Slider disabled defaultValue={30} />
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            {/* Menus & Navigation */}
            <Grid size={12}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ mt: 4 }}
              >
                Menus & Navigation
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Menu Components
                    </Typography>
                    <Stack spacing={2}>
                      <Button
                        variant="outlined"
                        onClick={handleMenuClick}
                        endIcon={<ExpandMoreIcon />}
                      >
                        Open Menu
                      </Button>
                      <Menu
                        anchorEl={menuAnchorEl}
                        open={Boolean(menuAnchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={handleMenuClose}>
                          <ListItemIcon>
                            <PersonIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Profile</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                          <ListItemIcon>
                            <SettingsIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Settings</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleMenuClose}>
                          <ListItemIcon>
                            <LogoutIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Logout</ListItemText>
                        </MenuItem>
                      </Menu>

                      <Button
                        variant="outlined"
                        onClick={() => setDrawerOpen(true)}
                      >
                        Open Drawer
                      </Button>
                      <Drawer
                        anchor="left"
                        open={drawerOpen}
                        onClose={() => setDrawerOpen(false)}
                      >
                        <Box sx={{ width: 250 }} role="presentation">
                          <List>
                            <ListItemButton>
                              <ListItemIcon>
                                <DashboardIcon />
                              </ListItemIcon>
                              <ListItemText primary="Dashboard" />
                            </ListItemButton>
                            <ListItemButton>
                              <ListItemIcon>
                                <PersonIcon />
                              </ListItemIcon>
                              <ListItemText primary="Profile" />
                            </ListItemButton>
                            <ListItemButton>
                              <ListItemIcon>
                                <SettingsIcon />
                              </ListItemIcon>
                              <ListItemText primary="Settings" />
                            </ListItemButton>
                          </List>
                        </Box>
                      </Drawer>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Stepper & Bottom Navigation
                    </Typography>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Tabs
                        </Typography>
                        <Tabs
                          value={tabValue}
                          onChange={(event, newValue) => setTabValue(newValue)}
                        >
                          <Tab label="Overview" />
                          <Tab label="Details" />
                          <Tab label="Settings" />
                          <Tab label="Add New" />
                        </Tabs>
                        <Box sx={{ p: 2 }}>
                          {tabValue === 0 && (
                            <Typography>Overview content</Typography>
                          )}
                          {tabValue === 1 && (
                            <Typography>Details content</Typography>
                          )}
                          {tabValue === 2 && (
                            <Typography>Settings content</Typography>
                          )}
                          {tabValue === 3 && (
                            <Typography>Add New content</Typography>
                          )}
                        </Box>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Horizontal Stepper
                        </Typography>
                        <Stepper activeStep={activeStep}>
                          {steps.map((label) => (
                            <Step key={label}>
                              <StepLabel>{label}</StepLabel>
                            </Step>
                          ))}
                        </Stepper>
                        <Box sx={{ mt: 2 }}>
                          <Button
                            disabled={activeStep === 0}
                            onClick={() => setActiveStep((prev) => prev - 1)}
                            sx={{ mr: 1 }}
                          >
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => setActiveStep((prev) => prev + 1)}
                            disabled={activeStep === steps.length - 1}
                          >
                            Next
                          </Button>
                        </Box>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Bottom Navigation
                        </Typography>
                        <BottomNavigation
                          value={bottomNavValue}
                          onChange={(event, newValue) =>
                            setBottomNavValue(newValue)
                          }
                          showLabels
                        >
                          <BottomNavigationAction
                            label="Home"
                            icon={<HomeIcon />}
                          />
                          <BottomNavigationAction
                            label="Favorites"
                            icon={<FavoriteIcon />}
                          />
                          <BottomNavigationAction
                            label="Archive"
                            icon={<LibraryBooksIcon />}
                          />
                        </BottomNavigation>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            {/* Enhanced Data Display */}
            <Grid size={12}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ mt: 4 }}
              >
                Data Display & Lists
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 0 }}>
                    <Typography variant="h6" sx={{ p: 2 }}>
                      Enhanced Lists
                    </Typography>
                    <List>
                      <ListSubheader>Recent Items</ListSubheader>
                      <ListItemButton>
                        <ListItemIcon>
                          <FolderIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Documents"
                          secondary="Last modified 2 hours ago"
                        />
                        <Badge badgeContent={4} color="primary">
                          <NotificationsIcon />
                        </Badge>
                      </ListItemButton>

                      <ListItemButton
                        onClick={() => setListExpanded(!listExpanded)}
                      >
                        <ListItemIcon>
                          <GroupIcon />
                        </ListItemIcon>
                        <ListItemText primary="Team" />
                        {listExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </ListItemButton>

                      <Collapse in={listExpanded} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                              <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="John Doe" />
                          </ListItemButton>
                          <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                              <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="Jane Smith" />
                          </ListItemButton>
                        </List>
                      </Collapse>

                      <Divider />

                      <ListItemButton>
                        <ListItemIcon>
                          <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                        <Switch edge="end" checked={switchStates.switch1} />
                      </ListItemButton>
                    </List>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Chips & Avatars
                    </Typography>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Chip Variants
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          sx={{ gap: 1 }}
                        >
                          <Chip label="Default" />
                          <Chip label="Primary" color="primary" />
                          <Chip label="Secondary" color="secondary" />
                          <Chip label="Success" color="success" />
                          <Chip label="Error" color="error" />
                          <Chip label="Warning" color="warning" />
                          <Chip label="Info" color="info" />
                        </Stack>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Interactive Chips
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          sx={{ gap: 1 }}
                        >
                          <Chip
                            label="Deletable"
                            onDelete={() => {}}
                            color="primary"
                          />
                          <Chip
                            label="Clickable"
                            onClick={() => {}}
                            color="secondary"
                          />
                          <Chip
                            label="With Avatar"
                            avatar={<Avatar>M</Avatar>}
                          />
                          <Chip
                            label="With Icon"
                            icon={<FavoriteIcon />}
                            variant="outlined"
                          />
                        </Stack>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Avatar Group
                        </Typography>
                        <AvatarGroup max={4}>
                          <Avatar alt="User 1" sx={{ bgcolor: "primary.main" }}>
                            U1
                          </Avatar>
                          <Avatar
                            alt="User 2"
                            sx={{ bgcolor: "secondary.main" }}
                          >
                            U2
                          </Avatar>
                          <Avatar alt="User 3" sx={{ bgcolor: "success.main" }}>
                            U3
                          </Avatar>
                          <Avatar alt="User 4" sx={{ bgcolor: "error.main" }}>
                            U4
                          </Avatar>
                          <Avatar alt="User 5" sx={{ bgcolor: "warning.main" }}>
                            U5
                          </Avatar>
                        </AvatarGroup>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Rating & Progress
                        </Typography>
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="body2">Rating:</Typography>
                            <Rating
                              value={rating}
                              onChange={(_, newValue) =>
                                setRating(newValue || 0)
                              }
                              precision={0.5}
                            />
                          </Box>
                          <Box>
                            <Typography variant="body2">Progress:</Typography>
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                            />
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            {/* Enhanced Table */}
            <Grid size={12}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ mt: 4 }}
              >
                Enhanced Table
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Stock</TableCell>
                      <TableCell align="right">Rating</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      {
                        product: "MacBook Pro",
                        price: "$2,399",
                        stock: 12,
                        rating: 4.5,
                      },
                      {
                        product: "iPhone 15",
                        price: "$999",
                        stock: 25,
                        rating: 4.8,
                      },
                      {
                        product: "iPad Air",
                        price: "$599",
                        stock: 8,
                        rating: 4.3,
                      },
                      {
                        product: "Apple Watch",
                        price: "$399",
                        stock: 15,
                        rating: 4.6,
                      },
                    ].map((row) => (
                      <TableRow key={row.product} hover>
                        <TableCell component="th" scope="row">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: "primary.main",
                              }}
                            >
                              {row.product[0]}
                            </Avatar>
                            {row.product}
                          </Box>
                        </TableCell>
                        <TableCell align="right">{row.price}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={row.stock}
                            color={row.stock > 10 ? "success" : "warning"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Rating
                            value={row.rating}
                            readOnly
                            precision={0.1}
                            size="small"
                          />
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
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={4}
                  rowsPerPage={5}
                  page={0}
                  onPageChange={() => {}}
                  onRowsPerPageChange={() => {}}
                />
              </TableContainer>
            </Grid>

            {/* Interactive Elements & Dialogs */}
            <Grid size={12}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ mt: 4 }}
              >
                Interactive Elements
              </Typography>
              <Paper sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  flexWrap="wrap"
                  sx={{ gap: 2 }}
                >
                  <Button
                    variant="contained"
                    onClick={() => setSnackbarOpen(true)}
                  >
                    Show Snackbar
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setDialogOpen(true)}
                  >
                    Open Dialog
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setBackdropOpen(true)}
                  >
                    Show Backdrop
                  </Button>
                  <Tooltip title="This tooltip has rich content" arrow>
                    <Button variant="text">Hover for Tooltip</Button>
                  </Tooltip>
                  <Badge badgeContent={4} color="primary">
                    <Button variant="outlined">Notifications</Button>
                  </Badge>
                </Stack>
              </Paper>
            </Grid>

            {/* Skeleton Loading States */}
            <Grid size={12}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ mt: 4 }}
              >
                Loading States
              </Typography>
              <Paper sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h6" gutterBottom>
                      Skeleton Loading
                    </Typography>
                    <Stack spacing={1}>
                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                      <Skeleton variant="circular" width={40} height={40} />
                      <Skeleton variant="rectangular" width={210} height={60} />
                      <Skeleton variant="rounded" width={210} height={60} />
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h6" gutterBottom>
                      Progress Indicators
                    </Typography>
                    <Stack spacing={2}>
                      <CircularProgress />
                      <CircularProgress color="secondary" />
                      <LinearProgress />
                      <LinearProgress color="secondary" />
                      <LinearProgress variant="determinate" value={progress} />
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          {/* Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            message="This is a snackbar message with action"
            action={
              <React.Fragment>
                <Button
                  color="secondary"
                  size="small"
                  onClick={() => setSnackbarOpen(false)}
                >
                  UNDO
                </Button>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={() => setSnackbarOpen(false)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />

          {/* Enhanced Dialog */}
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              Enhanced Dialog
              <IconButton
                aria-label="close"
                onClick={() => setDialogOpen(false)}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom>
                This is an enhanced dialog with various components:
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Subscribe to newsletter"
                sx={{ mt: 1 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={() => setDialogOpen(false)}>
                Subscribe
              </Button>
            </DialogActions>
          </Dialog>

          {/* Backdrop */}
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={backdropOpen}
            onClick={() => setBackdropOpen(false)}
          >
            <Stack alignItems="center" spacing={2}>
              <CircularProgress color="inherit" />
              <Typography>Loading...</Typography>
            </Stack>
          </Backdrop>

          {/* Speed Dial */}
          <SpeedDial
            ariaLabel="SpeedDial example"
            sx={{ position: "fixed", bottom: 16, right: 24 }}
            icon={<SpeedDialIcon />}
            open={speedDialOpen}
            onClose={() => setSpeedDialOpen(false)}
            onOpen={() => setSpeedDialOpen(true)}
          >
            {speedDialActions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => setSpeedDialOpen(false)}
              />
            ))}
          </SpeedDial>
        </Container>
      </Box>
    </>
  );
}
