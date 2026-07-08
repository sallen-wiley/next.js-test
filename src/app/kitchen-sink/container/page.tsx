"use client";

import { Fragment } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { ContainerProps } from "@mui/material/Container";
import { useHeaderConfig } from "@/contexts/HeaderContext";

type MaxWidthScenario = false | "xs" | "sm" | "md" | "lg" | "xl";

type ContainerScenario = {
  maxWidth: MaxWidthScenario;
  fixed: boolean;
  disableGutters: boolean;
};

const maxWidthScenarios: MaxWidthScenario[] = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  false,
];

const fixedScenarios = [false, true] as const;
const gutterScenarios = [false, true] as const;

const allScenarios: ContainerScenario[] = maxWidthScenarios.flatMap(
  (maxWidth) =>
    fixedScenarios.flatMap((fixed) =>
      gutterScenarios.map((disableGutters) => ({
        maxWidth,
        fixed,
        disableGutters,
      })),
    ),
);

function resolveMaxWidth(
  maxWidth: MaxWidthScenario,
): ContainerProps["maxWidth"] | undefined {
  return maxWidth;
}

function describeMaxWidth(maxWidth: MaxWidthScenario): string {
  if (maxWidth === false) {
    return "maxWidth=false";
  }
  return `maxWidth=\"${maxWidth}\"`;
}

function scenarioLabel(scenario: ContainerScenario): string {
  return `${describeMaxWidth(scenario.maxWidth)} | fixed=${
    scenario.fixed
  } | disableGutters=${scenario.disableGutters}`;
}

export default function ContainerShowcasePage() {
  const theme = useTheme();
  const upSm = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
  const upMd = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });
  const upLg = useMediaQuery(theme.breakpoints.up("lg"), { noSsr: true });
  const upXl = useMediaQuery(theme.breakpoints.up("xl"), { noSsr: true });

  const currentBreakpoint = upXl
    ? "xl"
    : upLg
    ? "lg"
    : upMd
    ? "md"
    : upSm
    ? "sm"
    : "xs";

  useHeaderConfig({
    logoAffix: "Container Showcase",
    containerProps: { maxWidth: false },
  });

  return (
    <Box sx={{ py: 4, pb: 12 }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 1 }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ typography: "mono" as const }}
          >
            MUI Container Deep Dive
          </Typography>
          <Button
            component={Link}
            href="/kitchen-sink"
            variant="outlined"
            size="small"
          >
            Back to Kitchen Sink
          </Button>
        </Stack>
        <Typography variant="body1" color="text.secondary">
          Exhaustive Container matrix: every combination of maxWidth, fixed, and
          disableGutters. Each example keeps the Container unwrapped and uses an
          inner Paper to show content bounds.
        </Typography>
      </Container>

      <Typography
        variant="h6"
        component="h2"
        sx={{ mt: 4, px: { xs: 2, sm: 3 }, typography: "mono" as const }}
      >
        Total Configurations: {allScenarios.length}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ px: { xs: 2, sm: 3 }, mb: 2 }}
      >
        Formula: 6 maxWidth options x 2 fixed states x 2 gutter states = 24
        examples. Note: omitting maxWidth defaults to lg, so the omitted case is
        not shown separately.
      </Typography>
      {allScenarios.map((scenario) => (
        <Fragment
          key={`${String(scenario.maxWidth)}-${scenario.fixed}-${
            scenario.disableGutters
          }`}
        >
          <Typography
            variant="subtitle2"
            sx={{ px: { xs: 2, sm: 3 }, mb: 1, typography: "mono" as const }}
          >
            {scenarioLabel(scenario)}
          </Typography>
          <Container
            maxWidth={resolveMaxWidth(scenario.maxWidth)}
            fixed={scenario.fixed}
            disableGutters={scenario.disableGutters}
          >
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2">{scenarioLabel(scenario)}</Typography>
              <Typography variant="caption" color="text.secondary">
                Paper edge marks the inner content bounds of this container.
              </Typography>
            </Paper>
          </Container>
          <Divider sx={{ my: 2 }} />
        </Fragment>
      ))}

      <Box
        sx={{
          position: "fixed",
          left: "50%",
          bottom: 16,
          transform: "translateX(-50%)",
          zIndex: (t) => t.zIndex.snackbar,
          width: "max-content",
          maxWidth: "calc(100vw - 24px)",
          pointerEvents: "none",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            px: 2,
            py: 1,
          }}
        >
          <Typography variant="caption" sx={{ typography: "mono" as const }}>
            Viewport breakpoint: {currentBreakpoint}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
