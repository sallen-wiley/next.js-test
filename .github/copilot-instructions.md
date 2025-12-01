# Next.js + Material-UI Multi-Theme Demo Project

This is a comprehensive demonstration project showcasing Material-UI v7 with custom theming, design system integration, and Figma Code Connect workflow.

## Project Documentation

**Always refer to `README.md` for instructions on how to operate the project.** The README contains essential setup steps, project structure, and operational guidance. If instructions change or are expanded during development, suggest the user edit the README for clarity and future reference.

## Repository Configuration

This project uses a dual-remote setup:

- **wiley** remote → `wiley/pp-ux-tooling` (Wiley organization repository)
- **origin** remote → `sallen-wiley/next.js-test` (personal development fork)

Changes must be pushed to each repository separately:

```bash
# Push to each remote separately
git push origin main
git push wiley main
```

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

// different theme color tokens for light vs. dark mode
sx={[
  {
    bgcolor: "background.default",
  },
  (theme) =>
    theme.applyStyles("dark", {
      bgcolor: "action.hover",
  }),
]}

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

## Import Preferences

### Material UI Icons

- **Do NOT use barrel imports** for Material UI icons
- ❌ Avoid: `import { Add, Delete, Edit } from '@mui/icons-material';`
- ✅ Use: Individual imports for better tree-shaking and performance

```tsx
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
```

### Other Import Guidelines

- Use barrel imports for internal components and utilities
- Keep Material UI component imports as barrels (these are optimized)
- Individual icon imports improve bundle size and build performance

## PowerShell Command Guidelines

When generating terminal commands, always use proper PowerShell syntax:

### ✅ Correct PowerShell Syntax

```powershell
# Command chaining
cd C:\path\to\directory; Get-ChildItem
command1; command2; command3

# File operations
Copy-Item source.txt destination.txt
Move-Item old.txt new.txt
Remove-Item file.txt
New-Item -ItemType Directory -Path "folder"

# Environment variables
$env:VARIABLE_NAME
```

### ❌ Avoid Unix/Bash Syntax

```bash
# Don't use these in PowerShell
cd /path && ls -la && rm file.txt    # Wrong: && operator, Unix paths
cp file1 file2                       # Wrong: Unix commands
mkdir folder                         # Works but prefer New-Item
```

### Key PowerShell Differences

- Use `;` for command chaining (not `&&`)
- Use `\` for Windows paths (not `/`)
- Use PowerShell cmdlets (Copy-Item, not cp)
- Variables use `$env:` prefix

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

## Database Information (Supabase)

### Schema Access Pattern:

- **Dynamic Schema Inspection**: When working with database functions, inspect current schema using Supabase client queries rather than assuming structure
- **TypeScript Types**: Reference existing types in `src/types/roles.ts` for user roles and permissions
- **Authentication**: Supabase Auth with RLS policies - check permissions before operations
- **Data Service Patterns**: Follow patterns in `src/services/dataService.ts` for data operations

### Key Tables (inspect structure dynamically):

- `user_profiles` - RBAC and user management
- `manuscripts` - Main content with array fields (authors, keywords)
- `potential_reviewers` - Reviewer database with metrics
- `review_invitations` & `invitation_queue` - Invitation workflow system

### Development Approach:

- Always check table structure with sample queries when building functions
- Use existing TypeScript interfaces where available
- Respect RLS policies in data operations

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

## Dynamic Resource Indexing and Recommendations

To ensure guidance is always current across all development resources:

- **Always index the contents of `.github/chatmodes/`, `.github/prompts/`, and `.github/scripts/` at runtime.**
- **Privacy Policy**: Only files with "-live" in their filename are shared publicly. All others are private by default and for internal use only.
- For each resource file, extract the name and summary from its frontmatter, description, or header comments.
- List and briefly describe all available resources in the workspace, categorizing by type (chatmodes, prompts, scripts).
- When prompted, analyze the current conversation and context to recommend the most suitable resource(s).
- Do not use a hardcoded list—changes to resource files (additions, removals, edits) are automatically reflected.

**Example prompts:**

> "Index all development resources in `.github/`, summarize their purpose and ideal use case, and recommend the best tools for my current workflow based on recent conversation."

> "List all available chatmodes, prompts, and scripts. Filter to show only public ('-live') resources."
