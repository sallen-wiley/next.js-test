# RoleGuard Component - Purpose & Usage

## 🎯 Purpose

`RoleGuard` is a **declarative access control component** that:
- **Protects UI components** based on user roles or permissions
- **Shows/hides content** based on access rights
- **Displays friendly error messages** when access is denied
- **Prevents unauthorized users** from seeing protected content

## 📋 Current Usage

### ✅ Components Using RoleGuard

**Only 1 component currently uses RoleGuard:**
- `RoleManager` - Uses `requiredPermission="canManageUsers"`

### ❌ Components NOT Using RoleGuard

All other admin components rely on the parent `AdminPage` for access control:
- `AdminUserManager`
- `ManuscriptUserManager`
- `ReviewerMatchManager`
- `ReviewerManager`
- `ManuscriptManager`
- `ReviewInvitationManager`
- `InvitationQueueManager`
- `PublicationsManager`
- `RetractionsManager`

## 🔍 How Access Control Currently Works

### Admin Page Level (Parent)
The `/admin` page uses `useRoleAccess()` hook directly:
```tsx
const { hasPermission, profile, loading } = useRoleAccess();

// Shows warning alert if no permission
{!hasPermission("canManageUsers") && (
  <Alert severity="warning">
    You don't have permission to access admin tools...
  </Alert>
)}
```

**Problem:** This only shows a warning alert, but still renders all the admin components. Users without permission can still see and potentially interact with admin tools.

### Component Level (RoleManager)
Only `RoleManager` uses `RoleGuard`:
```tsx
<RoleGuard requiredPermission="canManageUsers">
  {/* Content only shown if user has permission */}
</RoleGuard>
```

**Benefit:** Content is completely hidden if user lacks permission.

## 🛡️ RoleGuard Features

### 1. **Role-Based Protection**
```tsx
<RoleGuard requiredRole="admin">
  <AdminPanel />
</RoleGuard>

<RoleGuard requiredRole={["admin", "editor"]}>
  <EditorPanel />
</RoleGuard>
```

### 2. **Permission-Based Protection**
```tsx
<RoleGuard requiredPermission="canManageUsers">
  <UserManagement />
</RoleGuard>

<RoleGuard requiredPermission="canEditManuscripts">
  <ManuscriptEditor />
</RoleGuard>
```

### 3. **Custom Fallback Messages**
```tsx
<RoleGuard 
  requiredPermission="canManageUsers"
  fallback={<CustomAccessDenied />}
>
  <Content />
</RoleGuard>
```

### 4. **Silent Hiding**
```tsx
<RoleGuard 
  requiredPermission="canManageUsers"
  showFallback={false}  // Returns null instead of showing error
>
  <Content />
</RoleGuard>
```

### 5. **Convenience Components**
```tsx
import { AdminOnly, EditorOnly, StaffOnly } from './RoleGuard';

<AdminOnly>
  <DeleteButton />
</AdminOnly>

<StaffOnly>
  <InternalDashboard />
</StaffOnly>
```

## ⚠️ Current Issues

### 1. **Inconsistent Access Control**
- Most admin components have **no protection** at the component level
- Only `RoleManager` uses `RoleGuard`
- Parent page shows warning but doesn't prevent access

### 2. **Security Gap**
- Users without `canManageUsers` permission can still:
  - See all admin components in the navigation
  - Click on admin sections
  - Potentially see data if they know the routes

### 3. **Permission Flash Issue** (Fixed)
- `RoleGuard` was checking permissions before they finished loading
- This caused a brief flash of "Permission Required" message
- **Fixed:** Now waits for permissions to load before checking

## 💡 Recommendations

### Option 1: Add RoleGuard to All Admin Components
Wrap each admin component with `RoleGuard`:
```tsx
// In AdminUserManager.tsx
export default function AdminUserManager() {
  return (
    <RoleGuard requiredPermission="canManageUsers">
      {/* existing content */}
    </RoleGuard>
  );
}
```

**Pros:**
- Consistent protection across all components
- Each component is self-protected
- Better security

**Cons:**
- More code duplication
- Need to update 9 components

### Option 2: Protect at Admin Page Level
Wrap the entire admin content area:
```tsx
// In admin/page.tsx
<RoleGuard requiredPermission="canManageUsers">
  <Box sx={{ display: "flex", gap: 3 }}>
    {/* All admin components */}
  </Box>
</RoleGuard>
```

**Pros:**
- Single point of protection
- Less code duplication
- Easier to maintain

**Cons:**
- All-or-nothing approach
- Can't have different permissions for different sections

### Option 3: Hybrid Approach (Recommended)
- Keep `RoleGuard` at component level for granular control
- Add `RoleGuard` to components that need specific permissions
- Use different permissions for different sections:
  ```tsx
  <RoleGuard requiredPermission="canManageUsers">
    <AdminUserManager />
  </RoleGuard>
  
  <RoleGuard requiredPermission="canEditManuscripts">
    <ManuscriptManager />
  </RoleGuard>
  ```

## 🔧 RoleGuard Implementation Details

### Loading State Handling
```tsx
// RoleGuard waits for permissions to load
if (loading) {
  return null; // Parent handles loading state
}
```

### Permission Check
```tsx
// Checks permission after loading completes
if (requiredPermission && !hasPermission(requiredPermission)) {
  return <AccessDeniedMessage />;
}
```

### Role Check
```tsx
// Checks role membership
if (requiredRole && !requiresRole(requiredRole)) {
  return <AccessDeniedMessage />;
}
```

## 📊 Permission Types Available

From `RolePermissions` interface:
- `canManageUsers`
- `canEditManuscripts`
- `canAssignReviewers`
- `canViewReports`
- `canEditSettings`
- And more...

## 🎯 Best Practices

1. **Use RoleGuard for sensitive operations**
   - User management
   - Role changes
   - Data deletion
   - Settings modification

2. **Use hooks for conditional rendering**
   ```tsx
   const { hasPermission } = useRoleAccess();
   {hasPermission("canEdit") && <EditButton />}
   ```

3. **Combine both approaches**
   - `RoleGuard` for entire sections
   - `hasPermission` for individual buttons/features

4. **Always wait for loading**
   - Check `loading` state before permission checks
   - Show loading UI while permissions load

## 🔐 Security Notes

- **Client-side only:** `RoleGuard` is for UX, not security
- **Server-side validation:** Always validate permissions on the backend
- **Database policies:** Supabase RLS policies provide real security
- **Defense in depth:** Use both client and server-side checks
