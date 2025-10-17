# Upgrading to Write Operations with Supabase

## Current State Analysis

✅ Read-only API routes  
✅ Mock data with realistic structure  
✅ Frontend hooks for data fetching  
✅ UI components with placeholder actions

## Required Changes for Write Operations

### 1. Extend API Routes (Add HTTP Methods)

#### Current: `/src/app/api/articles/route.ts`

```typescript
// ✅ Has: GET
export async function GET(request: NextRequest) { ... }

// ❌ Missing: POST, PUT, DELETE
```

#### Add Write Methods:

```typescript
// CREATE new article
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (USE_MOCK_DATA) {
    // Mock: Add to in-memory array (for demo)
    mockArticles.push({ ...body, id: crypto.randomUUID() });
    return NextResponse.json({ success: true });
  } else {
    // Real: Insert into Supabase
    const { data, error } = await supabase
      .from("manuscripts")
      .insert(body)
      .select();

    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json(data[0]);
  }
}

// UPDATE existing article
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (USE_MOCK_DATA) {
    // Mock: Update in array
    const index = mockArticles.findIndex((a) => a.id === id);
    if (index !== -1)
      mockArticles[index] = { ...mockArticles[index], ...updates };
    return NextResponse.json({ success: true });
  } else {
    // Real: Update in Supabase
    const { data, error } = await supabase
      .from("manuscripts")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json(data[0]);
  }
}
```

### 2. Add Mutation Hooks

#### Create: `/src/hooks/useMutations.ts`

```typescript
import { useState } from "react";

interface MutationState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useCreateArticle() {
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const createArticle = async (articleData: any) => {
    setState({ loading: true, error: null, success: false });

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) throw new Error("Failed to create article");

      setState({ loading: false, error: null, success: true });
      return await response.json();
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : "Error occurred",
        success: false,
      });
      throw error;
    }
  };

  const reset = () => setState({ loading: false, error: null, success: false });

  return { ...state, createArticle, reset };
}

export function useUpdateArticle() {
  // Similar pattern for updates
}

export function useDeleteArticle() {
  // Similar pattern for deletes
}
```

### 3. Update Database Policies

#### Current: Read-only policies

```sql
CREATE POLICY "Enable read access for all users" ON manuscripts FOR SELECT USING (true);
```

#### Add Write Policies:

```sql
-- Allow authenticated users to insert
CREATE POLICY "Enable insert for authenticated users" ON manuscripts
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own records
CREATE POLICY "Enable update for own records" ON manuscripts
FOR UPDATE USING (editor_id = auth.jwt() ->> 'sub');

-- Allow users to delete their own records
CREATE POLICY "Enable delete for own records" ON manuscripts
FOR DELETE USING (editor_id = auth.jwt() ->> 'sub');
```

### 4. Enhanced Frontend Components

#### Add Real Form Handling:

```tsx
// src/components/forms/ArticleForm.tsx
import { useCreateArticle, useUpdateArticle } from "@/hooks/useMutations";

export function ArticleForm({ article, onSuccess }: ArticleFormProps) {
  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();
  const [formData, setFormData] = useState(article || defaultForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (article?.id) {
        await updateMutation.updateArticle({ id: article.id, ...formData });
      } else {
        await createMutation.createArticle(formData);
      }
      onSuccess?.();
    } catch (error) {
      // Error handled by mutation hooks
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button
        type="submit"
        disabled={createMutation.loading || updateMutation.loading}
      >
        {createMutation.loading || updateMutation.loading
          ? "Saving..."
          : "Save"}
      </Button>
    </form>
  );
}
```

### 5. Cache Invalidation & Optimistic Updates

#### Enhanced useApi Hook:

```typescript
// Add refresh capability
export function useArticles(params: ArticleParams) {
  const [refreshKey, setRefreshKey] = useState(0);

  // ... existing code

  const invalidate = () => setRefreshKey((prev) => prev + 1);

  return { ...state, invalidate };
}

// Optimistic updates
export function useOptimisticArticles() {
  const apiHook = useArticles();
  const [optimisticData, setOptimisticData] = useState(null);

  const optimisticCreate = (newArticle: Article) => {
    // Immediately show in UI
    setOptimisticData((prev) => (prev ? [...prev, newArticle] : [newArticle]));

    // Then sync with server
    return createArticle(newArticle).finally(() => {
      setOptimisticData(null);
      apiHook.invalidate();
    });
  };

  return {
    data: optimisticData || apiHook.data,
    optimisticCreate,
    ...apiHook,
  };
}
```

## Migration Strategy

### Phase 1: Add Write API Routes (Low Risk)

- Extend existing API routes with POST/PUT/DELETE
- Keep USE_MOCK_DATA=true for testing
- Test all operations with mock data

### Phase 2: Add Frontend Mutations (Medium Risk)

- Create mutation hooks
- Add forms and action handlers
- Test complete create/update/delete flows

### Phase 3: Enable Supabase Writes (Low Risk)

- Update database policies for write access
- Set USE_MOCK_DATA=false
- Monitor and adjust

### Phase 4: Advanced Features (Optional)

- Real-time updates with Supabase subscriptions
- Optimistic UI updates
- Offline support with sync

## Testing Strategy

```bash
# 1. Test with mock data
USE_MOCK_DATA=true npm run dev

# 2. Test API endpoints
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Article","status":"draft"}'

# 3. Test with real database
USE_MOCK_DATA=false npm run dev

# 4. Test edge cases
# - Network failures
# - Validation errors
# - Concurrent updates
```

## Benefits of This Approach

✅ **Incremental**: Add writes gradually without breaking reads  
✅ **Reversible**: Can fall back to read-only mode anytime  
✅ **Type-Safe**: Same TypeScript interfaces for all operations  
✅ **Testable**: Mock mode allows safe testing  
✅ **Scalable**: Foundation for real-time, offline features

## Estimated Effort

- **API Extensions**: 1-2 days
- **Frontend Mutations**: 2-3 days
- **Database Policies**: 1 day
- **Testing & Polish**: 2-3 days

**Total: ~1 week** for full read/write capability
