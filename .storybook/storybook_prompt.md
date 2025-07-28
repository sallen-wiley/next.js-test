# MUI Component Storybook Story Generation

You are tasked with creating Storybook stories for MUI components that demonstrate their functionality. Follow these requirements exactly:

## Technical Requirements
- Use Storybook 9.0.13 with CSF 3.0 format
- Use `@storybook/nextjs-vite` imports
- MUI version 7
- Theme is already applied via preview.tsx, no additional theme handling needed

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

### 2. Error States (when applicable)
Include error state demonstrations for form components and components that can show error states.

### 3. Static Reference Stories
Create additional stories showing:
- All variants/options (like "AllVariants" in Typography example)
- Different states (loading, disabled, etc.)
- Size variations
- Color variations

## Color Handling
For components with color props, include these options:
- `"primary"`, `"secondary"`, `"error"`, `"warning"`, `"info"`, `"success"`
- **Plus custom theme colors**: `"black"`, `"white"`, `"neutral"`

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