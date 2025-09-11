import * as React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default {
  title: "Tokens/Breakpoints",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Demonstrates the responsive breakpoint system using a mobile-first approach. Our design system typically creates 2 main user experiences (mobile: xs/sm/md, desktop: lg/xl) with fine-tuning across all breakpoints. Note that desktop users may dock windows to smaller sizes, so all breakpoints should provide usable experiences.",
      },
    },
  },
};

// Current breakpoint indicator component
const CurrentBreakpointIndicator = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));

  const getCurrentBreakpoint = () => {
    if (isXl) return { name: "xl", label: "Extra Large", color: "#9c27b0" };
    if (isLg) return { name: "lg", label: "Large", color: "#3f51b5" };
    if (isMd) return { name: "md", label: "Medium", color: "#2196f3" };
    if (isSm) return { name: "sm", label: "Small", color: "#ff9800" };
    return { name: "xs", label: "Extra Small", color: "#f44336" };
  };

  const current = getCurrentBreakpoint();

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        bgcolor: current.color,
        color: "white",
        textAlign: "center",
        mb: 3,
        fontWeight: "bold",
      }}
    >
      <Typography variant="h6">
        Current Breakpoint: {current.name} ({current.label})
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        Resize your browser window to see changes
      </Typography>
    </Paper>
  );
};

