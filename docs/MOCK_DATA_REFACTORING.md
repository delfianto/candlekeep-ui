# Mock Data Refactoring Guide

## Overview

This guide outlines the completed and remaining work for refactoring mock data to properly separate list and detail response schemas according to the OpenAPI specification.

## Background

The OpenAPI spec defines two different response schemas:
- **ListResponse**: Lightweight schema for paginated lists (excludes heavy fields like `system_prompt` and `parameters`)
- **DetailResponse**: Complete schema for single resource fetching by ID (includes all fields)

This separation follows REST best practices and improves performance by avoiding overfetching in list endpoints.

## Completed Work ✅

### 1. Created `model-details.ts`
**Location**: `src/mocks/data/model-details.ts`

**Purpose**: Contains all models with full `ModelResponse` schema including `system_prompt` and `parameters` fields.

**Usage**: Used for `GET /api/models/:id` detail endpoint

**Schema Type**: `ModelResponse`

**Fields Included**:
- `id`
- `provider_id`
- `model_identifier`
- `openrouter_identifier`
- `use_openrouter`
- `name`
- `model_family_id`
- `system_prompt` ✨ (only in detail response)
- `parameters` ✨ (only in detail response)
- `enabled`
- `created_at`
- `updated_at`
- `can_use_openrouter`
- `active_identifier`
- `provider_enabled`

### 2. Created `model-family-details.ts`
**Location**: `src/mocks/data/model-family-details.ts`

**Purpose**: Contains all model families with full `ModelFamilyResponse` schema including `parameters` field.

**Usage**: Used for `GET /api/model-families/:id` detail endpoint

**Schema Type**: `ModelFamilyResponse`

**Fields Included**:
- `id`
- `name`
- `family_identifier`
- `description`
- `provider_types`
- `parameters` ✨ (only in detail response)
- `unsupported_parameters`
- `extra_metadata`
- `created_at`
- `updated_at`

## Remaining Work 🚧

### 3. Update `models.ts`

**Location**: `src/mocks/data/models.ts`

**Current SHA**: `cc0a88eb0254d41bab799b7291e635a284288578`

**Changes Required**:

1. **Update Type Definition**
   ```typescript
   // Change from:
   type ModelPage = components["schemas"]["PaginatedResponse_ModelResponse_"];
   
   // To:
   type ModelPage = components["schemas"]["PaginatedResponse_ModelListResponse_"];
   ```

2. **Remove Fields from All List Items**
   - Remove `system_prompt` field
   - Remove `parameters` field
   - Keep all other fields unchanged

3. **Add Comment**
   ```typescript
   // Model list data - uses ModelListResponse schema (no system_prompt or parameters)
   // For full model details including system_prompt and parameters, see model-details.ts
   ```

**Example Before**:
```typescript
{
  provider_id: "openai",
  model_identifier: "gpt-4o",
  name: "GPT-4o",
  system_prompt: null,        // ❌ REMOVE THIS
  parameters: {               // ❌ REMOVE THIS
    max_completion_tokens: 4096,
    temperature: 0.85,
  },
  enabled: true,
  id: "gpt-4o",
  // ... other fields
}
```

**Example After**:
```typescript
{
  provider_id: "openai",
  model_identifier: "gpt-4o",
  name: "GPT-4o",
  enabled: true,
  id: "gpt-4o",
  // ... other fields (no system_prompt, no parameters)
}
```

### 4. Update `model-families.ts`

**Location**: `src/mocks/data/model-families.ts`

**Current SHA**: `94c17d0a1215f6b759843c67014f2fc570dd7964`

**Changes Required**:

1. **Update Type Definition**
   ```typescript
   // Change from:
   type ModelFamilyPage = components["schemas"]["PaginatedResponse_ModelFamilyResponse_"];
   
   // To:
   type ModelFamilyPage = components["schemas"]["PaginatedResponse_ModelFamilyListResponse_"];
   ```

2. **Remove Field from All List Items**
   - Remove `parameters` field
   - Keep all other fields including:
     - `id`
     - `name`
     - `family_identifier`
     - `description`
     - `provider_types`
     - `unsupported_parameters`
     - `extra_metadata`
     - `created_at`
     - `updated_at`

3. **Add Comment**
   ```typescript
   // Model family list data - uses ModelFamilyListResponse schema (no parameters)
   // For full model family details including parameters, see model-family-details.ts
   ```

**Example Before**:
```typescript
{
  name: "OpenAI GPT-4.1 / 4o Chat",
  family_identifier: "openai/gpt-4",
  description: "OpenAI GPT-4.1 / GPT-4o chat models...",
  provider_types: ["openai", "openrouter"],
  parameters: {                              // ❌ REMOVE THIS ENTIRE OBJECT
    max_completion_tokens: { type: "int", default: 2048, ... },
    temperature: { type: "float", default: 1.0, ... },
    // ... more parameters
  },
  unsupported_parameters: ["max_tokens", "reasoning_effort"],
  extra_metadata: { context_window: 128000, ... },
  id: "openai-gpt-4",
  created_at: NOW,
  updated_at: NOW,
}
```

**Example After**:
```typescript
{
  name: "OpenAI GPT-4.1 / 4o Chat",
  family_identifier: "openai/gpt-4",
  description: "OpenAI GPT-4.1 / GPT-4o chat models...",
  provider_types: ["openai", "openrouter"],
  unsupported_parameters: ["max_tokens", "reasoning_effort"],
  extra_metadata: { context_window: 128000, ... },
  id: "openai-gpt-4",
  created_at: NOW,
  updated_at: NOW,
}
```

