# Setup Guide for Next.js + Material-UI Demo Project

## Quick Start Instructions

Hi! Here's everything you need to get the app running on your machine.

## Prerequisites

- **Node.js**: Version 20.0.0 or higher (check with `node --version`)
- **npm**: Version 9.0.0 or higher (check with `npm --version`)

## 1. Clone and Install

```bash
git clone [repository-url]
cd next.js-test
npm install
```

## 2. Environment Setup

Create a `.env.local` file in the root directory with these environment variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# App Configuration (choose your setup mode)
NEXT_PUBLIC_ENABLE_AUTH=false              # Start with auth disabled for easier testing
USE_MOCK_DATA=true                          # Use mock data initially
NEXT_PUBLIC_AUTH_TYPE=supabase             # Use Supabase when auth is enabled
```

**Replace the placeholders with actual values:**

- `your_supabase_url_here` → Your Supabase project URL
- `your_supabase_anon_key_here` → Your Supabase anonymous/public key

> **Note**: I'll provide these actual values separately via secure communication.

## 3. Run the Application

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 4. Run Storybook (Optional)

```bash
# Start Storybook for component development
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006) to view the component library.

## Configuration Options

### Option A: Quick Demo Mode (Recommended First)

```bash
# .env.local
NEXT_PUBLIC_ENABLE_AUTH=false
USE_MOCK_DATA=true
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

- ✅ No login required
- ✅ Uses sample data
- ✅ Perfect for exploring the app

### Option B: Full Database Mode

```bash
# .env.local
NEXT_PUBLIC_ENABLE_AUTH=true
USE_MOCK_DATA=false
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

- 🔐 Requires Supabase login
- 📊 Uses real database
- 👥 Full user management features

## Test User Accounts (for Option B)

If you enable authentication, use these test accounts:

```
Email: designer@test.com
Password: test1234

Email: product@test.com
Password: test1234

Email: reviewer@test.com
Password: test1234
```

## Key Pages to Explore

- **Home**: [http://localhost:3000](http://localhost:3000) - Main landing with theme showcase
- **Kitchen Sink**: [http://localhost:3000/kitchen-sink](http://localhost:3000/kitchen-sink) - All MUI components
- **Typography Demo**: [http://localhost:3000/typography-demo](http://localhost:3000/typography-demo) - Font examples
- **Palette Generator**: [http://localhost:3000/experiments/palette-generator](http://localhost:3000/experiments/palette-generator) - HSV color tool
- **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin) - User management (when auth enabled)

## Features to Try

1. **Theme Switching**: Click the floating action button (bottom right) to switch between themes
2. **Color Modes**: Toggle light/dark mode for each theme
3. **Component Library**: Explore all MUI components in Kitchen Sink
4. **Responsive Design**: Test on different screen sizes
5. **Storybook**: Interactive component documentation

## Troubleshooting

### Node Version Issues

```bash
# Check your Node version
node --version

# If too old, install Node 20+ from https://nodejs.org
```

### Missing Dependencies

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Loading

- Ensure `.env.local` is in the root directory (same level as `package.json`)
- Restart the dev server after changing environment variables
- Check that variable names match exactly (case-sensitive)

### Supabase Connection Issues

- Verify the Supabase URL and key are correct
- Start with `USE_MOCK_DATA=true` to test without database
- Check browser console for specific error messages

## Project Structure

```
📁 src/
├── 📁 app/                    # Next.js pages
│   ├── 📁 experiments/        # Experimental features
│   ├── 📁 kitchen-sink/       # Component showcase
│   └── 📁 typography-demo/    # Typography examples
├── 📁 components/             # Reusable components
├── 📁 themes/                 # Custom MUI themes
├── 📁 contexts/               # React contexts
└── 📁 services/               # Data services
```

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run storybook        # Start component development
npm run lint             # Check code quality
```

## Getting Help

If you run into issues:

1. **Check the console** - Browser dev tools often show helpful error messages
2. **Try mock data mode** - Set `USE_MOCK_DATA=true` to isolate database issues
3. **Restart the server** - After changing environment variables
4. **Check Node version** - Ensure you're using Node 20+

## Development Workflow

### Theme Development

1. Use the theme switcher FAB (bottom-right corner)
2. Test all themes in both light and dark modes
3. Follow the `THEME_COPY_PASTE_GUIDE.md` for creating new themes

### Component Development

1. **Use Storybook** for isolated component development
2. **Test responsive design** across breakpoints
3. **Verify accessibility** with built-in a11y addon

### Database Development

1. **Start with mock data** (`USE_MOCK_DATA=true`)
2. **Develop API routes** with mock data first
3. **Switch to real data** when ready (`USE_MOCK_DATA=false`)

## Role-Based Access Control

### User Roles & Permissions

| Role                | Access Level       | Features Available                      |
| ------------------- | ------------------ | --------------------------------------- |
| **Admin**           | Full Access        | User management, all features           |
| **Editor**          | Content Management | Manuscript editing, reviewer assignment |
| **Designer**        | Design System      | UI components, design system access     |
| **Product Manager** | Analytics          | Data viewing, export capabilities       |
| **Reviewer**        | Limited            | Assigned reviews only                   |
| **Guest**           | Read-Only          | Basic viewing access                    |

### Managing Users and Roles

1. **Visit admin panel**: `/admin` (requires admin role)
2. **Assign roles**: Use the Role Management interface
3. **Test access**: Log in as different users to see role-based features

### Creating Additional Test Users

**Option 1: Supabase Dashboard (Recommended)**

1. Go to your Supabase dashboard → Authentication → Users
2. Click "Add user"
3. Create with simple credentials like `newuser@test.com` / `test1234`

**Option 2: Admin Interface**

1. Set `NEXT_PUBLIC_ENABLE_AUTH=true`
2. Visit `/admin` as an admin user
3. Use the "Create Test User" interface

**Option 3: Disable Auth for Testing**

```bash
# In .env.local
NEXT_PUBLIC_ENABLE_AUTH=false    # No login required
```

## Advanced Features

### Data Integration Setup

**Using Mock Data (Default)**

- No additional setup required
- Perfect for UI development and testing
- Visit `/data-demo` to see sample data

**Using Real Supabase Data**

1. **Set up Supabase project** at [supabase.com](https://supabase.com)
2. **Run database schema**: Copy `database/setup.sql` to Supabase SQL Editor
3. **Update environment**: Set `USE_MOCK_DATA=false`
4. **Add credentials**: Update Supabase URL and anon key

### Advanced Scripts

```bash
npm run build-storybook  # Build Storybook static
npm run chromatic        # Visual testing deployment
```

## What's Next?

After getting it running:

- Explore the different themes and components
- Try the palette generator tool
- Check out the Storybook documentation
- Test the authentication features (when enabled)
- Experiment with role-based access control
- Try creating new themes using the copy/paste guide

The app showcases modern React/Next.js patterns with Material-UI, so it's a great reference for component architecture and theming systems!
