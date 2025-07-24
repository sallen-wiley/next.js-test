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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Fab from "@mui/material/Fab";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import { keyframes } from "@mui/system";

export default function Home() {
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

  return (
    <Box sx={{ flexGrow: 1, position: "relative" }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ my: 4 }}>
          <Grid size={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Kitchen sink
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="body1" gutterBottom>
              This is a placeholder page for the kitchen sink demo. It showcases
              various components and layouts that can be used in a typical
              application.
            </Typography>
            {/* Buttons */}
            <Button variant="contained" color="primary" sx={{ mr: 2 }}>
              Contained
            </Button>
            <Button variant="outlined" color="secondary" sx={{ mr: 2 }}>
              Outlined
            </Button>
            <Button variant="text" color="success">
              Text
            </Button>
            {/* TextField */}
            <TextField
              label="Text Field"
              variant="outlined"
              sx={{ mt: 2, mb: 2 }}
              fullWidth
            />
            {/* Checkbox */}
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Checkbox"
            />
            {/* Radio */}
            <RadioGroup row defaultValue="option1" sx={{ mb: 2 }}>
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
            </RadioGroup>
            {/* Switch */}
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Switch"
            />
            {/* Slider */}
            <Slider
              defaultValue={30}
              aria-label="Slider"
              valueLabelDisplay="auto"
              sx={{ width: 200, mt: 2 }}
            />
            {/* Select */}
            <Select defaultValue={10} sx={{ mt: 2, mb: 2, minWidth: 120 }}>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            {/* Alert */}
            <Alert severity="info" sx={{ mt: 2 }}>
              This is an info alert — check it out!
            </Alert>
            {/* Chip */}
            <Chip label="Chip Example" color="primary" sx={{ mt: 2, mr: 2 }} />
            <Chip label="Success" color="success" sx={{ mt: 2 }} />
            {/* Card */}
            <Card sx={{ maxWidth: 345, mt: 4 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Card Title
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Some quick example text to build on the card title and make up
                  the bulk of the card&apos;s content.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
            {/* Accordion */}
            <Accordion sx={{ mt: 4 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Accordion 1</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Accordion 2</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Quisque velit nisi, pretium ut lacinia in, elementum id enim.
                  Curabitur non nulla sit amet nisl tempus convallis quis ac
                  lectus.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
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
            backgroundColor: "rgba(0,0,0,0.04)",
            boxShadow: "none",
          },
          minHeight: 56,
          minWidth: 56,
        }}
      >
        <PsychologyAltIcon sx={{ color: "black", fontSize: 96 }} />
      </Fab>
    </Box>
  );
}
