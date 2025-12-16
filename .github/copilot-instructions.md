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

#### Per-Theme Prop Switching (runtime)

- Use `useThemeContext().currentTheme` as the stable theme id; switch props at render time. Example: Admin CTA uses `secondary` normally and `error` + `outlined` when `phenom` is active.

```tsx
import { useThemeContext } from "@/contexts/ThemeContext";

const { currentTheme } = useThemeContext();
const color = currentTheme === "phenom" ? "error" : "secondary";
const variant = currentTheme === "phenom" ? "outlined" : "text";

return <Button color={color} variant={variant}>Admin</Button>;
```

- Prefer semantic variants when possible (e.g., define `color="headerAction"` in each theme). Fall back to simple switches like above when you need a one-off per-theme tweak.

#### Context Usage

```tsx
// Theme switching
const { currentTheme, setTheme, theme } = useThemeContext();

// Logo coordination
const { currentTenant, setTenant } = useLogoContext();

// Color mode (light/dark/system)
const { mode, setMode, systemMode } = useColorScheme();

// Global header configuration
const { config, updateConfig } = useHeader();
```

#### Global Header System

The application uses a unified global header system managed through `HeaderContext`:

**Setup:**
- Header is rendered in root layout (`src/app/layout.tsx`) via `GlobalHeaderWrapper`
- All pages show the header by default with authentication actions
- Pages configure the header using `useHeaderConfig()` hook

**Configuration Options:**

```tsx
import { useHeaderConfig } from "@/contexts/HeaderContext";

useHeaderConfig({
  // Hide header completely (opt-out)
  hideHeader?: boolean,  // Default: false

  // Text displayed next to logo
  logoAffix?: string,  // Default: "Publishing Platforms UX"

  // Fixed positioning at top of viewport
  fixed?: boolean,  // Default: false

  // Container width settings
  containerProps?: {
    maxWidth?: false | "xs" | "sm" | "md" | "lg" | "xl",  // Default: false (full width)
    fixed?: boolean
  },

  // Custom right-side content (replaces default auth actions)
  rightSlot?: ReactNode,  // Default: <HeaderAuthActions /> (Sign In/Out)

  // Menu button callback (for mobile drawer)
  onMenuClick?: () => void
});
```

**Common Usage Patterns:**

```tsx
// Full-width header for dashboards
useHeaderConfig({
  logoAffix: "Review Dashboard",
  containerProps: { maxWidth: false }
});

// Constrained header for content pages
useHeaderConfig({
  logoAffix: "Component Library",
  containerProps: { maxWidth: "lg" }
});

// Opt-out for custom header implementation
useHeaderConfig({ hideHeader: true });

// Custom CTA section (overrides default auth)
useHeaderConfig({
  logoAffix: "My Page",
  rightSlot: <CustomActions />
});
```

