# Role-Based Access Control for Write Operations

## What Was Implemented

### ✅ **Server-Side Authorization**

- Created `src/utils/auth/server.ts` with role-checking functions
- Updated API routes to require admin/designer roles for write operations
- Added proper HTTP status codes (401 for unauthenticated, 403 for unauthorized)

### ✅ **API Route Security**

- **POST** `/api/articles` - Only admin/designer can create articles
- **PUT** `/api/articles` - Only admin/designer can update articles
- **DELETE** `/api/articles` - Only admin/designer can delete articles
- **GET** `/api/articles` - Still available to all users

### ✅ **Database Policies**

- Updated `database/enable_write_operations.sql` with role-based policies
- Restricts INSERT/UPDATE/DELETE to users with admin or designer roles
- Uses Row Level Security (RLS) for database-level enforcement

### ✅ **Frontend UI Updates**

- Shows current user role and permission status
- Disables form fields when user lacks permissions
- Displays clear access control messages
- Graceful error handling for permission failures

### ✅ **Better Error Messages**

- Specific messages for different authorization failures
- User-friendly explanations of role requirements
- TypeScript type safety throughout

## Role Permissions

| Role                | Create Articles | Update Articles | Delete Articles | Read Articles |
| ------------------- | --------------- | --------------- | --------------- | ------------- |
| **Admin**           | ✅ Yes          | ✅ Yes          | ✅ Yes          | ✅ Yes        |
| **Designer**        | ✅ Yes          | ✅ Yes          | ✅ Yes          | ✅ Yes        |
| **Editor**          | ❌ No           | ❌ No           | ❌ No           | ✅ Yes        |
| **Product Manager** | ❌ No           | ❌ No           | ❌ No           | ✅ Yes        |
| **Reviewer**        | ❌ No           | ❌ No           | ❌ No           | ✅ Yes        |
| **Guest**           | ❌ No           | ❌ No           | ❌ No           | ✅ Yes        |

## Files Modified

1. `src/app/api/articles/route.ts` - Added authorization checks
2. `src/app/write-demo/page.tsx` - Updated UI with role-based access
3. `src/hooks/useMutations.ts` - Enhanced error handling
4. `src/utils/auth/server.ts` - New auth utility functions
5. `database/enable_write_operations.sql` - Database policies

## Database Setup Required

**You need to run this SQL in your Supabase dashboard:**

```sql
-- Copy the contents of database/enable_write_operations.sql
-- and run it in Supabase SQL Editor
```

This will:

- Drop existing permissive policies
- Create new role-based policies
- Enforce admin/designer-only write access at the database level

## Security Features

### Multi-Layer Protection

1. **Frontend**: UI prevents unauthorized attempts
2. **API**: Server-side role validation
3. **Database**: Row-level security policies

### Authentication States

- **Not logged in**: Shows login prompt, all writes blocked
- **Wrong role**: Shows permission denied, form disabled
- **Correct role**: Full access to create/update/delete

### Error Handling

- 401 (Unauthorized): User not logged in
- 403 (Forbidden): User logged in but wrong role
- 400 (Bad Request): Invalid data or other errors
- 500 (Server Error): System errors

## Testing

### Test with Different Roles

1. **As Guest/Reviewer**: Should see "Access Denied"
2. **As Admin/Designer**: Should be able to create articles
3. **Not logged in**: Should see authentication required

### Mock vs Real Data

- Works with both `USE_MOCK_DATA=true` and `USE_MOCK_DATA=false`
- Authorization checks apply regardless of data source

## Next Steps

1. **Run the database SQL** to enable policies
2. **Test with different user roles** to verify access control
3. **Consider adding role assignment UI** for admin users
4. **Add audit logging** to track who creates/modifies articles

## Benefits

✅ **Secure**: Multiple layers of protection  
✅ **User-friendly**: Clear feedback on permissions  
✅ **Flexible**: Easy to modify role requirements  
✅ **Type-safe**: Full TypeScript coverage  
✅ **Scalable**: Can extend to other resources easily