// Breakpoint reference table
const BreakpointReference = () => {
  const breakpoints = [
    {
      key: "xs",
      label: "Extra Small",
      value: "0px",
      description: "Mobile portrait",
      usage: "Mobile (primary)",
    },
    {
      key: "sm",
      label: "Small",
      value: "480px",
      description: "Mobile landscape",
      usage: "Mobile (secondary)",
    },
    {
      key: "md",
      label: "Medium",
      value: "641px",
      description: "Tablet portrait / Docked windows",
      usage: "Mobile/Tablet (fine-tuning)",
    },
    {
      key: "lg",
      label: "Large",
      value: "1081px",
      description: "Desktop / Tablet landscape",
      usage: "Desktop (primary)",
    },
    {
      key: "xl",
      label: "Extra Large",
      value: "1441px",
      description: "Large desktop / Wide screens",
      usage: "Desktop (secondary)",
    },
  ];

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Typography variant="h6" gutterBottom>
        Breakpoint Reference
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Custom breakpoint values optimized for our design system. Mobile-first
        approach: xs/sm/md for mobile experience, lg/xl for desktop experience.
      </Typography>

      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        {breakpoints.map((bp, index) => (
          <Box
            key={bp.key}
            sx={{
              display: "grid",
              gridTemplateColumns: "80px 120px 100px 200px 1fr",
              gap: 2,
              p: 2,
              alignItems: "center",
              bgcolor: index % 2 === 0 ? "grey.50" : "background.paper",
              borderBottom:
                index < breakpoints.length - 1 ? "1px solid" : "none",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontFamily: "monospace", fontWeight: "bold" }}
            >
              {bp.key}
            </Typography>
            <Typography variant="body2">{bp.label}</Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              {bp.value}+
            </Typography>
            <Typography variant="body2">{bp.description}</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {bp.usage}
            </Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

// Visual breakpoint helpers demonstration
const BreakpointHelpers = () => {
  const theme = useTheme();

  const HelperDemo = ({
    title,
    description,
    sx,
    example,
  }: {
    title: string;
    description: string;
    sx: object;
    example: string;
  }) => (
    <Card sx={{ mb: 2 }}>
      <Box sx={{ p: 2, bgcolor: "grey.100" }}>
        <Typography variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block", mb: 1 }}
        >
          {description}
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontFamily: "monospace", fontSize: "0.7rem" }}
        >
          {example}
        </Typography>
      </Box>
      <Box
        sx={{
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...sx,
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: "inherit", fontWeight: "bold" }}
        >
          Active at current viewport
        </Typography>
      </Box>
    </Card>
  );

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Breakpoint Helper Methods
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Visual demonstration of theme.breakpoints helper methods. These show
        when each rule becomes active.
      </Typography>

      <HelperDemo
        title="up('md') - Medium and larger"
        description="Mobile-first: styles apply from md breakpoint and up"
        example="[theme.breakpoints.up('md')]: { backgroundColor: 'blue' }"
        sx={{
          bgcolor: "grey.300",
          [theme.breakpoints.up("md")]: {
            bgcolor: "primary.main",
            color: "primary.contrastText",
          },
        }}
      />

      <HelperDemo
        title="down('lg') - Below large"
        description="Styles apply from 0px up to (but not including) lg breakpoint"
        example="[theme.breakpoints.down('lg')]: { backgroundColor: 'orange' }"
        sx={{
          bgcolor: "grey.300",
          [theme.breakpoints.down("lg")]: {
            bgcolor: "warning.main",
            color: "warning.contrastText",
          },
        }}
      />

      <HelperDemo
        title="only('md') - Medium only"
        description="Styles apply only at the md breakpoint range"
        example="[theme.breakpoints.only('md')]: { backgroundColor: 'green' }"
        sx={{
          bgcolor: "grey.300",
          [theme.breakpoints.only("md")]: {
            bgcolor: "success.main",
            color: "success.contrastText",
          },
        }}
      />

      <HelperDemo
        title="between('sm', 'lg') - Small to Large"
        description="Styles apply from sm up to (but not including) lg"
        example="[theme.breakpoints.between('sm', 'lg')]: { backgroundColor: 'purple' }"
        sx={{
          bgcolor: "grey.300",
          [theme.breakpoints.between("sm", "lg")]: {
            bgcolor: "secondary.main",
            color: "secondary.contrastText",
          },
        }}
      />
    </Box>
  );
};

// Layout demonstration
const ResponsiveLayoutDemo = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Responsive Layout Example
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Progressive layout showing mobile-first responsive design: 1 column → 2
        columns → 3 columns → 4 columns → 6 columns as screen size increases.
      </Typography>

      <Grid container spacing={2}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
          <Grid key={item} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
            <Card>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Card {item}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  xs:12 sm:6 md:4 lg:3 xl:2
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
          MUI v7 Grid responsive sizing:
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontFamily: "monospace", display: "block" }}
        >
          size=&#123;&#123; xs: 12, sm: 6, md: 4, lg: 3, xl: 2 &#125;&#125;
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            • <strong>xs</strong>: 1 item per row (12/12 columns) - Should be
            full width
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            • <strong>sm</strong>: 2 items per row (6/12 columns each)
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            • <strong>md</strong>: 3 items per row (4/12 columns each)
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            • <strong>lg</strong>: 4 items per row (3/12 columns each)
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            • <strong>xl</strong>: 6 items per row (2/12 columns each)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Component visibility example
const ComponentVisibilityDemo = () => {
  const theme = useTheme();

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Component Visibility
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Hide/show components based on breakpoints. Common for navigation
        patterns and progressive disclosure.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            bgcolor: "error.light",
            color: "error.contrastText",
            display: "block",
            [theme.breakpoints.up("md")]: {
              display: "none",
            },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            📱 Mobile Only (xs, sm)
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 1, fontFamily: "monospace" }}
          >
            display: &apos;none&apos; on md+
          </Typography>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            bgcolor: "warning.light",
            color: "warning.contrastText",
            display: "none",
            [theme.breakpoints.only("md")]: {
              display: "block",
            },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            📱 Tablet Only (md)
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 1, fontFamily: "monospace" }}
          >
            display: &apos;block&apos; only on md
          </Typography>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            bgcolor: "success.light",
            color: "success.contrastText",
            display: "none",
            [theme.breakpoints.up("lg")]: {
              display: "block",
            },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            🖥️ Desktop Only (lg, xl)
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 1, fontFamily: "monospace" }}
          >
            display: &apos;block&apos; on lg+
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

