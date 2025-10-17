# Data Migration Plan

## Current State

✅ Working prototype with mock data  
✅ Well-defined TypeScript interfaces  
✅ Flexible data service layer  
✅ Environment-based data switching

## Migration Strategy

### Phase 1: Analysis (When you get real data)

1. **Examine JSON structure**

   ```bash
   # Analyze the JSON dump
   jq 'keys' data.json  # See top-level structure
   jq '.[0] | keys' data.json  # See object structure
   ```

2. **Map fields to current schema**
   - Document which JSON fields → which database columns
   - Identify missing fields (add as optional to TypeScript interfaces)
   - Note any data transformations needed

### Phase 2: Schema Evolution

```sql
-- Example: Add new columns discovered in real data
ALTER TABLE manuscripts ADD COLUMN IF NOT EXISTS source_system TEXT;
ALTER TABLE manuscripts ADD COLUMN IF NOT EXISTS external_id TEXT;
ALTER TABLE potential_reviewers ADD COLUMN IF NOT EXISTS orcid TEXT;

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_manuscripts_external_id ON manuscripts(external_id);
```

### Phase 3: Data Import Script

```javascript
// migration/importData.js
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

async function importData() {
  const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
  const supabase = createClient(url, key);

  // Transform and insert data
  for (const item of data) {
    const manuscript = {
      title: item.title,
      authors: Array.isArray(item.authors)
        ? item.authors
        : item.authors.split(","),
      abstract: item.abstract || item.summary,
      status: item.status || "submitted",
      // ... map other fields
    };

    const { error } = await supabase.from("manuscripts").insert(manuscript);

    if (error) console.error("Import error:", error);
  }
}
```

### Phase 4: Validation & Cutover

1. **Test data integrity**

   ```sql
   -- Validate import results
   SELECT COUNT(*) FROM manuscripts;
   SELECT status, COUNT(*) FROM manuscripts GROUP BY status;
   ```

2. **Update environment variable**

   ```env
   USE_MOCK_DATA=false
   ```

3. **Monitor and adjust**

## Contingency Plans

### If Real Schema is Completely Different

- Keep mock data service as fallback
- Create new service for real data
- Use environment flag to switch between services

### If JSON Structure is Complex

- Use JSON columns in PostgreSQL temporarily
- Extract to normalized tables over time
- PostgreSQL has excellent JSON support

## Data Mapping Template

| JSON Field    | DB Column         | Type        | Transformation  |
| ------------- | ----------------- | ----------- | --------------- |
| `title`       | `title`           | TEXT        | Direct          |
| `author_list` | `authors`         | TEXT[]      | Split on comma  |
| `submit_date` | `submission_date` | TIMESTAMPTZ | Parse ISO       |
| `keywords`    | `keywords`        | TEXT[]      | Direct or split |

## Migration Commands

```bash
# 1. Backup current data
npm run backup-db

# 2. Run migration script
node migration/importData.js

# 3. Validate import
npm run validate-migration

# 4. Switch to real data
echo "USE_MOCK_DATA=false" >> .env.local

# 5. Test application
npm run dev
```
