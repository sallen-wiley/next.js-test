# Admin Component Permissions

## Overview

All admin components are now protected with `RoleGuard` and appropriate permissions. This allows different admin roles to control different aspects of the system.

## Component Permission Mapping

| Component | Permission Required | Who Can Access |
|-----------|-------------------|----------------|
| **AdminUserManager** | `canManageUsers` | Admin only |
| **RoleManager** | `canManageUsers` | Admin only |
| **ManuscriptUserManager** | `canEditManuscripts` | Admin, Editor |
| **ManuscriptManager** | `canEditManuscripts` | Admin, Editor |
| **ReviewerMatchManager** | `canAssignReviewers` | Admin, Editor |
| **ReviewInvitationManager** | `canAssignReviewers` | Admin, Editor |
| **InvitationQueueManager** | `canAssignReviewers` | Admin, Editor |
| **ReviewerManager** | `canViewReviewerData` | Admin, Editor, Product Manager |
| **PublicationsManager** | `canViewReviewerData` | Admin, Editor, Product Manager |
| **RetractionsManager** | `canManageUsers` | Admin only |

## Permission Breakdown by Role

### Admin
- ✅ **Full access** to all components
- Has all permissions: `canManageUsers`, `canEditManuscripts`, `canAssignReviewers`, `canViewReviewerData`

### Editor
- ✅ Can edit manuscripts (`canEditManuscripts`)
- ✅ Can assign reviewers (`canAssignReviewers`)
- ✅ Can view reviewer data (`canViewReviewerData`)
- ❌ Cannot manage users (`canManageUsers`)

### Product Manager
- ✅ Can view reviewer data (`canViewReviewerData`)
- ❌ Cannot edit manuscripts
- ❌ Cannot assign reviewers
- ❌ Cannot manage users

### Designer
- ❌ No access to admin components
- Has `canViewDesignSystem` but not admin permissions

### Reviewer / Guest
- ❌ No access to admin components

## Implementation Details

### Loading State Handling
All components now check both:
1. **Data loading state** - Is component data still loading?
2. **Permission loading state** - Are user permissions still loading?

```tsx
const { loading: permissionsLoading } = useRoleAccess();

if (loading || permissionsLoading) {
  return <AdminLoadingState message="Loading..." />;
}
```

This prevents the permission flash issue where "Permission Required" would briefly appear before permissions finished loading.

### RoleGuard Wrapping
Each component wraps its content with `RoleGuard`:

```tsx
return (
  <RoleGuard requiredPermission="canManageUsers">
    <Box sx={{ p: 3 }}>
      {/* Component content */}
    </Box>
  </RoleGuard>
);
```

### Access Denied Behavior
When a user lacks the required permission:
- `RoleGuard` shows a friendly error message
- Content is completely hidden (not just disabled)
- User sees: "Permission Required" with details about what's needed

## Security Notes

- **Client-side protection**: `RoleGuard` is for UX, not security
- **Server-side validation**: Always validate permissions on the backend
- **Database policies**: Supabase RLS policies provide real security
- **Defense in depth**: Use both client and server-side checks

## Testing Different Roles

To test different permission levels:

1. **Create test users** with different roles:
   - `admin@test.com` → Admin role
   - `editor@test.com` → Editor role
   - `product@test.com` → Product Manager role

2. **Log in as each user** and navigate to `/admin`

3. **Verify access**:
   - Admin should see all components
   - Editor should see manuscript/reviewer components but not user management
   - Product Manager should only see reviewer data components
   - Other roles should see permission denied messages

## Future Enhancements

Consider adding:
- **Granular permissions** for specific actions (e.g., `canDeleteManuscripts`, `canViewSensitiveData`)
- **Role-based navigation** - Hide menu items user can't access
- **Permission indicators** - Show why user can/can't access something
- **Audit logging** - Track permission checks and access attempts
