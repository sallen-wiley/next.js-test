# Admin Role Implicit Access Implementation

## Overview

Admins now have implicit access to **all manuscripts** without requiring explicit assignment records in the `user_manuscripts` table.

## Implementation Strategy

### ✅ No Database Migration Required

This is a **query-level implementation** - no database schema changes needed.

### How It Works

#### 1. Helper Function (`isUserAdmin`)

```typescript
async function isUserAdmin(userId: string): Promise<boolean>;
```

- Checks `user_profiles.role` column
- Returns `true` if role is `"admin"`
- Cached at query level for performance

#### 2. Modified `getUserManuscripts(userId)`

**Before:** Only returned manuscripts from `user_manuscripts` junction table

**After:**

- Checks if user is admin first
- If admin → Returns ALL manuscripts with implicit `user_role: "admin"`
- If not admin → Returns only assigned manuscripts (existing behavior)

**Admin Response Format:**

```typescript
[
  {
    ...manuscriptFields,
    user_role: "admin", // Implicit role
    assigned_date: "2025-12-04", // Current timestamp
    is_active: true,
  },
];
```

#### 3. Updated `getManuscriptById(manuscriptId, userId?)`

- Added optional `userId` parameter for future access control
- Currently returns manuscript if it exists (no permission check)
- Auth/access control happens at route/component level
- Documented that admins have implicit access

## Benefits

✅ **No Database Bloat**

- No need for thousands of admin assignment records
- Clean audit trail in `user_manuscripts` (only real assignments)

✅ **Automatic Access**

- New manuscripts are instantly visible to admins
- No manual intervention or background jobs needed

✅ **Clear Role Separation**

- App role (`admin`) = system-wide permissions
- Manuscript role (`editor`, `author`, etc.) = manuscript-specific relationship

✅ **Flexible UI**

- Can show role badges: "Viewing as Admin" vs "Editor"
- Easy to filter/sort by actual assignment vs admin view

✅ **Backward Compatible**

- Non-admin users experience no change
- Existing user_manuscripts records unaffected

## Testing Checklist

### Admin User Tests

- [ ] Log in as admin user
- [ ] Navigate to `/reviewer-dashboard`
- [ ] Verify ALL manuscripts appear in listing
- [ ] Click into any manuscript detail page
- [ ] Verify full access to manage reviewers, invitations, queue
- [ ] Check that role badge shows "ADMIN" (if implemented)

### Non-Admin User Tests

- [ ] Log in as editor/designer/reviewer user
- [ ] Navigate to `/reviewer-dashboard`
- [ ] Verify ONLY assigned manuscripts appear
- [ ] Cannot access manuscripts not in `user_manuscripts` for that user

### UI Recommendations

Consider adding visual indicators:

```tsx
{
  manuscript.user_role === "admin" ? (
    <Chip label="ADMIN VIEW" color="warning" size="small" />
  ) : (
    <Chip label={manuscript.user_role.toUpperCase()} color="secondary" />
  );
}
```

## Files Modified

### 1. `database/admin_role_implicit_access.sql`

Documentation file explaining the approach (no SQL execution needed)

### 2. `src/services/dataService.ts`

- Added `isUserAdmin(userId)` helper function
- Updated `getUserManuscripts(userId)` with admin check
- Updated `getManuscriptById(manuscriptId, userId?)` signature

## Rollback Plan

If needed to revert:

1. Remove admin check from `getUserManuscripts`
2. Restore original query logic
3. Optionally: Create explicit admin assignments with background job

## Future Enhancements

### Option 1: Explicit Access Control in getManuscriptById

```typescript
export async function getManuscriptById(
  manuscriptId: string,
  userId: string
): Promise<Manuscript | null> {
  const isAdmin = await isUserAdmin(userId);

  if (!isAdmin) {
    // Check user_manuscripts for access
    const hasAccess = await checkUserManuscriptAccess(userId, manuscriptId);
    if (!hasAccess) {
      throw new Error("Access denied");
    }
  }

  // ... rest of function
}
```

### Option 2: Permission-Based Access

Expand beyond just admin:

```typescript
// Check user_profiles.permissions array
const canAccessAllManuscripts =
  profile.role === "admin" ||
  profile.permissions.includes("view_all_manuscripts");
```

### Option 3: Audit Logging

Log when admins access manuscripts:

```typescript
if (isAdmin) {
  await logAdminAccess({
    userId,
    action: "view_manuscript",
    manuscriptId,
    timestamp: new Date(),
  });
}
```

## Questions & Answers

**Q: Will this affect performance?**
A: Minimal impact. Admin check is one additional query, but admins get simpler query (no join). For 1000 manuscripts, admin query is faster than join-based query.

**Q: Can we still assign admins to specific manuscripts?**
A: Yes! You can still create `user_manuscripts` records for admins with specific manuscript roles (editor, reviewer, etc.). The implicit access just means they see everything regardless.

**Q: What about RLS (Row Level Security)?**
A: Supabase RLS policies should allow admins to SELECT all manuscripts. Current policies appear to be public read or authenticated read, so no changes needed.

**Q: How do we distinguish between "admin viewing" vs "admin assigned as editor"?**
A: Check the `user_role` field:

- If from `getUserManuscripts` and equals "admin" → Implicit access
- If equals "editor", "author", etc. → Explicit assignment (even if user is also admin)

## Support

For questions or issues, refer to:

- Supabase schema: `reference/database-schema-export.md`
- RBAC implementation: `src/lib/rbac.ts`
- Role types: `src/types/roles.ts`
