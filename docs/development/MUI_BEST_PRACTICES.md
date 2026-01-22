# Material-UI Best Practices

This document outlines MUI implementation standards for the project.

## Core Principle

**Always follow official MUI documentation patterns unless explicitly approved to diverge.**

Before implementing any MUI component:

1. Check the latest [MUI documentation](https://mui.com/material-ui/getting-started/)
2. Use the official examples as the pattern
3. Only deviate from MUI patterns with explicit approval

## Common Components

### FormControlLabel with Checkbox

**✅ CORRECT - Simple string label:**

```tsx
<FormControlLabel
  control={
    <Checkbox
      checked={value}
      onChange={(e) => setValue(e.target.checked)}
      size="small"
    />
  }
  label="Yes"
/>
```

**❌ INCORRECT - Wrapped in Typography:**

```tsx
<FormControlLabel
  control={
    <Checkbox
      checked={value}
      onChange={(e) => setValue(e.target.checked)}
      size="small"
    />
  }
  label={<Typography variant="body2">Yes</Typography>}
/>
```

**Why?** MUI's FormControlLabel handles text styling automatically. Wrapping labels in Typography creates inconsistent alignment and spacing.

### Pattern Structure

For boolean filters with section headers:

```tsx
<Box>
  <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: "bold" }}>
    Filter Name
  </Typography>
  <FormControlLabel
    control={
      <Checkbox
        checked={filters.value}
        onChange={(e) =>
          setFilters({
            ...filters,
            value: e.target.checked,
          })
        }
        size="small"
      />
    }
    label="Yes"
  />
</Box>
```

## Grid Layout

**✅ CORRECT - Using `size` prop (MUI v6+):**

```tsx
<Grid size={{ xs: 12, md: 6 }}>
  <Component />
</Grid>
```

**❌ INCORRECT - Legacy props:**

```tsx
<Grid xs={12} md={6}>
  <Component />
</Grid>
```

## Styling

### Use Theme Variables

**✅ CORRECT - Theme-aware colors:**

```tsx
sx={{
  bgcolor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.primary,
}}
```

**❌ INCORRECT - Hardcoded colors:**

```tsx
sx={{
  bgcolor: "#ffffff",
  color: "#000000",
}}
```

### Spacing

Use theme spacing units:

```tsx
sx={{ mt: 2, p: 3 }} // 2 = 16px, 3 = 24px
```

## When to Diverge

Request approval before:

- Adding custom wrapper components
- Modifying MUI component structure
- Creating non-standard patterns
- Using deprecated props or patterns

## Reference Updates

When implementing MUI components, always reference the current official documentation for that component at https://mui.com/material-ui/

Last updated: January 22, 2026
