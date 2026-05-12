"use client";
import * as React from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
  Grid,
} from "@mui/material";
import { useHeaderConfig } from "@/contexts/HeaderContext";
import {
  AccordionSection,
  ThemeColorsSection,
  SpacingSection,
  PaperSection,
  CardsSection,
  AutocompleteSection,
  ButtonsSection,
  ButtonGroupsSection,
  CheckboxesSection,
  RadioButtonsSection,
  RatingSection,
  SelectSection,
  SlidersSection,
  SwitchesSection,
  TextFieldSection,
  ToggleButtonsSection,
  AvatarsSection,
  BadgesSection,
  ChipsSection,
  DataGridSection,
  DividerSection,
  ListsSection,
  TableSection,
  TooltipSection,
  TypographySection,
  AlertsSection,
  BackdropSection,
  DialogSection,
  PopoverSection,
  ProgressSection,
  SkeletonSection,
  SnackbarSection,
  BottomNavigationSection,
  BreadcrumbsSection,
  DrawerSection,
  MenuSection,
  PaginationSection,
  SpeedDialSection,
  StepperSection,
  TabsSection,
  ThemeModeSwitcherPanel,
} from "@/components/kitchen-sink";

const categoryLinks = [
  { id: "foundations", label: "Foundations" },
  { id: "surfaces", label: "Surfaces" },
  { id: "inputs", label: "Inputs" },
  { id: "data-display", label: "Data Display" },
  { id: "feedback", label: "Feedback" },
  { id: "navigation", label: "Navigation" },
];

export default function KitchenSink() {
  useHeaderConfig({
    logoAffix: "Component Library",
    containerProps: { maxWidth: "lg" },
  });

  return (
    <Box sx={{ flexGrow: 1, position: "relative" }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ my: 4 }}>
          {/* Header */}
          <Grid size={12}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ typography: "mono" as const }}
            >
              Kitchen Sink - Component Showcase
            </Typography>
            <Typography variant="body1" gutterBottom color="text.secondary">
              A comprehensive demonstration of Material-UI components with
              optimized performance. Each section is isolated to prevent
              unnecessary re-renders.
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              flexWrap="wrap"
              sx={{ mt: 2 }}
            >
              {categoryLinks.map((category) => (
                <Button
                  key={category.id}
                  href={`#${category.id}`}
                  size="small"
                  variant="outlined"
                >
                  {category.label}
                </Button>
              ))}
            </Stack>
          </Grid>

          <ThemeModeSwitcherPanel />

          {/* Foundations */}
          <Grid size={12} id="foundations" sx={{ scrollMarginTop: 88 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ typography: "mono" as const, mt: 2 }}
            >
              Foundations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Theme tokens and layout primitives that shape the system baseline.
            </Typography>
            <Divider sx={{ mt: 2 }} />
          </Grid>
          <ThemeColorsSection />
          <SpacingSection />

          {/* Surfaces */}
          <Grid size={12} id="surfaces" sx={{ scrollMarginTop: 88 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ typography: "mono" as const, mt: 2 }}
            >
              Surfaces
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Surface components for grouping, layering, and progressive
              disclosure.
            </Typography>
            <Divider sx={{ mt: 2 }} />
          </Grid>
          <AccordionSection />
          <CardsSection />
          <PaperSection />

          {/* Inputs */}
          <Grid size={12} id="inputs" sx={{ scrollMarginTop: 88 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ typography: "mono" as const, mt: 2 }}
            >
              Inputs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Components for collecting and editing user-provided values.
            </Typography>
            <Divider sx={{ mt: 2 }} />
          </Grid>
          <AutocompleteSection />
          <ButtonsSection />
          <ButtonGroupsSection />
          <CheckboxesSection />
          <RadioButtonsSection />
          <RatingSection />
          <SelectSection />
          <SlidersSection />
          <SwitchesSection />
          <TextFieldSection />
          <ToggleButtonsSection />

          {/* Data Display */}
          <Grid size={12} id="data-display" sx={{ scrollMarginTop: 88 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ typography: "mono" as const, mt: 2 }}
            >
              Data Display
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Components for presenting content, records, and textual hierarchy.
            </Typography>
            <Divider sx={{ mt: 2 }} />
          </Grid>
          <AvatarsSection />
          <BadgesSection />
          <ChipsSection />
          <DataGridSection />
          <DividerSection />
          <ListsSection />
          <TableSection />
          <TooltipSection />
          <TypographySection />

          {/* Feedback */}
          <Grid size={12} id="feedback" sx={{ scrollMarginTop: 88 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ typography: "mono" as const, mt: 2 }}
            >
              Feedback
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Status, progress, and interruption patterns for system response.
            </Typography>
            <Divider sx={{ mt: 2 }} />
          </Grid>
          <AlertsSection />
          <BackdropSection />
          <DialogSection />
          <PopoverSection />
          <ProgressSection />
          <SkeletonSection />
          <SnackbarSection />

          {/* Navigation */}
          <Grid size={12} id="navigation" sx={{ scrollMarginTop: 88 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ typography: "mono" as const, mt: 2 }}
            >
              Navigation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Components that move users between destinations and workflow steps.
            </Typography>
            <Divider sx={{ mt: 2 }} />
          </Grid>
          <BottomNavigationSection />
          <BreadcrumbsSection />
          <DrawerSection />
          <MenuSection />
          <PaginationSection />
          <SpeedDialSection />
          <StepperSection />
          <TabsSection />
        </Grid>
      </Container>
    </Box>
  );
}
