# Admin Actions FAB System

A context-aware floating action button (FAB) system for page-specific admin actions, following the same pattern as the theme switcher FAB and header configuration system.

## Architecture

### Components

1. **AdminActionsContext** (`src/contexts/AdminActionsContext.tsx`)

   - Context provider for managing page-specific admin actions
   - Automatically clears actions when page unmounts
   - Provides `useAdminActions()` hook for pages to register actions

2. **AdminActionsFab** (`src/components/app/AdminActionsFab.tsx`)

   - Global FAB component that renders when actions are registered
   - Positioned bottom-right (below theme switcher FAB)
   - Only visible to admin/editor roles
   - Displays a menu of available actions

3. **Root Layout Integration** (`src/app/layout.tsx`)
   - AdminActionsProvider wraps the app
   - AdminActionsFab rendered globally

## Usage

### Registering Admin Actions

Pages use the `useAdminActions()` hook to register their context-specific actions. **Important**: Wrap action handlers in `useCallback()` and the actions array in `useMemo()` to prevent infinite re-renders:

```tsx
import { useAdminActions } from "@/contexts/AdminActionsContext";
import DeleteIcon from "@mui/icons-material/Delete";

export default function MyPage() {
  // Memoize your action handler
  const handleClearData = React.useCallback(async () => {
    // Your action logic here
  }, [/* dependencies */]);

  // Memoize the actions array
  const adminActions = React.useMemo(
    () => [
      {
        id: "clear-data",
        label: "Clear All Data",
        icon: <DeleteIcon />,
        onClick: handleClearData,
        destructive: true,
        tooltip: "Remove all data for this item",
      },
    ],
    [handleClearData]
  );

  // Register admin actions for this page
  useAdminActions(adminActions);

  return (
    // Your page content
  );
}
```

### Action Properties

```typescript
interface AdminAction {
  /** Unique identifier for the action */
  id: string;

  /** Display label for the menu item */
  label: string;

  /** Icon component to display (optional) */
  icon?: React.ReactNode;

  /** Action handler (sync or async) */
  onClick: () => void | Promise<void>;

  /** Whether the action is destructive (shows in red) */
  destructive?: boolean;

  /** Whether the action is disabled */
  disabled?: boolean;

  /** Tooltip or help text */
  tooltip?: string;
}
```

## Example: Manage Reviewers Page

The manage-reviewers page demonstrates the system with a "Clear All Invitations & Queue" action:

```tsx
// Import the hook and icons
import { useAdminActions } from "@/contexts/AdminActionsContext";
import ClearAllIcon from "@mui/icons-material/ClearAll";

// Memoize the action handler to prevent re-renders
const handleClearAllReviewers = React.useCallback(async () => {
  if (!manuscriptId) return;

  showConfirmDialog(
    "Clear All Invitations and Queue",
    `This will remove ALL pending invitations and queued reviewers...`,
    async () => {
      const result = await clearManuscriptReviewers(manuscriptId);
      await refreshAllReviewerData();
      showSnackbar(
        `Cleared ${result.removedInvitations} invitation(s)...`,
        "success"
      );
    }
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [manuscriptId, showConfirmDialog]);

// Memoize the actions array
const adminActions = React.useMemo(
  () => [
    {
      id: "clear-reviewers",
      label: "Clear All Invitations & Queue",
      icon: <ClearAllIcon />,
      onClick: handleClearAllReviewers,
      destructive: true,
      tooltip: "Remove all pending invitations and queued reviewers",
    },
  ],
  [handleClearAllReviewers]
);

// Register the actions
useAdminActions(adminActions);
```

## Design Decisions

### Positioning

- **Theme Switcher FAB**: Right side, vertically centered (`right: 24px, top: 50%`)
- **Admin Actions FAB**: Right side, vertically centered below theme switcher (`right: 24px, top: 50%, transform: translateY(calc(-50% + 72px))`)
- **Spacing**: 16px gap between FABs (72px total offset accounts for 56px FAB height + 16px gap)

### Permissions

- Only visible to users with `admin` or `editor` roles
- Uses `RoleGuard` component with `showFallback={false}`

### Automatic Cleanup

- Actions are cleared when the page component unmounts
- Prevents stale actions from appearing on other pages
- No manual cleanup required

### Visual Styling

- Uses `secondary` color (vs `primary` for theme switcher)
- Destructive actions shown in red with hover effect
- Menu appears above-left of the FAB

## Adding New Actions

To add admin actions to a page:

1. Import the hook and icons:

   ```tsx
   import { useAdminActions } from "@/contexts/AdminActionsContext";
   import YourIcon from "@mui/icons-material/YourIcon";
   ```

2. Create your action handler(s)
3. Register actions with `useAdminActions()`
4. Actions appear automatically when page loads
5. Actions disappear when page unmounts

## Best Practices

- **Memoization**: ALWAYS wrap action handlers in `useCallback()` and actions array in `useMemo()` to prevent infinite re-renders
- **Destructive Actions**: Always use `destructive: true` for dangerous operations
- **Confirmation**: Use dialog confirmation for destructive or irreversible actions
- **Feedback**: Show snackbar messages after action completion
- **Loading States**: Handle async operations properly with try/catch
- **Dependencies**: Include all dependencies in useCallback (use eslint-disable if needed for functions like showSnackbar that change every render but are stable in practice)
- **Tooltips**: Provide helpful tooltip text for complex actions

## Related Systems

- **Header Configuration**: `useHeaderConfig()` for page-specific header settings
- **Theme Switcher**: Global FAB for theme/color mode switching
- **Role Guard**: Permission system for UI elements

## File Locations

- Context: `src/contexts/AdminActionsContext.tsx`
- FAB Component: `src/components/app/AdminActionsFab.tsx`
- Example Usage: `src/app/reviewer-dashboard/manage-reviewers/page.tsx`
- Documentation: `docs/ADMIN_ACTIONS_FAB.md`
