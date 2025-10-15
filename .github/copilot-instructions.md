# Next.js + Material-UI Multi-Theme Demo Project

This is a comprehensive demonstration project showcasing Material-UI v7 with custom theming, design system integration, and Figma Code Connect workflow.

## Architecture Overview

### Multi-Theme System

- **Theme Engine**: Located in `src/themes/` with 6 themes (default, sage, wiley, wiley2025, phenom, tech)
- **Color Mode Support**: Each theme supports light/dark/system modes via MUI's `useColorScheme()`
- **Theme Context**: `src/contexts/ThemeContext.tsx` manages theme state with localStorage persistence
- **Logo Context**: `src/contexts/LogoContext.tsx` coordinates logo switching with themes
- **Global FAB Switcher**: `src/components/app/FabThemeSwitcher.tsx` provides runtime theme/mode/logo switching

### Component Organization

- `src/components/app/` - App-level components (headers, global switchers)
- `src/components/mui/` - MUI component wrappers (minimal extensions only)
- `src/components/product/` - Product-specific components (logos, branding)
- `src/components/tokens/` - Storybook stories exposing theme fundamentals

### Key Development Patterns

#### Theme Development

- Each theme folder contains `index.ts`, `palette.ts`, `typography.ts`, `components.ts`
- **Light/Dark Mode**: All themes must support both light and dark modes using MUI's colorSchemes
- Custom palette colors: `neutral`, `black`, `white` (see `src/themes/types.ts`)
- Font integration via `/public/fonts/` and `/src/fonts/` structure
- Typography scales defined per theme with proper fallbacks

#### Component Development

- **MUI Extensions**: Limit custom MUI components - only extend when explicitly required
- **Styling Strategy**: All styling handled at MUI theme level, avoid component-level overrides
- **SX Props**: Use only for spacing/positioning (`sx={{ mt: 2, p: 3 }}`) or explicit design requirements
- **Light/Dark Mode Styling**: Use `(theme.vars || theme).palette.*` in SX props for reactive colors
- **Fixed Color Usage**: Override light/dark flexibility when design requires predictable colors (e.g., hero with dark image + white text)
- **Grid System**: Use MUI Grid with `size` prop (`<Grid size={{ xs: 12, md: 6 }}>`)
- **Theme-Aware Components**: Leverage `useTheme()` hook for dynamic styling
- **Custom Colors**: Available theme colors: `color="neutral"`, `color="black"`, `color="white"`

#### Light/Dark Mode Color Patterns

````tsx
// Reactive colors that adapt to light/dark mode
sx={{
  bgcolor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.primary,
  background: `linear-gradient(90deg, ${(theme.vars || theme).palette.background.default} 0%, ${(theme.vars || theme).palette.background.paper} 100%)`
}}

// Fixed colors that bypass light/dark mode (e.g., hero sections)
sx={{
  backgroundImage: `url(${imageUrl})`,
  color: "white", // Always white text on dark image
}}

#### Context Usage

```tsx
// Theme switching
const { currentTheme, setTheme, theme } = useThemeContext();

// Logo coordination
const { currentTenant, setTenant } = useLogoContext();

// Color mode (light/dark/system)
const { mode, setMode, systemMode } = useColorScheme();
````

## Essential Commands

```bash
# Development
npm run dev                    # Start Next.js dev server
npm run storybook             # Start Storybook on :6006

# Production & Deployment
npm run build                 # Build for production
npm run build-storybook       # Build Storybook static
npm run chromatic             # Deploy to Chromatic for visual testing

# Code Quality
npm run lint                  # ESLint with Next.js and Storybook rules
```

## Deployment & Branching

- **Vercel Deployment**: Automated on pushes to main branch
- **Branch Strategy**: Avoid branches when possible due to access limitations to branch environments
- **Disruptive Changes**: Use branches only for highly disruptive changes, merge quickly

## Figma Integration Workflow

### Code Connect Setup

- Config: `figma.config.json` specifies component mapping patterns
- Components: `**/*.figma.tsx` files map Figma components to React
- Example: `src/components/mui/inputs/Button.figma.tsx` shows complete mapping

### Component Mapping Pattern

```tsx
import figma from "@figma/code-connect";

figma.connect(Component, "figma-url", {
  props: {
    variant: figma.enum("Variant", { Text: "text", Outlined: "outlined" }),
    children: figma.string("Label"),
    startIcon: figma.boolean("Start Icon", {
      true: figma.children("Icon Left"),
    }),
  },
  example: ({ variant, children, startIcon }) => (
    <Component variant={variant} startIcon={startIcon}>
      {children}
    </Component>
  ),
});
```

## Demo Pages Structure

- `/` - Landing page with theme showcase
- `/kitchen-sink` - Comprehensive component library (240+ lines, all MUI components)
- `/typography-demo` - Font and typography demonstration
- `/experiments` - Experimental features and new patterns
- `/onboarding-demos` - User experience flows

## Critical Implementation Details

### Theme Type Augmentation

- Global MUI type extensions in `src/themes/types.ts`
- Custom palette colors enabled for Button, Chip components
- Button size override: `extraLarge` size available

### Layout Architecture

- Root layout: `src/app/layout.tsx` with provider nesting order:
  1. AppRouterCacheProvider (MUI)
  2. ThemeProvider (custom)
  3. LogoProvider (custom)
  4. CssBaseline + FabThemeSwitcher

### State Management

- Theme persistence via localStorage
- System color mode detection and respect
- Logo-theme coordination (wiley theme ↔ wiley logo)

### Build Considerations

- Next.js 15.3.2 with React 19 (concurrent features)
- Emotion CSS-in-JS for styling
- TypeScript strict mode enabled
- Storybook with Vite builder for faster development
- **MUI Grid**: Use `<Grid size={{ xs: 12, md: 6 }}>` (newer syntax, not legacy Grid props)
- **Component Extensions**: Minimal MUI extensions - only when explicitly agreed upon

## Common Tasks

### Adding New Theme

1. Create folder in `src/themes/[theme-name]/`
2. Implement `index.ts`, `palette.ts`, `typography.ts`, `components.ts`
3. Update `src/themes/index.ts` themes object
4. Add metadata to `FabThemeSwitcher.tsx`

### Creating Figma-Connected Component

1. Build component in `src/components/mui/`
2. Create corresponding `.figma.tsx` file
3. Map Figma properties to React props
4. Test with `figma connect` command

### Component Story Development

1. Create `.stories.tsx` in same directory as component
2. Use Storybook CSF3 format with proper controls
3. Include accessibility addon testing
4. Deploy to Chromatic for visual regression testing
