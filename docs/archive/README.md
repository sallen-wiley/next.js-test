# Documentation Archive

This directory contains historical documentation from completed features and refactorings. These files are kept for reference but are no longer actively maintained.

## Archive Organization

### reviewer-drawer-2025-12-17/

**Date**: December 17, 2025  
**Feature**: Reviewer Profile Drawer Component

Documentation from the implementation of the ReviewerProfileDrawer component:

- `REVIEWER_DRAWER_SUMMARY.md` - Project overview and component details
- `REVIEWER_DRAWER_ARCHITECTURE.md` - Data flow and technical architecture
- `IMPLEMENTATION_GUIDE_REVIEWER_DRAWER.md` - Integration instructions
- `DELIVERY_SUMMARY.md` - Delivery checklist and completion status

**Current Documentation**: See `/REVIEWER_DRAWER.md` for consolidated quick reference.

---

### metrics-refactor-2025-12-18/

**Date**: December 18, 2025  
**Feature**: Reviewer Metrics Consistency Refactoring

Documentation from the metrics terminology standardization and code deduplication:

- `METRICS_CONSISTENCY_REVIEW.md` - Summary of changes and standardized terms
- `METRICS_TERMINOLOGY_ANALYSIS.md` - Detailed analysis of terminology issues

**Implementation**: Changes are live in codebase. See `src/utils/reviewerStats.ts` and `src/components/reviewer/ReviewerMetricsDisplay.tsx`.

---

### database-migrations-2025-12/

**Date**: December 9-10, 2025  
**Features**: Database cleanup and status model redesign

Documentation from database schema reorganization and status model updates:

- `DATABASE_CLEANUP_SUMMARY.md` - SQL file reorganization (Dec 9)
- `SCHEMA_UPDATE_SUMMARY.md` - Schema export and two-table queue system (Dec 4)
- `STATUS_MODEL_REDESIGN.md` - Review invitation status model redesign (Dec 10)

**Current Documentation**: See `/database/README.md` for active migration guide and `/database/schema-exports/` for latest schema.

---

## Why Archive?

These documents served specific purposes during development:

- **Project Summaries**: Delivered feature overviews for stakeholder communication
- **Implementation Logs**: Step-by-step records of complex refactorings
- **Decision Records**: Captured reasoning for architectural choices

Once features are complete and integrated:

- Code becomes the source of truth
- Active documentation moves to `/docs/` organized structure
- Summary documents move here for historical reference

## Finding Current Documentation

**Looking for active documentation?**

- **Project Overview**: `/README.md`
- **Setup Instructions**: `/SETUP_GUIDE.md`
- **Component Guides**: `/docs/components/`
- **Development Workflow**: `/docs/development/`
- **Setup & Configuration**: `/docs/setup/`
- **Database Schema**: `/database/schema-exports/` (automated exports)
