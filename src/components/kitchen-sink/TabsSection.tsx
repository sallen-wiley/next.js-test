"use client";
import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import PhoneIcon from "@mui/icons-material/Phone";
import {
  Box,
  Grid,
  Link,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

interface TabsPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
  panelIdPrefix: string;
}

function TabsPanel({ children, value, index, panelIdPrefix }: TabsPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${panelIdPrefix}-tabpanel-${index}`}
      aria-labelledby={`${panelIdPrefix}-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function getA11yProps(panelIdPrefix: string, index: number) {
  return {
    id: `${panelIdPrefix}-tab-${index}`,
    "aria-controls": `${panelIdPrefix}-tabpanel-${index}`,
  };
}

export const TabsSection = React.memo(() => {
  const [basicValue, setBasicValue] = React.useState(0);
  const [wrappedValue, setWrappedValue] = React.useState("one");
  const [disabledValue, setDisabledValue] = React.useState(2);
  const [fullWidthValue, setFullWidthValue] = React.useState(0);
  const [centeredValue, setCenteredValue] = React.useState(0);
  const [scrollableValue, setScrollableValue] = React.useState(0);
  const [verticalValue, setVerticalValue] = React.useState(0);
  const [iconValue, setIconValue] = React.useState(0);

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Tabs
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based tabs patterns for content switching, fixed and scrollable
          layouts, vertical orientation, and icon labels.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-tabs/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Tabs docs
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
                  Basic Tabs + Panels
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={basicValue}
                    onChange={(_event, newValue) => setBasicValue(newValue)}
                    aria-label="basic tabs example"
                  >
                    <Tab label="Item One" {...getA11yProps("basic", 0)} />
                    <Tab label="Item Two" {...getA11yProps("basic", 1)} />
                    <Tab label="Item Three" {...getA11yProps("basic", 2)} />
                  </Tabs>
                </Box>
                <TabsPanel value={basicValue} index={0} panelIdPrefix="basic">
                  Item One
                </TabsPanel>
                <TabsPanel value={basicValue} index={1} panelIdPrefix="basic">
                  Item Two
                </TabsPanel>
                <TabsPanel value={basicValue} index={2} panelIdPrefix="basic">
                  Item Three
                </TabsPanel>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Wrapped + Disabled
                </Typography>

                <Stack spacing={2}>
                  <Tabs
                    value={wrappedValue}
                    onChange={(_event, newValue) =>
                      setWrappedValue(newValue as string)
                    }
                    aria-label="wrapped label tabs"
                  >
                    <Tab
                      value="one"
                      label="New Arrivals in the Longest Text of Nonfiction that should appear in the next line"
                      wrapped
                    />
                    <Tab value="two" label="Item Two" />
                    <Tab value="three" label="Item Three" />
                  </Tabs>

                  <Tabs
                    value={disabledValue}
                    onChange={(_event, newValue) => setDisabledValue(newValue)}
                    aria-label="disabled tabs example"
                  >
                    <Tab label="Active" />
                    <Tab label="Disabled" disabled />
                    <Tab label="Active" />
                  </Tabs>
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
                Fixed + Scrollable
              </Typography>

              <Stack spacing={2}>
                <Tabs
                  value={fullWidthValue}
                  onChange={(_event, newValue) => setFullWidthValue(newValue)}
                  variant="fullWidth"
                  aria-label="full width tabs example"
                >
                  <Tab label="Item One" />
                  <Tab label="Item Two" />
                  <Tab label="Item Three" />
                </Tabs>

                <Tabs
                  value={centeredValue}
                  onChange={(_event, newValue) => setCenteredValue(newValue)}
                  centered
                  aria-label="centered tabs example"
                >
                  <Tab label="Item One" />
                  <Tab label="Item Two" />
                  <Tab label="Item Three" />
                </Tabs>

                <Box
                  sx={{
                    maxWidth: { xs: 320, sm: 420 },
                    bgcolor: "background.paper",
                  }}
                >
                  <Tabs
                    value={scrollableValue}
                    onChange={(_event, newValue) =>
                      setScrollableValue(newValue)
                    }
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable tabs example"
                  >
                    <Tab label="Item One" />
                    <Tab label="Item Two" />
                    <Tab label="Item Three" />
                    <Tab label="Item Four" />
                    <Tab label="Item Five" />
                    <Tab label="Item Six" />
                    <Tab label="Item Seven" />
                  </Tabs>
                </Box>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Vertical + Icons
              </Typography>

              <Stack spacing={2}>
                <Box
                  sx={{
                    flexGrow: 1,
                    bgcolor: "background.paper",
                    display: "flex",
                    minHeight: 220,
                  }}
                >
                  <Tabs
                    orientation="vertical"
                    value={verticalValue}
                    onChange={(_event, newValue) => setVerticalValue(newValue)}
                    aria-label="vertical tabs example"
                    sx={{ borderRight: 1, borderColor: "divider" }}
                  >
                    <Tab label="Item One" {...getA11yProps("vertical", 0)} />
                    <Tab label="Item Two" {...getA11yProps("vertical", 1)} />
                    <Tab label="Item Three" {...getA11yProps("vertical", 2)} />
                  </Tabs>

                  <TabsPanel
                    value={verticalValue}
                    index={0}
                    panelIdPrefix="vertical"
                  >
                    Item One
                  </TabsPanel>
                  <TabsPanel
                    value={verticalValue}
                    index={1}
                    panelIdPrefix="vertical"
                  >
                    Item Two
                  </TabsPanel>
                  <TabsPanel
                    value={verticalValue}
                    index={2}
                    panelIdPrefix="vertical"
                  >
                    Item Three
                  </TabsPanel>
                </Box>

                <Tabs
                  value={iconValue}
                  onChange={(_event, newValue) => setIconValue(newValue)}
                  aria-label="icon label tabs example"
                >
                  <Tab icon={<PhoneIcon />} label="RECENTS" />
                  <Tab icon={<FavoriteIcon />} label="FAVORITES" />
                  <Tab icon={<PersonPinIcon />} label="NEARBY" />
                </Tabs>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
});

TabsSection.displayName = "TabsSection";