// Advanced Grid demonstration
const AdvancedGridDemo = () => {
  return (
    <Box sx={{ maxWidth: 800 }}>
      <Typography variant="h6" gutterBottom>
        Advanced MUI v7 Grid Features
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Demonstrates custom column systems and responsive spacing. This example
        uses a 15-column grid instead of the default 12-column system.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" gutterBottom>
          Custom 15-Column Grid System
        </Typography>
        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} columns={15}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
            <Grid key={item} size={{ xs: 15, sm: 15, md: 5, lg: 5, xl: 3 }}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                }}
              >
                <Typography variant="h6">Item {item}</Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", fontFamily: "monospace" }}
                >
                  xs:15 sm:15 md:5 lg:5 xl:3
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 1, fontFamily: "monospace" }}
        >
          columns=&#123;15&#125; size=&#123;&#123; xs: 15, sm: 15, md: 5, lg: 5,
          xl: 3 &#125;&#125;
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            • <strong>xs</strong>: 1 item per row (15/15 columns each)
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            • <strong>sm</strong>: 1 item per row (15/15 columns each)
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            • <strong>md</strong>: 3 items per row (5/15 columns each)
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            • <strong>lg</strong>: 3 items per row (5/15 columns each)
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            • <strong>xl</strong>: 5 items per row (3/15 columns each)
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" gutterBottom>
          Comparison: Standard 12-Column System
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid key={item} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "secondary.light",
                  color: "secondary.contrastText",
                }}
              >
                <Typography variant="h6">Item {item}</Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", fontFamily: "monospace" }}
                >
                  xs:12 sm:6 md:4 (of 12)
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 1, fontFamily: "monospace" }}
        >
          Default 12-column: size=&#123;&#123; xs: 12, sm: 6, md: 4 &#125;&#125;
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 1, color: "text.secondary" }}
        >
          xs: 1 per row • sm: 2 per row • md: 3 per row
        </Typography>
      </Box>
    </Box>
  );
};
const ResponsiveSpacingDemo = () => {
  const theme = useTheme();

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Responsive Spacing with Breakpoints
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Adjust spacing based on screen size using breakpoint helpers. Typically
        tighter spacing on mobile, more generous on desktop.
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 1, // Mobile: tight spacing
          [theme.breakpoints.up("md")]: {
            p: 2, // Tablet: medium spacing
          },
          [theme.breakpoints.up("lg")]: {
            p: 4, // Desktop: generous spacing
          },
          bgcolor: "primary.light",
          color: "primary.contrastText",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
          Responsive Padding Container
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: "block", fontFamily: "monospace" }}
        >
          Mobile (xs-sm): p=&#123;1&#125; → {theme.spacing(1)}
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: "block", fontFamily: "monospace" }}
        >
          Tablet (md): p=&#123;2&#125; → {theme.spacing(2)}
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: "block", fontFamily: "monospace" }}
        >
          Desktop (lg+): p=&#123;4&#125; → {theme.spacing(4)}
        </Typography>
      </Paper>

      <Box sx={{ mt: 3 }}>
        <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
          Implementation using breakpoint helpers:
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50" }}>
          <Typography
            variant="caption"
            component="pre"
            sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}
          >
            {`sx={{
  p: 1, // Base: 8px on mobile
  [theme.breakpoints.up('md')]: {
    p: 2, // 16px on tablet+
  },
  [theme.breakpoints.up('lg')]: {
    p: 4, // 32px on desktop+
  },
}}`}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

