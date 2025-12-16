# Schema Exports

This directory contains timestamped exports of the public schema metadata from Supabase.

## Purpose

- **AI Reference**: Provides current schema structure for AI agents and documentation
- **Version Tracking**: Timestamped files track schema evolution over time
- **Development Aid**: Quick reference for table structures, relationships, and constraints

## File Format

Files are named `schema-YYYY-MM-DD-HHMMSS.json` with ISO 8601 timestamp.

## Content Structure

```json
{
  "schema": "public",
  "generated_at": "2024-12-16T10:30:00.000Z",
  "tables": [
    {
      "name": "table_name",
      "rls_enabled": true,
      "rows": 42,
      "primary_keys": ["id"],
      "columns": [
        {
          "name": "column_name",
          "data_type": "uuid",
          "is_nullable": false,
          "default": "gen_random_uuid()",
          "is_identity": false,
          "ordinal_position": 1,
          "checks": [...],
          "is_unique": true
        }
      ],
      "foreign_keys": [
        {
          "constraint_name": "fk_name",
          "source_columns": ["user_id"],
          "referenced_table": "public.users",
          "referenced_columns": ["id"]
        }
      ]
    }
  ]
}
```

## Generating New Export

```bash
node database/reviewer-ingestion/export-schema.js
```

## Usage in AI Prompts

Reference the latest schema export when asking AI about database structure:

> "Using the schema from database/schema-exports/schema-[latest].json, help me understand the relationship between manuscripts and reviewers."

## Gitignore

Schema exports are tracked in git to maintain schema history. If exports become too large or frequent, consider:

- Adding `*.json` to `.gitignore` in this directory
- Keeping only the latest export
- Archiving older exports separately
