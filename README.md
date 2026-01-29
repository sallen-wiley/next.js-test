# Next.js + Material-UI Demo Project

This is a comprehensive [Next.js](https://nextjs.org) project showcasing Material-UI (MUI) components, theming, and design system implementations. The project includes multiple demo pages, Storybook integration, and custom theme switching capabilities.

## Repository Information

This project is maintained in two repositories:

- **Organization Repository**: [`wiley/pp-ux-tooling`](https://github.com/wiley/pp-ux-tooling) - Primary Wiley organization repository
- **Development Fork**: [`sallen-wiley/next.js-test`](https://github.com/sallen-wiley/next.js-test) - Personal development fork

Changes must be pushed to each repository separately:

### Git Configuration

```bash
# View configured remotes
git remote -v

# Push to each repository separately
git push origin main    # Personal fork
git push wiley main     # Organization repo
```

## Features

- **Material-UI v7**: Latest version with emotion styling
- **Multiple Themes**: 6 custom themes (Default, Sage, Tech, Wiley, Wiley2025, Phenom) with dynamic switching
- **Light/Dark Mode**: Full color mode support across all themes
- **Supabase Integration**: Authentication, RBAC, and database features
- **Custom Components**: Reusable UI components with theme-aware styling
- **Storybook Integration**: Component documentation and testing
- **Typography Demo**: Comprehensive font and typography showcase
- **Kitchen Sink**: Complete component library examples
- **Figma Integration**: Code Connect for design-to-code workflow

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin tools and dashboards
│   ├── auth/               # Authentication pages
│   ├── data-demo/          # Real data demonstrations
│   ├── experiments/        # Experimental features
│   ├── kitchen-sink/       # Component showcase
│   ├── onboarding-demos/   # User onboarding flows
│   ├── reviewer-dashboard/ # Reviewer invitation system
│   ├── write-demo/         # Write operations demo
│   └── woaa/              # Custom demo page
├── components/            # Reusable components
│   ├── app/               # App-level components (headers, FAB)
│   ├── auth/              # Authentication components
│   ├── mui/               # MUI component wrappers
│   ├── product/           # Product-specific components (logos)
│   └── tokens/            # Design token stories
├── contexts/              # React contexts (theme, logo, header)
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities (Supabase client, RBAC)
├── services/              # Data services
├── themes/                # Custom MUI themes (6 themes)
├── types/                 # TypeScript type definitions
└── utils/                 # Helper utilities
database/                  # Supabase SQL schemas and migrations
docs/                      # Comprehensive documentation
```

## VS Code Workspace Personalization

For a personalized development environment in VS Code, refer to `project.code-workspace` in the project root. This file contains recommended tasks, settings, and extension suggestions tailored for Storybook, Material-UI, and Next.js workflows. You can further customize your workspace by editing this file to match your preferences.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to see the application

4. Run Storybook for component development:

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006) to view the Storybook interface.

## Active Projects

### ReX Components Migration (In Progress)

**Goal:** Migrate ReX Components design system from Figma to Storybook using Material UI with custom ReX theme.

**Status:** Phase 2 - Screen Documentation (1 of 15 screens documented)

**Documentation:** See [`/docs/rex-migration/README.md`](/docs/rex-migration/README.md) for complete project tracker.

**Key Files:**

- ReX Theme: `/src/themes/rex/`
- Documentation Stories: `/src/components/rex-flow/`
- Design Assets: `/reference/ReX steps/`
- Progress Tracker: `/docs/rex-migration/README.md`

---

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality
- `npm run storybook` - Start Storybook development server
- `npm run build-storybook` - Build Storybook for production
- `npm run chromatic` - Deploy to Chromatic for visual testing

## Key Technologies

- **Next.js 15.3.2** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **Material-UI v7.1** - React component library with custom theming
- **Emotion** - CSS-in-JS styling engine
- **TypeScript** - Type-safe development with strict mode
- **Supabase** - Authentication, RBAC, and PostgreSQL database
- **Storybook 9** - Component development and documentation
- **Chromatic** - Visual testing and review
- **Figma Code Connect** - Design-to-code integration
- **D3.js** - Data visualization for palette tools

## Theme System

The project includes a sophisticated theming system with:

- **Dynamic theme switching** via FloatingActionButton (FAB)
- **6 Brand Themes**: Default, Sage, Tech, Wiley, Wiley2025, Phenom
- **Light/Dark/System Mode**: Full color mode support for all themes
- **Custom color palettes** with extended neutral, black, and white variants
- **Custom typography scales** per theme with web font integration
- **Logo switching** coordinated with theme selection
- **Consistent design tokens** exposed via Storybook stories

## Development Workflow

1. **Component Development**: Use Storybook to develop and test components in isolation
2. **Visual Testing**: Chromatic integration for visual regression testing
3. **Design Integration**: Figma Code Connect for maintaining design-code consistency
4. **Type Safety**: Full TypeScript coverage for reliable development

## Demo Pages

- `/` - Main landing page with featured tools and demo links
- `/kitchen-sink` - Complete MUI component library showcase
- `/experiments/palette-generator` - HSV color palette generator
- `/onboarding-demos` - User onboarding workflow examples
- `/woaa` - WOAA demo implementation
- `/reviewer-dashboard` - Reviewer invitation management system
- `/data-demo` - Real Supabase data demonstrations
- `/write-demo` - Create operations with mock and real data
- `/admin` - Administrative tools and role management
- `/debug` - System diagnostics and connection testing

## Learn More

### Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Complete setup and development workflow
- **[Documentation Hub](docs/README.md)** - Comprehensive documentation index
- **[Authentication Guide](docs/setup/authentication-guide.md)** - Authentication & RBAC system
- **[Database Setup](docs/setup/database-setup.md)** - Supabase configuration and schema
- **[Theme Development](docs/development/theme-guide.md)** - Theme creation and customization
- **[Storybook Guide](docs/development/storybook-guide.md)** - Component development workflow

### Technologies

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Material-UI Documentation](https://mui.com/) - Comprehensive MUI component guide
- [Storybook Documentation](https://storybook.js.org/docs) - Component development best practices
- [Emotion Documentation](https://emotion.sh/docs) - CSS-in-JS styling guide

## Deployment

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Other Platforms

This project can be deployed to any platform that supports Node.js:

- Netlify
- AWS Amplify
- Railway
- Digital Ocean App Platform

## Contributing

1. Create a feature branch from `main` (avoid branches when possible due to deployment constraints)
2. Make your changes and test thoroughly
3. Test with Storybook (`npm run storybook`) and the development server (`npm run dev`)
4. Commit your changes with clear, descriptive commit messages
5. Push to both repositories separately:
   ```bash
   git push origin main
   git push wiley main
   ```

## Documentation

- **[Main Documentation Hub](docs/README.md)** - Organized guides for setup, development, and components
- **[Archive](docs/archive/README.md)** - Historical documentation from completed features

## License

This project is for demonstration purposes and internal development.

---

> 🤖
>
> - [README](./README.md) - Our project
> - [CHANGELOG](./backstage/CHANGELOG.md) — What we did
> - [ROADMAP](./backstage/ROADMAP.md) — What we wanna do
> - [POLICY](./backstage/POLICY.md) — How we do it
> - [HEALTH](./backstage/HEALTH.md) — What we accept
> - [/backstage-start](./.github/prompts/backstage-start.prompt.md) — The prompt that keeps us sane
>
> 🤖
