# Database Setup

This folder contains the SQL scripts for setting up the authentication and role-based access control system.

## Files

### Current Setup

- **`final_setup.sql`** - Complete, production-ready setup script that:
  - Fixes all Supabase performance and security advisor warnings
  - Creates optimized RLS policies
  - Sets up the role-based access control system
  - Creates admin users
  - Resolves policy conflicts and performance issues

### Reference Files

- **`setup.sql`** - Original complete setup script
- **`schema.sql`** - Legacy schema definition

### Archived Files

- **`archive/`** - Contains earlier iterations and experimental scripts

## Quick Start

1. **Go to your Supabase Dashboard** → **SQL Editor**
2. **Run `final_setup.sql`** - This is the complete, optimized setup
3. **Replace `sallen@wiley.com` with your email** before running
4. **Verify setup** by checking the query results at the end

## What This Sets Up

✅ **User Profiles Table** - Extends Supabase auth with roles and permissions  
✅ **Role-Based Access Control** - 6 roles: admin, editor, designer, product_manager, reviewer, guest  
✅ **Optimized RLS Policies** - High-performance security policies  
✅ **Admin User Creation** - Makes your account an admin  
✅ **Automatic Profile Creation** - Trigger for new user signups

## Roles & Permissions

- **admin** - Full access to everything including user management
- **editor** - Content management and publishing
- **designer** - Design system and component management
- **product_manager** - Product features and workflow management
- **reviewer** - Review and approval workflows
- **guest** - Read-only access (default for new users)

## Troubleshooting

If you encounter issues:

1. Check the Supabase **Performance Advisor** and **Security Advisor**
2. Verify your email is correctly set in the admin creation section
3. Check that RLS is enabled: `ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;`
4. Ensure you're logged in when testing policies
