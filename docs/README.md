# Documentation Hub

Comprehensive documentation for the Next.js + Material-UI Demo Project.

## 🚀 Quick Start

**New to the project?** Start here:

1. **[Main README](../README.md)** - Project overview and features
2. **[Setup Guide](../SETUP_GUIDE.md)** - Complete setup and development workflow

## 📁 Documentation Structure

## ✅ Canonical Docs (Day-To-Day Order)

1. **[Setup Guide](../SETUP_GUIDE.md)** - Local onboarding and daily run workflow
2. **[Database SQL Scripts](../database/README.md)** - Migration order, RLS model, and DB operations
3. **[Schema Exports](../database/schema-exports/README.md)** - Current schema export workflow and file format
4. **[Reviewer Ingestion Scripts](../database/reviewer-ingestion/README.md)** - JSON ingestion, cleanup, and schema export tooling
5. **[RoleGuard Usage](ROLEGUARD_USAGE.md)** - Access control usage patterns in the app
6. **[Theme Guide](development/theme-guide.md)** - Theme development and customization workflow
7. **[Storybook Guide](development/storybook-guide.md)** - Story authoring and component exploration workflow
8. **[Figma Code Connect Runbook](development/figma-code-connect-runbook.md)** - Reliable one-component MCP flow and checklist

Use this list as the source of truth for active workflows. Everything else in this hub is supplemental or historical.

### 🛠️ Setup & Configuration

- **[Setup Guide](../SETUP_GUIDE.md)** - Primary onboarding and local development workflow
- **[Database SQL Scripts](../database/README.md)** - Canonical migration order, RLS model, and DB operations
- **[Schema Exports](../database/schema-exports/README.md)** - Current schema export workflow and file format
- **[Reviewer Ingestion Scripts](../database/reviewer-ingestion/README.md)** - JSON ingestion, cleanup, and schema export tooling
- **[RoleGuard Usage](ROLEGUARD_USAGE.md)** - Access control usage patterns in the app
- **[Password Reset Setup](setup/PASSWORD_RESET_SETUP.md)** - Supabase reset flow configuration

### 🔧 Development Workflow

- **[Storybook Guide](development/storybook-guide.md)** - Component development and story creation
- **[Theme Guide](development/theme-guide.md)** - Theme development and customization workflow
- **[Image Asset Workflow](development/image-asset-workflow.md)** - Source-first image optimization and generated runtime assets
- **[Figma Code Connect Runbook](development/figma-code-connect-runbook.md)** - Reliable one-component MCP workflow, resume checklist, and component guardrails
- **[MUI Best Practices](development/MUI_BEST_PRACTICES.md)** - Material-UI implementation standards

### 📚 Specialized References

- **[Reviewer Data Ingestion Deep Dive](../database/reviewer-ingestion/DATA_INGESTION_README.md)** - Extended ingestion architecture, data format, and troubleshooting
- **[Figma MCP Guidance](FIGMA_MCP_GUIDANCE.md)** - Team guidance for safe Figma-to-code usage
- **[Field Assumptions](development/field-assumptions.md)** - Product/UI assumption ledger
- **[Testing Loading States](TESTING_LOADING_STATES.md)** - QA checklist for standardized loading patterns
- **[Admin Actions FAB](ADMIN_ACTIONS_FAB.md)** - Context-aware admin action architecture
- **[Admin Component Permissions](ADMIN_COMPONENT_PERMISSIONS.md)** - Permission mapping by component and role
- **[Admin Interface Review](ADMIN_INTERFACE_REVIEW.md)** - UX/database integration review notes
- **[Admin Optimization Review](ADMIN_OPTIMIZATION_REVIEW.md)** - Performance and redundancy analysis
- **[Phenom Chip Strategy](components/PHENOM_CHIP_STRATEGY.md)** - Cross-design-system chip/tag semantic mapping
- **[Documentation Archive](archive/README.md)** - Historical feature and migration documentation

### 🎨 Component Documentation

- **[Palette Generator](components/palette-generator.md)** - HSV color palette generator tool
- **[Reviewer Drawer](components/reviewer-drawer.md)** - ReviewerProfileDrawer component usage guide

## 📖 Documentation Guidelines

### For New Team Members

1. Read the main [README](../README.md) for project overview
2. Follow the [Setup Guide](../SETUP_GUIDE.md) for complete onboarding
3. Reference specific guides in this directory as needed

### For Developers

- **Access control work**: Use [RoleGuard Usage](ROLEGUARD_USAGE.md)
- **Theme development**: Use [Theme Guide](development/theme-guide.md)
- **Component development**: Use [Storybook Guide](development/storybook-guide.md)
- **Database changes**: Use [Database SQL Scripts](../database/README.md)
- **Ingestion tooling**: Use [Reviewer Ingestion Scripts](../database/reviewer-ingestion/README.md)

### For Designers

- **Component exploration**: Use Storybook (`npm run storybook`)
- **Color palette creation**: Use [Palette Generator](components/palette-generator.md)
- **Theme customization**: Use [Theme Guide](development/theme-guide.md)

## 🔄 Document Maintenance

This documentation is organized by purpose:

- **Setup**: One-time configuration and installation
- **Development**: Ongoing development workflows and patterns
- **Components**: Specific component or feature documentation

All guides reference the main [Setup Guide](../SETUP_GUIDE.md) as the primary onboarding resource.
