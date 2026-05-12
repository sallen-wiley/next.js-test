"use client";
import React from "react";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import {
  Box,
  Button,
  Grid,
  Link,
  MobileStepper,
  Paper,
  Stack,
  Step,
  StepButton,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const horizontalSteps = [
  "Select campaign settings",
  "Create an ad group",
  "Create an ad",
];

const verticalSteps = [
  {
    label: "Select campaign settings",
    description:
      "Configure budget, audience, and placement strategy for the campaign.",
  },
  {
    label: "Create an ad group",
    description:
      "Define a focused keyword set and targeting context for this group.",
  },
  {
    label: "Create an ad",
    description:
      "Draft creative copy and choose assets, then review before launch.",
  },
];

export const StepperSection = React.memo(() => {
  const theme = useTheme();

  const [linearActiveStep, setLinearActiveStep] = React.useState(0);
  const [linearSkipped, setLinearSkipped] = React.useState(new Set<number>());

  const [nonLinearActiveStep, setNonLinearActiveStep] = React.useState(0);
  const [nonLinearCompleted, setNonLinearCompleted] = React.useState<
    Record<number, boolean>
  >({});

  const [verticalActiveStep, setVerticalActiveStep] = React.useState(0);
  const [mobileActiveStep, setMobileActiveStep] = React.useState(0);

  const isLinearOptionalStep = React.useCallback(
    (step: number) => step === 1,
    [],
  );

  const isLinearStepSkipped = React.useCallback(
    (step: number) => linearSkipped.has(step),
    [linearSkipped],
  );

  const handleLinearNext = React.useCallback(() => {
    let nextSkipped = linearSkipped;
    if (isLinearStepSkipped(linearActiveStep)) {
      nextSkipped = new Set(nextSkipped.values());
      nextSkipped.delete(linearActiveStep);
    }
    setLinearActiveStep((prev) => prev + 1);
    setLinearSkipped(nextSkipped);
  }, [isLinearStepSkipped, linearActiveStep, linearSkipped]);

  const handleLinearBack = React.useCallback(() => {
    setLinearActiveStep((prev) => prev - 1);
  }, []);

  const handleLinearSkip = React.useCallback(() => {
    if (!isLinearOptionalStep(linearActiveStep)) {
      return;
    }

    setLinearActiveStep((prev) => prev + 1);
    setLinearSkipped((prev) => {
      const nextSkipped = new Set(prev.values());
      nextSkipped.add(linearActiveStep);
      return nextSkipped;
    });
  }, [isLinearOptionalStep, linearActiveStep]);

  const handleLinearReset = React.useCallback(() => {
    setLinearActiveStep(0);
    setLinearSkipped(new Set<number>());
  }, []);

  const totalNonLinearSteps = horizontalSteps.length;
  const completedNonLinearSteps = Object.keys(nonLinearCompleted).length;
  const allNonLinearStepsCompleted =
    completedNonLinearSteps === totalNonLinearSteps;

  const handleNonLinearNext = React.useCallback(() => {
    const isLastStep = nonLinearActiveStep === totalNonLinearSteps - 1;
    const nextStep =
      isLastStep && !allNonLinearStepsCompleted
        ? horizontalSteps.findIndex((_, index) => !nonLinearCompleted[index])
        : nonLinearActiveStep + 1;

    setNonLinearActiveStep(nextStep);
  }, [
    allNonLinearStepsCompleted,
    nonLinearActiveStep,
    nonLinearCompleted,
    totalNonLinearSteps,
  ]);

  const handleNonLinearBack = React.useCallback(() => {
    setNonLinearActiveStep((prev) => prev - 1);
  }, []);

  const handleNonLinearStep = React.useCallback((step: number) => {
    setNonLinearActiveStep(step);
  }, []);

  const handleNonLinearComplete = React.useCallback(() => {
    setNonLinearCompleted((prev) => ({
      ...prev,
      [nonLinearActiveStep]: true,
    }));
  }, [nonLinearActiveStep]);

  const handleNonLinearReset = React.useCallback(() => {
    setNonLinearActiveStep(0);
    setNonLinearCompleted({});
  }, []);

  const handleVerticalNext = React.useCallback(() => {
    setVerticalActiveStep((prev) => prev + 1);
  }, []);

  const handleVerticalBack = React.useCallback(() => {
    setVerticalActiveStep((prev) => prev - 1);
  }, []);

  const handleVerticalReset = React.useCallback(() => {
    setVerticalActiveStep(0);
  }, []);

  const handleMobileNext = React.useCallback(() => {
    setMobileActiveStep((prev) => prev + 1);
  }, []);

  const handleMobileBack = React.useCallback(() => {
    setMobileActiveStep((prev) => prev - 1);
  }, []);

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Stepper
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based stepper patterns for linear and non-linear flows, vertical
          progression, and compact mobile workflows.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-stepper/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Stepper docs
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
              Horizontal Steppers
            </Typography>

            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Linear + Optional Step
                </Typography>

                <Stepper activeStep={linearActiveStep}>
                  {horizontalSteps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: { optional?: React.ReactNode } = {};

                    if (isLinearOptionalStep(index)) {
                      labelProps.optional = (
                        <Typography variant="caption">Optional</Typography>
                      );
                    }

                    if (isLinearStepSkipped(index)) {
                      stepProps.completed = false;
                    }

                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>

                {linearActiveStep === horizontalSteps.length ? (
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mt: 2 }}
                  >
                    <Typography variant="body2">
                      All steps completed - you&apos;re finished.
                    </Typography>
                    <Button onClick={handleLinearReset}>Reset</Button>
                  </Stack>
                ) : (
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={linearActiveStep === 0}
                      onClick={handleLinearBack}
                    >
                      Back
                    </Button>
                    {isLinearOptionalStep(linearActiveStep) && (
                      <Button color="inherit" onClick={handleLinearSkip}>
                        Skip
                      </Button>
                    )}
                    <Button onClick={handleLinearNext}>
                      {linearActiveStep === horizontalSteps.length - 1
                        ? "Finish"
                        : "Next"}
                    </Button>
                  </Stack>
                )}
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Non-linear
                </Typography>

                <Stepper nonLinear activeStep={nonLinearActiveStep}>
                  {horizontalSteps.map((label, index) => (
                    <Step
                      key={label}
                      completed={Boolean(nonLinearCompleted[index])}
                    >
                      <StepButton onClick={() => handleNonLinearStep(index)}>
                        {label}
                      </StepButton>
                    </Step>
                  ))}
                </Stepper>

                {allNonLinearStepsCompleted ? (
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mt: 2 }}
                  >
                    <Typography variant="body2">
                      All steps completed - you&apos;re finished.
                    </Typography>
                    <Button onClick={handleNonLinearReset}>Reset</Button>
                  </Stack>
                ) : (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mt: 2 }}
                  >
                    <Button
                      color="inherit"
                      disabled={nonLinearActiveStep === 0}
                      onClick={handleNonLinearBack}
                    >
                      Back
                    </Button>
                    <Button onClick={handleNonLinearNext}>Next</Button>
                    {!nonLinearCompleted[nonLinearActiveStep] ? (
                      <Button onClick={handleNonLinearComplete}>
                        {completedNonLinearSteps === totalNonLinearSteps - 1
                          ? "Finish"
                          : "Complete Step"}
                      </Button>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Step already completed
                      </Typography>
                    )}
                  </Stack>
                )}
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
                Vertical Stepper
              </Typography>

              <Box sx={{ maxWidth: 420 }}>
                <Stepper activeStep={verticalActiveStep} orientation="vertical">
                  {verticalSteps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel
                        optional={
                          index === verticalSteps.length - 1 ? (
                            <Typography variant="caption">Last step</Typography>
                          ) : null
                        }
                      >
                        {step.label}
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2">
                          {step.description}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Button
                            variant="contained"
                            onClick={handleVerticalNext}
                            sx={{ mr: 1, mt: 1 }}
                          >
                            {index === verticalSteps.length - 1
                              ? "Finish"
                              : "Continue"}
                          </Button>
                          <Button
                            disabled={index === 0}
                            onClick={handleVerticalBack}
                            sx={{ mt: 1 }}
                          >
                            Back
                          </Button>
                        </Box>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>

                {verticalActiveStep === verticalSteps.length && (
                  <Paper square elevation={0} sx={{ p: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      All steps completed - you&apos;re finished.
                    </Typography>
                    <Button onClick={handleVerticalReset}>Reset</Button>
                  </Paper>
                )}
              </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Mobile Stepper (Text)
              </Typography>

              <Box sx={{ maxWidth: 420, flexGrow: 1 }}>
                <Paper
                  square
                  elevation={0}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    height: 44,
                    px: 1.5,
                    bgcolor: "background.default",
                  }}
                >
                  <Typography variant="body2">
                    {verticalSteps[mobileActiveStep].label}
                  </Typography>
                </Paper>

                <Box sx={{ minHeight: 96, p: 1.5 }}>
                  <Typography variant="body2">
                    {verticalSteps[mobileActiveStep].description}
                  </Typography>
                </Box>

                <MobileStepper
                  variant="text"
                  steps={verticalSteps.length}
                  position="static"
                  activeStep={mobileActiveStep}
                  nextButton={
                    <Button
                      size="small"
                      onClick={handleMobileNext}
                      disabled={mobileActiveStep === verticalSteps.length - 1}
                    >
                      Next
                      {theme.direction === "rtl" ? (
                        <KeyboardArrowLeft />
                      ) : (
                        <KeyboardArrowRight />
                      )}
                    </Button>
                  }
                  backButton={
                    <Button
                      size="small"
                      onClick={handleMobileBack}
                      disabled={mobileActiveStep === 0}
                    >
                      {theme.direction === "rtl" ? (
                        <KeyboardArrowRight />
                      ) : (
                        <KeyboardArrowLeft />
                      )}
                      Back
                    </Button>
                  }
                />
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
});

StepperSection.displayName = "StepperSection";
