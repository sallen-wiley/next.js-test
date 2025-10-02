"use client";
import * as React from "react";
import Box from "@mui/material/Box";
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
  Select,
  MenuItem,
  Alert,
  Chip,
  Card,
  CardContent,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Pagination,
  // Additional form components
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Autocomplete,
  FormGroup,

  // Additional feedback components
  AlertTitle,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Badge,
  Avatar,
  // Additional layout components
  Stack,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  // Additional navigation components
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
  // Progress indicators
  CircularProgress,
  LinearProgress,
  // Data display
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";

import InfoIcon from "@mui/icons-material/Info";
import RemoveIcon from "@mui/icons-material/Remove";

import Fab from "@mui/material/Fab";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import { keyframes } from "@mui/system";

export default function Home() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [rating, setRating] = React.useState(2);
  const [progress, setProgress] = React.useState(30);

  // Define wobble keyframes
  const wobble = keyframes`
    0% { transform: rotate(0deg); }
    15% { transform: rotate(-10deg); }
    30% { transform: rotate(8deg); }
    45% { transform: rotate(-6deg); }
    60% { transform: rotate(4deg); }
    75% { transform: rotate(-2deg); }
    100% { transform: rotate(0deg); }
  `;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const top100Films = [
    { label: "The Shawshank Redemption", year: 1994 },
    { label: "The Godfather", year: 1972 },
    { label: "The Godfather: Part II", year: 1974 },
    { label: "The Dark Knight", year: 2008 },
  ];

  return (
    <Box sx={{ flexGrow: 1, position: "relative" }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ my: 4 }}>
          {/* Header */}
          <Grid size={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Kitchen Sink - Comprehensive Component Showcase
            </Typography>
            <Typography variant="body1" gutterBottom color="text.secondary">
              A comprehensive demonstration of Material-UI components including
              alerts, forms, buttons, navigation, and data display elements.
            </Typography>
          </Grid>

          {/* Theme Demo Section */}
          <Grid size={12}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Theme Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current theme includes the new <strong>Default</strong> theme
                option alongside Sage, Wiley, and Tech themes. Each theme
                supports both light and dark modes. Use the theme switcher to
                explore all available options.
              </Typography>
            </Paper>
          </Grid>

          {/* Alerts Section */}
          <Grid size={12}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
              Alerts & Feedback
            </Typography>
            <Stack spacing={2}>
              <Alert
                severity="success"
                action={
                  <Button color="inherit" size="small">
                    Action
                  </Button>
                }
              >
                <AlertTitle>Success</AlertTitle>
                This is a success alert with an action button!
              </Alert>
              <Alert severity="info" icon={<InfoIcon />}>
                This is an info alert with a custom icon.
              </Alert>
              <Alert severity="warning" variant="outlined">
                <AlertTitle>Warning</AlertTitle>
                This is an outlined warning alert.
              </Alert>
              <Alert severity="error" variant="filled">
                This is a filled error alert — check it out!
              </Alert>
            </Stack>
          </Grid>

          {/* Button Variations */}
          <Grid size={12}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
              Button Variations
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Basic Buttons
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Button variant="contained">Contained</Button>
                    <Button variant="outlined">Outlined</Button>
                    <Button variant="text">Text</Button>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Button variant="contained" disabled>
                      Disabled
                    </Button>
                    <Button variant="contained" size="small">
                      Small
                    </Button>
                    <Button variant="contained" size="large">
                      Large
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Icon Buttons
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Button variant="contained" startIcon={<SendIcon />}>
                      Send
                    </Button>
                    <Button variant="outlined" endIcon={<ShareIcon />}>
                      Share
                    </Button>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <IconButton color="primary">
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton color="secondary">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton color="success">
                      <EditIcon />
                    </IconButton>
                    <IconButton disabled>
                      <RemoveIcon />
                    </IconButton>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Form Elements */}
          <Grid size={12}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
              Form Elements
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Text Inputs
                  </Typography>
                  <Stack spacing={2}>
                    <TextField label="Standard" variant="standard" fullWidth />
                    <TextField label="Outlined" variant="outlined" fullWidth />
                    <TextField label="Filled" variant="filled" fullWidth />
                    <TextField
                      label="With Helper Text"
                      helperText="Some important text"
                      fullWidth
                    />
                    <TextField
                      label="Error State"
                      error
                      helperText="This field has an error"
                      fullWidth
                    />
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-adornment-password">
                        Password
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                      />
                    </FormControl>
                    <TextField
                      label="Search"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Selection Controls
                  </Typography>
                  <Stack spacing={2}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Checkboxes</FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox defaultChecked />}
                          label="Option 1"
                        />
                        <FormControlLabel
                          control={<Checkbox />}
                          label="Option 2"
                        />
                        <FormControlLabel
                          control={<Checkbox disabled />}
                          label="Disabled"
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
                          control={<Radio />}
                          label="Option 2"
                        />
                        <FormControlLabel
                          value="disabled"
                          disabled
                          control={<Radio />}
                          label="Disabled"
                        />
                      </RadioGroup>
                    </FormControl>

                    <FormControl component="fieldset">
                      <FormLabel component="legend">Switches</FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label="Enabled"
                        />
                        <FormControlLabel
                          control={<Switch />}
                          label="Disabled"
                        />
                      </FormGroup>
                    </FormControl>

                    <Box>
                      <Typography gutterBottom>Slider</Typography>
                      <Slider
                        value={progress}
                        onChange={(_, newValue) =>
                          setProgress(newValue as number)
                        }
                        valueLabelDisplay="auto"
                      />
                    </Box>

                    <FormControl fullWidth>
                      <InputLabel>Select Option</InputLabel>
                      <Select defaultValue={10} label="Select Option">
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>

                    <Autocomplete
                      disablePortal
                      options={top100Films}
                      renderInput={(params) => (
                        <TextField {...params} label="Autocomplete" />
                      )}
                    />
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Data Display */}
          <Grid size={12}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
              Data Display
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Chips & Badges
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Chips
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip label="Default" />
                        <Chip label="Primary" color="primary" />
                        <Chip label="Secondary" color="secondary" />
                        <Chip label="Success" color="success" />
                        <Chip label="Error" color="error" />
                        <Chip label="Warning" color="warning" />
                        <Chip label="Info" color="info" />
                        <Chip label="Deletable" onDelete={() => {}} />
                        <Chip label="Clickable" onClick={() => {}} />
                      </Stack>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Badges
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <Badge badgeContent={4} color="primary">
                          <FavoriteIcon />
                        </Badge>
                        <Badge badgeContent={100} color="secondary">
                          <AccountCircleIcon />
                        </Badge>
                        <Badge variant="dot" color="success">
                          <HomeIcon />
                        </Badge>
                      </Stack>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Avatars
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Avatar>H</Avatar>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          <AccountCircleIcon />
                        </Avatar>
                        <Tooltip title="User Profile">
                          <Avatar sx={{ bgcolor: "secondary.main" }}>JD</Avatar>
                        </Tooltip>
                      </Stack>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Rating
                      </Typography>
                      <Rating
                        name="simple-controlled"
                        value={rating}
                        onChange={(_, newValue) => setRating(newValue || 0)}
                      />
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Progress Indicators
                  </Typography>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Circular Progress
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <CircularProgress />
                        <CircularProgress color="secondary" />
                        <CircularProgress variant="determinate" value={75} />
                      </Stack>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Linear Progress
                      </Typography>
                      <Stack spacing={1}>
                        <LinearProgress />
                        <LinearProgress color="secondary" />
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                        />
                        <LinearProgress
                          variant="buffer"
                          value={progress}
                          valueBuffer={progress + 10}
                        />
                      </Stack>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Navigation */}
          <Grid size={12}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
              Navigation
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Tabs
                  </Typography>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                      <Tab label="Item One" />
                      <Tab label="Item Two" />
                      <Tab label="Item Three" />
                    </Tabs>
                  </Box>
                  <Box sx={{ p: 3 }}>
                    <Typography>Tab Content {tabValue + 1}</Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Breadcrumbs & Pagination
                  </Typography>
                  <Stack spacing={2}>
                    <Breadcrumbs aria-label="breadcrumb">
                      <Link underline="hover" color="inherit" href="#">
                        Home
                      </Link>
                      <Link underline="hover" color="inherit" href="#">
                        Components
                      </Link>
                      <Typography color="text.primary">Kitchen Sink</Typography>
                    </Breadcrumbs>

                    <Pagination count={10} color="primary" />
                    <Pagination
                      count={5}
                      variant="outlined"
                      color="secondary"
                    />
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Lists & Tables */}
          <Grid size={12}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
              Lists & Tables
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 0 }}>
                  <Typography variant="h6" sx={{ p: 2 }}>
                    Lists
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <StarIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Starred Item"
                        secondary="With secondary text"
                      />
                    </ListItem>
                    <ListItemButton>
                      <ListItemIcon>
                        <SendIcon />
                      </ListItemIcon>
                      <ListItemText primary="Clickable Item" />
                    </ListItemButton>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <InfoIcon />
                      </ListItemIcon>
                      <ListItemText primary="Information Item" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat&nbsp;(g)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        { name: "Frozen yoghurt", calories: 159, fat: 6.0 },
                        { name: "Ice cream sandwich", calories: 237, fat: 9.0 },
                        { name: "Eclair", calories: 262, fat: 16.0 },
                      ].map((row) => (
                        <TableRow key={row.name}>
                          <TableCell component="th" scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell align="right">{row.calories}</TableCell>
                          <TableCell align="right">{row.fat}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>

          {/* Cards & Accordions */}
          <Grid size={12}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
              Cards & Accordions
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Basic Card
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      A simple card with content and actions.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={1}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Accordion 1</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Accordion 2</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Quisque velit nisi, pretium ut lacinia in, elementum id
                        enim. Curabitur non nulla sit amet nisl tempus convallis
                        quis ac lectus.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Stack>
              </Grid>
            </Grid>
          </Grid>

          {/* Interactive Elements */}
          <Grid size={12}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
              Interactive Elements
            </Typography>
            <Paper sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  onClick={() => setSnackbarOpen(true)}
                >
                  Show Snackbar
                </Button>
                <Button variant="outlined" onClick={() => setDialogOpen(true)}>
                  Open Dialog
                </Button>
                <Tooltip title="This is a tooltip">
                  <Button variant="text">Hover for Tooltip</Button>
                </Tooltip>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message="This is a snackbar message"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setSnackbarOpen(false)}
            >
              Close
            </Button>
          }
        />

        {/* Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogContent>
            <Typography>
              This is a dialog. You can put any content here.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => setDialogOpen(false)}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      {/* FAB with wobble animation */}
      <Fab
        aria-label="psychology"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          animation: `${wobble} 1.2s ease-in-out infinite`,
          zIndex: 1200,
          backgroundColor: "transparent",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "action.hover",
            boxShadow: "none",
          },
          minHeight: 56,
          minWidth: 56,
        }}
      >
        <PsychologyAltIcon sx={{ color: "text.primary", fontSize: 96 }} />
      </Fab>
    </Box>
  );
}
