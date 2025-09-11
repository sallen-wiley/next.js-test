import * as React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default {
  title: "Tokens/Spacing",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Demonstrates the spacing system using an 8px scaling factor. Use theme.spacing(number) with numeric values - supports both whole integers (spacing(1) = 8px, spacing(2) = 16px) and fractional values (spacing(0.5) = 4px, spacing(1.5) = 12px). The descriptive labels shown (like 'Small', 'Large', 'Distant') are suggested use cases only, not actual token names.",
      },
    },
  },
};

// Common spacing values component
const SpacingDemo = ({
  value,
  label,
  showHorizontal = false,
}: {
  value: number;
  label: string;
  showHorizontal?: boolean;
}) => {
  const theme = useTheme();
  const spacingPx = theme.spacing(value);

  return (
    <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
      <Typography
        variant="body2"
        sx={{ minWidth: 120, fontFamily: "monospace" }}
      >
        spacing({value})
      </Typography>
      <Typography
        variant="caption"
        sx={{ minWidth: 60, color: "text.secondary" }}
      >
        = {spacingPx}
      </Typography>
      <Typography variant="body2" sx={{ minWidth: 100 }}>
        {label}
      </Typography>
      <Box
        sx={{
          bgcolor: "primary.main",
          borderRadius: 1,
          ...(showHorizontal
            ? { width: spacingPx, height: "24px" }
            : { width: "24px", height: spacingPx }),
        }}
      />
    </Box>
  );
};

// Padding demonstration component
const PaddingDemo = ({ value, label }: { value: number; label: string }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="caption"
        sx={{ mb: 1, display: "block", fontFamily: "monospace" }}
      >
        padding: theme.spacing({value}) = {theme.spacing(value)}
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          p: value,
          bgcolor: "grey.50",
          display: "inline-block",
        }}
      >
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: "0.75rem",
          }}
        >
          {label}
        </Box>
      </Paper>
    </Box>
  );
};

// Margin demonstration component
const MarginDemo = ({ value, label }: { value: number; label: string }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="caption"
        sx={{ mb: 1, display: "block", fontFamily: "monospace" }}
      >
        margin: theme.spacing({value}) = {theme.spacing(value)}
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          p: 1,
          bgcolor: "grey.100",
          display: "inline-block",
        }}
      >
        <Box
          sx={{
            m: value,
            bgcolor: "secondary.main",
            color: "secondary.contrastText",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: "0.75rem",
            display: "inline-block",
          }}
        >
          {label}
        </Box>
      </Paper>
    </Box>
  );
};

export const CommonSpacingValues = () => {
  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Common Spacing Values (8px scaling factor)
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        These are the most commonly used spacing values. Use the numeric values
        with theme.spacing() - the labels are suggested use cases only.
      </Typography>

      <SpacingDemo value={0.5} label="Extra small" />
      <SpacingDemo value={1} label="Small" />
      <SpacingDemo value={1.5} label="Small-medium" />
      <SpacingDemo value={2} label="Medium" />
      <SpacingDemo value={3} label="Large" />
      <SpacingDemo value={4} label="Extra large" />
      <SpacingDemo value={6} label="XXL" />
      <SpacingDemo value={8} label="XXXL" />
    </Box>
  );
};

export const FractionalSpacing = () => {
  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Fractional Spacing Support
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        The spacing system supports decimal values for fine-grained control. Use
        the numeric values with theme.spacing() - labels are descriptive only.
      </Typography>

      <SpacingDemo value={0.25} label="Ultra fine" />
      <SpacingDemo value={0.5} label="Fine" />
      <SpacingDemo value={0.75} label="Fine-small" />
      <SpacingDemo value={1.25} label="Small-plus" />
      <SpacingDemo value={1.5} label="Medium-fine" />
      <SpacingDemo value={2.5} label="Medium-large" />
      <SpacingDemo value={3.5} label="Large-plus" />
    </Box>
  );
};

export const HorizontalSpacing = () => {
  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Horizontal Spacing Visualization
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Same spacing values shown horizontally for width/margin contexts.
      </Typography>

      <SpacingDemo value={1} label="Small" showHorizontal />
      <SpacingDemo value={2} label="Medium" showHorizontal />
      <SpacingDemo value={3} label="Large" showHorizontal />
      <SpacingDemo value={4} label="Extra large" showHorizontal />
      <SpacingDemo value={6} label="XXL" showHorizontal />
    </Box>
  );
};

export const PaddingExamples = () => {
  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Padding Examples
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Common padding applications using theme.spacing(). Labels are suggested
        use cases - use the numeric values in code.
      </Typography>

      <PaddingDemo value={0.5} label="Tight" />
      <PaddingDemo value={1} label="Compact" />
      <PaddingDemo value={2} label="Comfortable" />
      <PaddingDemo value={3} label="Spacious" />
      <PaddingDemo value={4} label="Generous" />
    </Box>
  );
};

export const MarginExamples = () => {
  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Margin Examples
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Common margin applications using theme.spacing(). Labels are suggested
        use cases - use the numeric values in code.
      </Typography>

      <MarginDemo value={1} label="Close" />
      <MarginDemo value={2} label="Separated" />
      <MarginDemo value={3} label="Distant" />
      <MarginDemo value={4} label="Far" />
    </Box>
  );
};

export const SpacingReference = () => {
  const theme = useTheme();

  const spacingValues = [
    0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 3.5, 4, 5, 6, 8, 10, 12,
  ];

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Typography variant="h6" gutterBottom>
        Complete Spacing Reference
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Quick reference for all recommended spacing values. Use
        theme.spacing(value) in your components.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 2,
          mb: 4,
        }}
      >
        {spacingValues.map((value) => (
          <Paper
            key={value}
            variant="outlined"
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontFamily: "monospace", minWidth: 80 }}
            >
              {value}
            </Typography>
            <Typography
              variant="caption"
              sx={{ minWidth: 40, color: "text.secondary" }}
            >
              {theme.spacing(value)}
            </Typography>
            <Box
              sx={{
                bgcolor: "primary.main",
                width: "16px",
                height: theme.spacing(value),
                maxHeight: "40px",
                borderRadius: 0.5,
                flexShrink: 0,
              }}
            />
          </Paper>
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Usage Examples
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        Always use numeric values with theme.spacing() - not the descriptive
        labels.
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50" }}>
        <Typography
          variant="body2"
          component="pre"
          sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}
        >
          {`// ✅ Correct usage - use numeric values
sx={{ 
  padding: theme.spacing(2),        // 16px
  margin: theme.spacing(1.5),       // 12px
  gap: theme.spacing(0.5),          // 4px
}}

// ✅ Shorthand notation
sx={{ 
  pt: 2,    // paddingTop: 16px
  mr: 1.5,  // marginRight: 12px
  mb: 0.5,  // marginBottom: 4px
}}

// ❌ Don't use descriptive labels as tokens
sx={{ 
  padding: theme.spacing('comfortable'),  // This won't work
  margin: theme.spacing('distant'),       // This won't work
}}

// ✅ Multiple values
sx={{ 
  p: \`\${theme.spacing(1)} \${theme.spacing(2)}\`,  // "8px 16px"
  margin: theme.spacing(1, 2, 1, 2),                // "8px 16px 8px 16px"
}}`}
        </Typography>
      </Paper>
    </Box>
  );
};

CommonSpacingValues.storyName = "Common Values";
FractionalSpacing.storyName = "Fractional Values";
SpacingReference.storyName = "Complete Reference";
