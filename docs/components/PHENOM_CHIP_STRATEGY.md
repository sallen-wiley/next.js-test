# Phenom Design System: Chip/Pill/Tag Strategy

## Problem Statement

The Phenom Design System has two distinct component types that both map to MUI's `Chip` component:

### Pills (Interactive)

- **Colors**: Neutral only
- **Variants**: Outlined, Contained
- **Border Radius**: Very round (12px+)
- **Size**: 24px height (one size)
- **Behavior**: Interactive (clickable, deletable)
- **Use Case**: Actions, filters, selections

### Tags (Display Only)

- **Colors**: Multiple semantic colors (primary, secondary, error, warning, info, success)
- **Variants**: Outlined, Solid, Solid Light
- **Border Radius**: Minimal (2px)
- **Sizes**: Large (20px), Small (16px)
- **Behavior**: Non-interactive (display only)
- **Use Case**: Status badges, labels, metadata

## Solution: Semantic Variant Mapping

Use MUI Chip's existing architecture with Phenom-specific theme overrides. **No new wrapper components needed.**

### Strategy

1. **Pills = MUI Chip defaults** (when interactive)
2. **Tags = Custom variants** in Phenom theme
3. **Theme handles all styling** - no sx props in usage
4. **Interactivity determines behavior** - handlers = pill, no handlers = tag

### Implementation Pattern

#### For Pills (Interactive, Neutral)

```tsx
// Outlined pill
<Chip
  label="Filter Active"
  variant="outlined"
  color="neutral"
  onClick={handleClick}
  onDelete={handleDelete}
/>

// Filled pill
<Chip
  label="Selected"
  variant="filled"
  color="neutral"
  onClick={handleClick}
/>
```

#### For Tags (Display Only, Colored)

```tsx
// Tag - outlined
<Chip
  label="Pending"
  variant="outlined"
  color="warning"
  size="small"  // 16px
/>

// Tag - solid
<Chip
  label="Approved"
  variant="filled"
  color="success"
/>

// Tag - solid light (custom variant)
<Chip
  label="Draft"
  variant="solid-light"
  color="info"
/>
```

## Theme Configuration

### Current Phenom Chip Styling

The Phenom theme already defines tags with:

- `height: 20px` (default/large tag size)
- `height: 16px` (small tag size)
- `borderRadius: 2px` (tag corners)
- `solid-light` variant (custom)

### Required Updates

**Update the Phenom theme to distinguish Pills from Tags based on interactivity:**

```typescript
MuiChip: {
  defaultProps: {
    // Pills use neutral by default for Phenom
    // Tags use semantic colors
  },
  styleOverrides: {
    root: ({ ownerState, theme }) => {
      const isPill = !!(ownerState.onClick || ownerState.onDelete);

      return {
        // Base styles (Tags)
        textTransform: "uppercase",
        height: "20px",
        fontSize: "11px",
        lineHeight: "12px",
        borderRadius: "2px",

        // Pills override (when interactive)
        ...(isPill && {
          height: "24px",
          borderRadius: "12px",
          textTransform: "none",  // Pills not uppercase
          fontSize: "14px",
          lineHeight: "16px",
        }),
      };
    },
    sizeSmall: ({ ownerState }) => {
      const isPill = !!(ownerState.onClick || ownerState.onDelete);

      return {
        // Small tag
        height: "16px",

        // Small pill (if needed)
        ...(isPill && {
          height: "20px",
          borderRadius: "10px",
        }),
      };
    },
    // Color restrictions
    colorPrimary: ({ ownerState }) => {
      const isPill = !!(ownerState.onClick || ownerState.onDelete);

      // Pills should only use neutral
      if (isPill && ownerState.color !== 'neutral') {
        console.warn('Pills should use color="neutral" in Phenom theme');
      }
    },
  },
  variants: [
    // Keep existing solid-light variant for tags
    {
      props: { variant: "solid-light" },
      style: ({ theme, ownerState }) => {
        // ... existing implementation
      },
    },
  ],
},
```

## Usage Guidelines

### When to Use Pills

- User-initiated actions (filters, selections)
- Must be clickable or deletable
- Always use `color="neutral"`
- Use `variant="outlined"` or `variant="filled"`

### When to Use Tags

- Status indicators (badges, labels)
- Non-interactive metadata display
- Use semantic colors (`color="error"`, `color="success"`, etc.)
- Use `variant="outlined"`, `variant="filled"`, or `variant="solid-light"`
- Use `size="small"` for compact displays

### Current Usage (Manage Reviewers Filters)

The filter chips currently use:

```tsx
<Chip
  label="Availability: Available"
  onDelete={() => {
    /* clear filter */
  }}
  size="small"
  color="primary"
  variant="outlined"
/>
```

**These should be Pills** (interactive), so update to:

```tsx
<Chip
  label="Availability: Available"
  onDelete={() => {
    /* clear filter */
  }}
  color="neutral" // Pills are neutral in Phenom
  variant="outlined" // or "filled"
  // size removed - pills are always 24px
/>
```

## Benefits

✅ **No new components** - uses standard MUI Chip everywhere
✅ **No sx props** - all styling in theme
✅ **Semantic API** - interactivity determines behavior automatically
✅ **Theme-consistent** - works across all themes (Phenom gets special treatment)
✅ **Type-safe** - uses existing MUI types
✅ **Maintainable** - centralized in theme config

## Migration Checklist

- [ ] Update Phenom theme `MuiChip` overrides to detect interactivity
- [ ] Test Pills with `onClick`/`onDelete` handlers
- [ ] Test Tags without handlers
- [ ] Update filter chips in ReviewerSearchAndCards to use `color="neutral"`
- [ ] Document pattern in component stories
- [ ] Add Storybook examples for both Pills and Tags
