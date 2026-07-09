# Reviewer Ingestion and Schema Export Scripts

This directory contains operational scripts for reviewer data ingestion, cleanup, and schema exports.

## Scripts

1. ingest.js
   - Ingests reviewer suggestion JSON into Supabase.
2. cleanup.js
   - Removes a manuscript and related reviewer-linked records.
3. export-schema.js
   - Exports schema metadata JSON into database/schema-exports/.

## Prerequisites

1. Install project dependencies from repo root:

```bash
npm install
```

2. Configure repo-root .env.local with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Optional alternative URL variable supported by scripts:

- SUPABASE_URL

3. Ensure base database migrations are applied.

Use migration order in database/README.md.

## Ingestion Usage

```bash
node database/reviewer-ingestion/ingest.js <path-to-json-file>
```

Example:

```bash
node database/reviewer-ingestion/ingest.js ./database/reviewer-ingestion/reviewer_suggestions_7832738.json
```

## Cleanup Usage

Dry run:

```bash
node database/reviewer-ingestion/cleanup.js --manuscript <identifier> --dry-run
```

Execute with prompt:

```bash
node database/reviewer-ingestion/cleanup.js --manuscript <identifier>
```

Force without prompt:

```bash
node database/reviewer-ingestion/cleanup.js --manuscript <identifier> --force
```

<identifier> can be any of:

- system_id
- submission_id
- custom_id

## Schema Export Usage

### One-time database prerequisite

Run this once in Supabase SQL Editor:

- database/create_schema_export_function.sql

This creates the get_schema_metadata() function used by export-schema.js.

### Export command

```bash
node database/reviewer-ingestion/export-schema.js
```

Output file pattern:

- database/schema-exports/schema-YYYY-MM-DD-HHMMSS.json

## Notes

- Scripts are designed to be idempotent where feasible.
- Ingestion uses upsert-style behavior for key entities.
- Service-role credentials are required for admin-level operations.

## Related Docs

- database/README.md
- database/schema-exports/README.md
- database/reviewer-ingestion/DATA_INGESTION_README.md (extended ingestion deep dive)
- docs/setup/PASSWORD_RESET_SETUP.md (auth-adjacent configuration example)

**Last reviewed:** 2026-07-08
