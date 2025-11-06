# MUI Component Storybook Story Generation

You are tasked with creating Storybook stories for MUI components that demonstrate their functionality. Follow these requirements exactly:

## Technical Requirements

- Use Storybook 9.0.13 with CSF 3.0 format
- Use `@storybook/nextjs-vite` imports
- MUI version 7
- **Theme Switching**: Custom implementation using MUI's `useColorScheme` + Storybook `globalTypes`
- **Available Addons**: addon-docs (documentation), addon-a11y (accessibility), chromatic (visual testing)
- **Designer-Focused**: Optimized for component exploration and design validation, not developer testing
- Theme is applied via preview.tsx decorators - no additional theme handling needed in stories

## Storybook Configuration Context

### Active Addons & Features

- **@storybook/addon-docs**: Automatic documentation generation with autodocs
- **@storybook/addon-a11y**: Accessibility testing panel (shows violations and guidance)
- **@chromatic-com/storybook**: Visual regression testing integration

### Custom Theme System (MUI Best Practices)

- **Implementation**: Custom solution using MUI's `useColorScheme` + Storybook `globalTypes`
- **3 Brand Themes**: Wiley (default), Sage, Tech - accessible via custom toolbar
- **Color Modes**: Light (default), Dark, System - accessible via custom toolbar
- **Custom Colors**: Available in Wiley theme - may not exist in other themes
- **Designer Focus**: Optimized for component exploration, not developer workflows

## Story Structure Standards

Before creating any story, **first examine existing story files** in the codebase to understand established patterns, then follow this structure:

```typescript
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ComponentName } from "@mui/material";
// Import any additional MUI components needed

const meta: Meta<typeof ComponentName> = {
  title: "MUI Components/[Category]/[ComponentName]",
  component: ComponentName,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "[Brief description of component functionality]",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
```

## Component Organization

Organize stories exactly as MUI documentation categorizes components:

**Inputs**: Autocomplete, Button, Button Group, Checkbox, Floating Action Button, Radio Group, Rating, Select, Slider, Switch, Text Field, Transfer List, Toggle Button

**Data Display**: Avatar, Badge, Chip, Divider, Icons, Material Icons, List, Table, Tooltip, Typography

**Feedback**: Alert, Backdrop, Dialog, Progress, Skeleton, Snackbar

**Surfaces**: Accordion, App Bar, Card, Paper

**Navigation**: Bottom Navigation, Breadcrumbs, Drawer, Link, Menu, Pagination, Speed Dial, Stepper, Tabs

**Layout**: Box, Container, Grid, GridLegacy, Stack, Image List

## Story Requirements

### 1. Default Interactive Story

Create a `Default` story with:

- Full `argTypes` configuration for all visual/UI impacting props
- Meaningful default `args`
- Control types: `select`, `boolean`, `text`, `number` as appropriate
- **Test across themes**: Ensure stories work with Wiley/Sage/Tech themes and Light/Dark modes

### 2. Error States (when applicable)

Include error state demonstrations for form components and components that can show error states.

### 3. Static Reference Stories

Create additional stories showing:

- All variants/options (like "AllVariants" in Typography example)
- Different states (loading, disabled, etc.)
- Size variations
- Color variations
- **Accessibility considerations**: Check addon-a11y panel for violations and guidance

## Color Handling

For components with color props, include these options:

- `"primary"`, `"secondary"`, `"error"`, `"warning"`, `"info"`, `"success"`
- **Custom theme colors** (available in Wiley theme): `"black"`, `"white"`, `"neutral"`
- **Note**: Custom colors may not be available in all themes (Sage, Tech) - test across theme switcher

## Props Focus

- Focus on props that impact visual appearance and UI behavior
- Include size, variant, color, disabled, and state-related props
- Avoid internal/technical props that don't affect visual output
- Use appropriate control types for each prop

## Code Quality Standards

- Use proper TypeScript typing throughout
- Import only necessary MUI components
- Keep story descriptions concise but informative
- Use consistent naming patterns for story exports
- Disable controls for static reference stories: `parameters: { controls: { disable: true } }`
- **Designer Focus**: Prioritize visual clarity and component exploration over technical complexity
- **Accessibility**: Check addon-a11y panel for violations and address major issues
- **Theme Compatibility**: Test that stories work across all 3 theme variants using toolbar

## Example Pattern Reference

Study the provided Typography story structure, particularly:

- How argTypes are configured with proper control types
- How multiple story variants are created
- How custom wrapper components are handled
- How static reference stories are structured
- Story naming conventions and descriptions

## Custom Components (when needed)

If a component requires complex demonstration (like Typography's multi-component layout), create wrapper components following the Typography example pattern with:

- Clear interface definitions
- Numbered prop naming for multiple instances
- Descriptive control names
- Logical default values

Generate complete, functional stories that developers can immediately use to explore component capabilities and designers can reference for component behavior.
