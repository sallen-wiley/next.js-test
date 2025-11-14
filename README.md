# Next.js + Material-UI Demo Project

This is a comprehensive [Next.js](https://nextjs.org) project showcasing Material-UI (MUI) components, theming, and design system implementations. The project includes multiple demo pages, Storybook integration, and custom theme switching capabilities.

## Features

- **Material-UI v7**: Latest version with emotion styling
- **Multiple Themes**: Default, Sage, Tech, and Wiley themes with dynamic switching
- **Custom Components**: Reusable UI components with theme-aware styling
- **Storybook Integration**: Component documentation and testing
- **Typography Demo**: Comprehensive font and typography showcase
- **Kitchen Sink**: Complete component library examples
- **Figma Integration**: Code Connect for design-to-code workflow

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── experiments/        # Experimental features
│   ├── kitchen-sink/       # Component showcase
│   ├── onboarding-demos/   # Demo pages
│   ├── typography-demo/    # Typography examples
│   └── woaa/              # Custom demo page
├── components/            # Reusable components
│   ├── app/               # App-level components
│   ├── examples/          # Example implementations
│   ├── kitchen-sink/      # Kitchen sink components
│   ├── mui/               # MUI component wrappers
│   ├── product/           # Product-specific components
│   └── tokens/            # Design tokens
├── contexts/              # React contexts for theme/state
├── themes/                # Custom MUI themes
└── fonts/                 # Font assets
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
- **Material-UI v7** - React component library
- **Emotion** - CSS-in-JS styling
- **TypeScript** - Type-safe development
- **Storybook** - Component development and documentation
- **Chromatic** - Visual testing and review
- **Figma Code Connect** - Design-to-code integration

## Theme System

The project includes a sophisticated theming system with:

- **Dynamic theme switching** via FloatingActionButton
- **Multiple brand themes**: Default, Sage, Tech, Wiley
- **Custom color palettes** and typography scales
- **Logo switching** coordinated with themes
- **Consistent design tokens** across components

## Development Workflow

1. **Component Development**: Use Storybook to develop and test components in isolation
2. **Visual Testing**: Chromatic integration for visual regression testing
3. **Design Integration**: Figma Code Connect for maintaining design-code consistency
4. **Type Safety**: Full TypeScript coverage for reliable development

## Demo Pages

- `/` - Main landing page with theme showcase
- `/kitchen-sink` - Complete component library
- `/typography-demo` - Font and typography examples
- `/experiments` - Experimental features and patterns
- `/onboarding-demos` - User onboarding examples
- `/woaa` - Custom demo implementation

## Learn More

### Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Complete setup and development workflow
- **[Documentation Hub](docs/README.md)** - Comprehensive documentation index
- **[Authentication Guide](docs/setup/authentication-guide.md)** - Authentication & RBAC system
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

1. Create a feature branch from `main`
2. Make your changes
3. Test with Storybook and run the development server
4. Submit a pull request with a clear description

## License

This project is for demonstration purposes and internal development.