### 5. Update `handlers.ts`

**Location**: `src/mocks/handlers.ts` or `src/mocks/data/handlers.ts`

**Changes Required**:

1. **Add Imports at Top of File**
   ```typescript
   import { modelDetails } from "@/mocks/data/model-details";
   import { modelFamilyDetails } from "@/mocks/data/model-family-details";
   ```

2. **Update Model Detail Handler**
   
   **Find this section**:
   ```typescript
   http.get("/api/models/:modelId", async ({ params }) => {
     const modelId = params.modelId as string;
     let foundModel = null;
     for (const page of db.modelsPages) {
       foundModel = page.items.find((m: components["schemas"]["ModelResponse"]) => m.id === modelId);
       if (foundModel) break;
     }
     if (!foundModel) return new HttpResponse(null, { status: 404 });
     await delay(100);
     return HttpResponse.json(foundModel);
   }),
   ```
   
   **Replace with**:
   ```typescript
   http.get("/api/models/:modelId", async ({ params }) => {
     const modelId = params.modelId as string;
     const foundModel = modelDetails.find((m) => m.id === modelId);
     if (!foundModel) return new HttpResponse(null, { status: 404 });
     await delay(100);
     return HttpResponse.json(foundModel);
   }),
   ```

3. **Update Model Family Detail Handler**
   
   **Find the model-families/:familyId handler** (it might not exist yet, check the file)
   
   **If it doesn't exist, add after the model-families list handler**:
   ```typescript
   http.get("/api/model-families/:familyId", async ({ params }) => {
     const familyId = params.familyId as string;
     const foundFamily = modelFamilyDetails.find((f) => f.id === familyId);
     if (!foundFamily) return new HttpResponse(null, { status: 404 });
     await delay(100);
     return HttpResponse.json(foundFamily);
   }),
   ```
   
   **If it exists but searches through pages, replace with**:
   ```typescript
   http.get("/api/model-families/:familyId", async ({ params }) => {
     const familyId = params.familyId as string;
     const foundFamily = modelFamilyDetails.find((f) => f.id === familyId);
     if (!foundFamily) return new HttpResponse(null, { status: 404 });
     await delay(100);
     return HttpResponse.json(foundFamily);
   }),
   ```

## Implementation Checklist

- [x] Create `model-details.ts` with full ModelResponse data
- [x] Create `model-family-details.ts` with full ModelFamilyResponse data
- [ ] Update `models.ts` to use ModelListResponse schema (remove system_prompt & parameters)
- [ ] Update `model-families.ts` to use ModelFamilyListResponse schema (remove parameters)
- [ ] Update `handlers.ts` to import and use detail mocks for /:id endpoints

## Testing After Implementation

1. **List Endpoints** (should not have heavy fields)
   - `GET /api/models?page=1` → should return items WITHOUT `system_prompt` and `parameters`
   - `GET /api/model-families?page=1` → should return items WITHOUT `parameters`

2. **Detail Endpoints** (should have all fields)
   - `GET /api/models/gpt-4o` → should return WITH `system_prompt` and `parameters`
   - `GET /api/model-families/openai-gpt-4` → should return WITH `parameters`

3. **Filtered List Endpoints** (should not have heavy fields)
   - `GET /api/models?name=claude` → should return items WITHOUT `system_prompt` and `parameters`
   - `GET /api/model-families?name=claude` → should return items WITHOUT `parameters`

## Benefits

1. **Performance**: Reduced payload size for list endpoints (no heavy parameter schemas)
2. **Correctness**: Matches OpenAPI spec exactly
3. **Maintainability**: Clear separation between list and detail data
4. **Scalability**: As parameter schemas grow, list endpoints won't be affected

## Schema Comparison

### ModelListResponse (for lists)
```typescript
{
  id: string;
  provider_id: string;
  model_identifier: string;
  openrouter_identifier: string | null;
  use_openrouter: boolean;
  name: string;
  model_family_id: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  can_use_openrouter: boolean;
  active_identifier: string;
  provider_enabled: boolean;
}
```

### ModelResponse (for details)
```typescript
{
  // ... all ModelListResponse fields, plus:
  system_prompt: string | null;
  parameters: object;
}
```

### ModelFamilyListResponse (for lists)
```typescript
{
  id: string;
  name: string;
  family_identifier: string;
  description: string | null;
  provider_types: string[];
  unsupported_parameters: string[];
  extra_metadata: object | null;
  created_at: string;
  updated_at: string;
}
```

### ModelFamilyResponse (for details)
```typescript
{
  // ... all ModelFamilyListResponse fields, plus:
  parameters: object; // The heavy parameter schema definitions
}
```

## Notes

- All 18 models are included in `model-details.ts`
- All 22 model families are included in `model-family-details.ts` (across 3 pages in original)
- The `modelsFilteredByName` and `modelFamiliesFilteredByName` exports should also be updated to use List schemas
- Total items count may need adjustment (currently shows 23 models but we have 18, and 22 families)

## Questions?

If you encounter issues during implementation, check:
1. Import paths are correct
2. Type definitions match the OpenAPI schema
3. All occurrences of the fields are removed (use find-all in editor)
4. Handler functions properly use the new detail arrays