**Important Notes:**
- **Never** render `<AppHeader />` or `<GlobalHeader />` directly in pages
- **Always** use `useHeaderConfig()` hook to configure the global header
- The header automatically integrates with authentication (Sign In/Sign Out)
- Logo swapping via FAB theme switcher works automatically
- Opt-out is required for pages with custom header implementations (e.g., notifications experiment)`

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

### Schema Reference

**Always use latest schema export:** Run `node database/reviewer-ingestion/export-schema.js` to generate current schema in `database/schema-exports/` - this is the single source of truth.

**Legacy reference:** `reference/database-schema-export.md` exists but may be outdated. Prefer the JSON exports.

### Schema Access Pattern:

- **Dynamic Schema Inspection**: When working with database functions, inspect current schema using Supabase client queries rather than assuming structure
- **Schema Export Script**: Use `node database/reviewer-ingestion/export-schema.js` to get complete, accurate schema metadata
- **TypeScript Types**: All database types defined in `src/lib/supabase.ts` - use these for type safety
- **Authentication**: Supabase Auth with RLS policies - check permissions before operations
- **Data Service Patterns**: Follow patterns in `src/services/dataService.ts` for data operations

### Core Tables

#### manuscripts
- **Purpose**: Manuscript submissions with metadata
- **Key Fields**: id (uuid), title (text), authors (text[]), journal (text), submission_date (timestamptz), doi (text), abstract (text), keywords (text[]), subject_area (text), status (text), system_id (uuid), submission_id (uuid), custom_id (text), article_type (text), version (integer), manuscript_tags (text[])
- **Status Values**: 'submitted', 'pending_editor_assignment', 'awaiting_reviewers', 'under_review', 'reviews_in_progress', 'reviews_complete', 'revision_required', 'minor_revision', 'major_revision', 'conditionally_accepted', 'accepted', 'rejected', 'desk_rejected', 'withdrawn'
- **Notable**: No editor_id column (removed in schema update), version must be > 0
- **RLS**: Enabled (all authenticated users)

#### potential_reviewers
- **Purpose**: Reviewer database with expertise and metrics (43 columns total)
- **Key Fields**: id (uuid), name (text), email (text UNIQUE), affiliation (text), expertise_areas (text[]), availability_status (text), response_rate (numeric), quality_score (numeric), current_review_load (int), max_review_capacity (int), average_review_time_days (int), h_index (int), orcid_id (text), is_board_member (bool), previous_reviewer (bool)
- **Extended Fields**: number_of_reviews, completed_reviews, currently_reviewing, citation_count, publication_year_from, publication_year_to, total_invitations, total_acceptances, average_response_time_hours
- **Availability Values**: 'available', 'busy', 'unavailable', 'sabbatical'
- **RLS**: Enabled (all authenticated users)

#### reviewer_manuscript_matches
- **Purpose**: AI-generated match scores linking reviewers to manuscripts
- **Key Fields**: id (uuid), manuscript_id (uuid FK), reviewer_id (uuid FK), match_score (numeric), calculated_at
- **Constraint**: Unique (manuscript_id, reviewer_id)
- **Usage**: Powers "Suggested Reviewers" tab - join with potential_reviewers to get reviewer details

#### review_invitations
- **Purpose**: Sent reviewer invitations with status tracking
- **Key Fields**: id (uuid), manuscript_id (uuid FK), reviewer_id (uuid FK), invited_date (timestamptz), due_date (timestamptz), status (text), response_date (timestamptz), invitation_round (int), queue_position (int), reminder_count (int), estimated_completion_date (date), invitation_expiration_date (timestamptz), report_invalidated_date (timestamptz)
- **Status Values**: 'pending', 'accepted', 'declined', 'report_submitted', 'invalidated', 'revoked'
- **RLS**: Enabled (all authenticated users)

#### invitation_queue
- **Purpose**: Queued reviewer invitations waiting to be sent
- **Key Fields**: id (uuid), manuscript_id (uuid FK), reviewer_id (uuid FK), queue_position (int), created_date (timestamptz), scheduled_send_date (timestamptz), priority (text), notes (text), sent (bool), sent_at (timestamptz)
- **Priority Values**: 'high', 'normal', 'low'
- **RLS**: Enabled (all authenticated users)
- **Data Service**: Use `getManuscriptQueue()` - returns `InvitationQueueItem[]` with joined reviewer details

#### user_manuscripts
- **Purpose**: Junction table linking users to manuscripts they manage
- **Key Fields**: id (uuid), user_id (uuid FK), manuscript_id (uuid FK), assigned_date (timestamptz), role (text), is_active (bool), created_at (timestamptz), updated_at (timestamptz)
- **Role Values**: 'editor', 'author', 'collaborator', 'reviewer'
- **RLS**: Enabled - users see own assignments, admins/editors see all
- **Usage**: Dashboard shows manuscripts where user_id = auth.uid()

#### user_profiles
- **Purpose**: User authentication and RBAC
- **Key Fields**: id (uuid), email (text UNIQUE), full_name (text), role (text), department (text), permissions (text[]), is_active (bool), last_login (timestamptz), created_at (timestamptz), updated_at (timestamptz)
- **Role Values**: 'admin', 'editor', 'designer', 'product_manager', 'reviewer', 'guest'
- **Foreign Key**: id → auth.users.id
- **RLS**: Enabled - all authenticated users can read, users can update own profile, admins can update any

#### reviewer_publications
- **Purpose**: Reviewer publication history
- **Key Fields**: id (uuid), reviewer_id (uuid FK), title (text), doi (text UNIQUE), journal_name (text), authors (text[]), publication_date (date), is_related (bool)
- **RLS**: Enabled (all authenticated users)

#### reviewer_retractions
- **Purpose**: Track reviewer retractions
- **Key Fields**: id (uuid), reviewer_id (uuid FK), retraction_reasons (text[]), created_at (timestamptz)
- **RLS**: Enabled (all authenticated users)

### TypeScript Type Patterns

```typescript
// Import types from central location
import type {
  Manuscript,
  PotentialReviewer,
  PotentialReviewerWithMatch,  // Includes match_score
  ReviewInvitation,
  InvitationQueue,
  InvitationQueueItem,  // Includes reviewer_name, reviewer_affiliation (joined)
  ManuscriptWithUserRole,  // Includes user_role, assigned_date (joined)
} from "@/lib/supabase";

