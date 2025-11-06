# Role-Based Access Control Setup Guide

## 🎯 What We've Built

You now have a comprehensive role-based access control system with:

- **6 User Roles**: Admin, Editor, Designer, Product Manager, Reviewer, Guest
- **Permission System**: Fine-grained permissions for different features
- **Role Management Interface**: Admin tools to assign and manage roles
- **Access Guards**: Components that automatically show/hide features based on roles

## 🚀 Setup Steps

### 1. Apply Role System Update

Since your `manuscripts` table already exists, use the role-specific update:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/rofjxefqomndhyrassig)
2. Navigate to **SQL Editor**
3. **Option A - Quick Setup**: Copy and paste the contents of `database/role_system_update.sql`
4. **Option B - Full Schema**: Copy and paste the contents of `database/schema.sql` (now uses `IF NOT EXISTS`)
5. Click **Run** to execute the schema

This will create:

- `user_profiles` table with roles and permissions
- Automatic profile creation when users sign up
- Row Level Security policies
- Profiles for any existing users (defaults to 'guest' role)

### 2. Test Role System

1. **Visit Admin Panel**: `http://localhost:3000/admin`
2. **Access Role Management**: Use the "Role Management" tab
3. **Assign Roles**: Change user roles to test different access levels

### 3. Role Definitions

| Role                | Access Level       | Permissions                             |
| ------------------- | ------------------ | --------------------------------------- |
| **Admin**           | Full Access        | User management, all features           |
| **Editor**          | Content Management | Manuscript editing, reviewer assignment |
| **Designer**        | Design System      | UI components, design system access     |
| **Product Manager** | Analytics          | Data viewing, export capabilities       |
| **Reviewer**        | Limited            | Assigned reviews only                   |
| **Guest**           | Read-Only          | Basic viewing access                    |

## 🔧 Usage Examples

### In Components

```tsx
import RoleGuard, { AdminOnly, StaffOnly } from '@/components/auth/RoleGuard';

// Permission-based access
<RoleGuard requiredPermission="canManageUsers">
  <UserManagementPanel />
</RoleGuard>

// Role-based access
<AdminOnly>
  <DeleteButton />
</AdminOnly>

<StaffOnly>
  <InternalDashboard />
</StaffOnly>
```

### In Hooks

```tsx
import { useRoleAccess } from "@/hooks/useRoles";

function MyComponent() {
  const { hasPermission, isAdmin, role } = useRoleAccess();

  if (hasPermission("canEditManuscripts")) {
    return <EditInterface />;
  }

  return <ReadOnlyView />;
}
```

## 📋 Next Steps

1. **Apply the schema** in Supabase SQL Editor
2. **Test the admin interface** at `/admin`
3. **Assign roles** to your test users
4. **Create team accounts** with appropriate roles:
   - `designer@yourcompany.com` → Designer role
   - `product@yourcompany.com` → Product Manager role
   - `admin@yourcompany.com` → Admin role

## 🎭 Role-Based Demo Flow

1. **Create test accounts** with different roles
2. **Log in as different users** to see different interfaces
3. **Demonstrate access control** - features appear/disappear based on role
4. **Show admin tools** - role assignment and user management

The system automatically creates user profiles when people sign up, defaulting to 'guest' role until an admin assigns appropriate permissions!
