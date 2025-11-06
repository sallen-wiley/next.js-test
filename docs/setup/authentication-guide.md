# Authentication & Role System - Final Documentation

## 🚀 Overview

This is a complete authentication and role-based access control system built with:

- **Next.js 15** + **TypeScript**
- **Supabase** for authentication and database
- **Material-UI v7** for UI components
- **Row Level Security** for data protection

## 📁 Architecture

```
src/
├── components/auth/
│   ├── AuthWrapper.tsx          # Main authentication orchestrator
│   ├── AuthProvider.tsx         # Supabase auth context provider
│   ├── SupabaseAuth.tsx         # Professional login/signup UI
│   ├── RoleGuard.tsx           # Component-level access control
│   ├── RoleManager.tsx         # Admin interface for role management
│   └── AdminUserManager.tsx    # User account creation & management
├── hooks/
│   └── useRoles.ts             # Role management hooks
├── types/
│   └── roles.ts                # Role definitions and permissions
└── utils/supabase/
    ├── client.ts               # Browser Supabase client
    └── server.ts               # Server-side Supabase client
```

## 🔧 Setup Instructions

### 1. Database Setup

Run `database/setup.sql` in your Supabase SQL Editor to create:

- `user_profiles` table with role system
- Row Level Security policies
- Automatic profile creation for new users

### 2. Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional toggles
NEXT_PUBLIC_ENABLE_AUTH=true     # Enable/disable authentication
USE_MOCK_DATA=false              # Use real Supabase data
```

### 3. Make Yourself Admin

After running the setup, update your role:

```sql
UPDATE user_profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

## 👥 User Roles

| Role                | Access Level       | Description                             |
| ------------------- | ------------------ | --------------------------------------- |
| **admin**           | Full Access        | User management, system settings        |
| **editor**          | Content Management | Manuscript editing, reviewer assignment |
| **designer**        | Design System      | UI components, design system access     |
| **product_manager** | Analytics          | Data viewing, reporting                 |
| **reviewer**        | Limited            | Review assignments only                 |
| **guest**           | Read-Only          | Basic viewing access                    |

## 🛡️ Using Role-Based Access Control

### Component Protection

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

### Hook Usage

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

## 🔄 Authentication Flow

1. **App loads** → `AuthWrapper` checks auth status
2. **Not authenticated** → Show `SupabaseAuth` login screen
3. **User logs in** → Supabase creates session
4. **Profile lookup** → `useRoles` fetches user profile from `user_profiles`
5. **Role-based rendering** → Components show/hide based on permissions

## 🎛️ Admin Features

### User Management (`/admin`)

- Create new user accounts
- View all registered users
- Manage user roles and permissions
- Toggle user active/inactive status

### Role Management

- Assign roles to users
- View role definitions and permissions
- Bulk role updates

## 🔧 Toggle Authentication

For development/testing, you can disable authentication:

```bash
NEXT_PUBLIC_ENABLE_AUTH=false    # Bypass all authentication
NEXT_PUBLIC_ENABLE_AUTH=true     # Require login (production)
```

## 📊 Features

### ✅ Implemented

- Complete user authentication with Supabase
- 6-role permission system with fine-grained controls
- Professional login/signup UI
- Admin user management interface
- Role-based component access control
- Automatic user profile creation
- SSR-compatible authentication state
- Environment-based auth toggle

### 🎯 Benefits

- **Scalable**: Easy to add new roles and permissions
- **Secure**: Row Level Security + role-based access
- **Professional**: Enterprise-ready user management
- **Flexible**: Can toggle auth on/off for development
- **Type-safe**: Full TypeScript support
- **Performance**: Optimized with proper loading states

## 🚀 Production Deployment

1. Set environment variables in your deployment platform
2. Ensure `NEXT_PUBLIC_ENABLE_AUTH=true` for production
3. Configure Supabase RLS policies for your security requirements
4. Create admin accounts through the admin interface

The system is now production-ready with enterprise-level user management!