// Service function returns typed data
export async function getManuscriptReviewers(
  manuscriptId: string
): Promise<PotentialReviewerWithMatch[]> {
  // Joins reviewer_manuscript_matches + potential_reviewers
}

export async function getManuscriptQueue(
  manuscriptId: string
): Promise<InvitationQueueItem[]> {
  // Joins invitation_queue + potential_reviewers
}
```

### Reviewer Dashboard Workflow

The reviewer dashboard implements a two-page workflow:

#### 1. Article Details Page (`/reviewer-dashboard/`)
- **Purpose**: Shows manuscript metadata and review status overview
- **Data Sources**:
  - `getUserManuscripts(userId)` - Fetches user's assigned manuscripts via `user_manuscripts` junction
  - `getManuscriptInvitations(manuscriptId)` - Fetches sent invitations
  - `getManuscriptQueue(manuscriptId)` - Fetches queued invitations with reviewer names
- **UI Features**:
  - Displays article metadata (title, authors, journal, abstract, keywords)
  - Shows collapsible "Reviewers" accordion with invitation status metrics
  - **Conditionally displays queue** - Shows queued reviewers when queue.length > 0
  - "Manage Reviewers" CTA navigates to management interface
  - Back button to reviewer dashboard listing

#### 2. Manage Reviewers Page (`/reviewer-dashboard/manage-reviewers/`)
- **Purpose**: Multi-tab interface for managing reviewer invitations
- **Tabs**:
  - **Potential Reviewers**: Two-mode system
    - **Suggested Mode (default)**: Shows reviewers from `reviewer_manuscript_matches` with match scores
    - **Browse All Mode**: Shows entire `potential_reviewers` table (toggle button switches modes)
    - Filter/sort by availability, match score, search term
  - **Invitations**: View/manage sent invitations from `review_invitations`
  - **Queue**: View/manage queued invitations with drag-and-drop reordering
- **Data Sources**:
  - `getManuscriptReviewers(manuscriptId)` - Suggested reviewers with match scores
  - `getAllReviewers()` - Full reviewer database for browse mode
  - `getManuscriptInvitations(manuscriptId)` - Sent invitations
  - `getManuscriptQueue(manuscriptId)` - Queue with reviewer names
  - `addToQueue(manuscriptId, reviewerId, priority)` - Add reviewer to queue
  - `removeFromQueue(queueItemId)` - Remove from queue
  - `updateQueuePositions(updates[])` - Reorder queue after drag-and-drop
- **Key Features**:
  - Dynamic manuscript card (fetched via `getManuscriptById`)
  - Lazy-loading of full reviewer database when switching to Browse All mode
  - Real-time queue updates with reviewer names displayed

### Development Best Practices

- **Always use TypeScript types** from `src/lib/supabase.ts`
- **Follow service layer patterns** in `src/services/dataService.ts`
- **Join tables for display data** - Don't just return FKs, join to get names/details
- **Respect RLS policies** - Test data access with different user roles
- **Use descriptive type names** - `PotentialReviewerWithMatch`, `InvitationQueueItem` (not just base types)
- **Handle empty states** - Check array lengths before mapping/displaying
- **Error handling** - Service functions log detailed errors with {message, details, hint, code}

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
````