// Developer reference
const DeveloperReference = () => {
  return (
    <Box sx={{ maxWidth: 800 }}>
      <Typography variant="h6" gutterBottom>
        Developer Implementation Guide
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Technical reference for implementing responsive designs with our
        breakpoint system.
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, bgcolor: "grey.50" }}>
        <Typography variant="subtitle2" gutterBottom>
          Breakpoint Values (from theme/foundations.ts)
        </Typography>
        <Typography
          variant="body2"
          component="pre"
          sx={{ fontFamily: "monospace", mb: 3, whiteSpace: "pre-wrap" }}
        >
          {`export const breakpoints = {
  values: {
    xs: 0,      // 0px and up
    sm: 480,    // 480px and up  
    md: 641,    // 641px and up
    lg: 1081,   // 1081px and up
    xl: 1441,   // 1441px and up
  },
};`}
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          MUI v7 Grid Examples
        </Typography>
        <Typography
          variant="body2"
          component="pre"
          sx={{ fontFamily: "monospace", mb: 3, whiteSpace: "pre-wrap" }}
        >
          {`// ✅ MUI v7 Grid - Basic responsive layout
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
    <Card>Content</Card>
  </Grid>
</Grid>

// ✅ MUI v7 Grid - Responsive spacing & columns
<Grid 
  container 
  spacing={{ xs: 1, sm: 2, md: 3 }} 
  columns={{ xs: 4, sm: 8, md: 12 }}
>
  <Grid size={{ xs: 2, sm: 4, md: 3 }}>
    <Paper>Item</Paper>
  </Grid>
</Grid>

// ✅ MUI v7 Grid - Row and column spacing
<Grid 
  container 
  rowSpacing={1} 
  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
>
  <Grid size={6}>
    <Paper>Item</Paper>
  </Grid>
</Grid>

// ❌ Old MUI Grid syntax (deprecated)
<Grid item xs={12} md={6}>  // Don't use item prop
<Grid lg={4}>               // Don't use breakpoint props directly`}
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          CSS Approach (Alternative)
        </Typography>
        <Typography
          variant="body2"
          component="pre"
          sx={{ fontFamily: "monospace", mb: 3, whiteSpace: "pre-wrap" }}
        >
          {`// ✅ CSS Grid for complex layouts
sx={{
  display: 'grid',
  gap: 2,
  gridTemplateColumns: {
    xs: '1fr',
    md: 'repeat(2, 1fr)', 
    lg: 'repeat(3, 1fr)',
  },
}}`}
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Available Helper Methods
        </Typography>
        <Typography
          variant="body2"
          component="pre"
          sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}
        >
          {`theme.breakpoints.up(key)       // From breakpoint and larger
theme.breakpoints.down(key)     // Up to (but not including) breakpoint  
theme.breakpoints.only(key)     // Only at specific breakpoint range
theme.breakpoints.between(a, b) // Between two breakpoints
theme.breakpoints.not(key)      // All except specific breakpoint

// JavaScript usage with useMediaQuery
const isMobile = useMediaQuery(theme.breakpoints.down('md'));
const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));`}
        </Typography>
      </Paper>
    </Box>
  );
};

export const BreakpointOverview = () => {
  return (
    <Box sx={{ maxWidth: 800 }}>
      <CurrentBreakpointIndicator />
      <BreakpointReference />
    </Box>
  );
};

export const HelperMethods = () => {
  return (
    <Box>
      <CurrentBreakpointIndicator />
      <BreakpointHelpers />
    </Box>
  );
};

export const ResponsiveLayout = () => {
  return (
    <Box>
      <CurrentBreakpointIndicator />
      <ResponsiveLayoutDemo />
    </Box>
  );
};

export const AdvancedGrid = () => {
  return (
    <Box>
      <CurrentBreakpointIndicator />
      <AdvancedGridDemo />
    </Box>
  );
};

export const ComponentVisibility = () => {
  return (
    <Box>
      <CurrentBreakpointIndicator />
      <ComponentVisibilityDemo />
    </Box>
  );
};

export const ResponsiveSpacing = () => {
  return (
    <Box>
      <CurrentBreakpointIndicator />
      <ResponsiveSpacingDemo />
    </Box>
  );
};

export const DeveloperGuide = () => {
  return (
    <Box>
      <DeveloperReference />
    </Box>
  );
};

BreakpointOverview.storyName = "Overview & Reference";
ResponsiveSpacing.storyName = "Spacing Adjustments";
