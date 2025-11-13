# Refactoring Infrastructure Setup

This document describes the directory structure and barrel exports created for the code refactoring project.

## Frontend Structure

### Component Directories

```
frontend/src/components/
├── forms/              # Form-related components (InputPage)
│   └── index.ts        # Barrel export
├── reading/            # Reading experience components (ReadingPage)
│   └── index.ts        # Barrel export
├── admin/              # Admin dashboard components (AdminPage)
│   └── index.ts        # Barrel export
├── completion/         # Completion screen components (CompletionPage)
│   └── index.ts        # Barrel export
└── shared/             # Reusable UI components
    ├── buttons/        # Shared button components
    │   └── index.ts    # Barrel export
    ├── cards/          # Shared card components
    │   └── index.ts    # Barrel export
    ├── overlays/       # Shared overlay components
    │   └── index.ts    # Barrel export
    └── indicators/     # Shared indicator components
        └── index.ts    # Barrel export
```

### Hook Directories

```
frontend/src/hooks/
├── forms/              # Form-related hooks
│   └── index.ts        # Barrel export
├── reading/            # Reading experience hooks
│   └── index.ts        # Barrel export
├── admin/              # Admin dashboard hooks
│   └── index.ts        # Barrel export
└── shared/             # Shared utility hooks
    └── index.ts        # Barrel export
```

### Type Directories

```
frontend/src/types/
├── forms.ts            # Form component types
├── reading.ts          # Reading component types
└── admin.ts            # Admin component types
```

## Backend Structure

### Service Directories

```
backend/src/main/java/com/frankenstein/story/service/
├── orchestration/      # Orchestration services (workflow coordination)
└── tracking/           # API tracking services (configuration, logs, statistics)
```

### Model Directories

```
backend/src/main/java/com/frankenstein/story/model/
└── orchestration/      # Orchestration-specific models
```

## Barrel Export Pattern

All component and hook directories include `index.ts` files that will serve as barrel exports. This pattern provides:

1. **Clean Imports**: Import multiple items from a single path
   ```typescript
   // Instead of:
   import { StoryFormField } from '@/components/forms/StoryFormField';
   import { FormProgressIndicator } from '@/components/forms/FormProgressIndicator';
   
   // Use:
   import { StoryFormField, FormProgressIndicator } from '@/components/forms';
   ```

2. **Encapsulation**: Hide internal file structure
3. **Refactoring Safety**: Change internal structure without breaking imports
4. **Clear Public API**: Explicitly define what's exported

## Progress Tracking

### Infrastructure Setup (Task 1) - ✅ COMPLETE
- ✅ All component directories created
- ✅ All barrel export files (`index.ts`) created
- ✅ Backend service directories created
- ✅ Build verification passed

### Form Components Discovery
During infrastructure setup, discovered that some form components already exist:
- `AccessibleFormWrapper.tsx` - Needs to be evaluated against requirements
- `FormProgressBar.tsx` - May map to FormProgressIndicator requirement
- `StoryFormField.tsx` - Matches Task 2.1 requirement
- `SuggestionButtons.tsx` - May map to SuggestionChips requirement

**Action Required**: Review existing components and update barrel exports accordingly.

## Usage Guidelines

### Adding New Components

When creating new components during refactoring:

1. Create the component file in the appropriate directory
2. Add the export to the corresponding `index.ts` file:
   ```typescript
   export { StoryFormField } from './StoryFormField';
   export type { StoryFormFieldProps } from './StoryFormField';
   ```

### Adding New Hooks

When creating new hooks during refactoring:

1. Create the hook file in the appropriate directory
2. Add the export to the corresponding `index.ts` file:
   ```typescript
   export { useStoryFormState } from './useStoryFormState';
   export type { UseStoryFormStateReturn } from './useStoryFormState';
   ```

### Adding New Types

When creating new type definitions:

1. Add types to the appropriate type file (`forms.ts`, `reading.ts`, `admin.ts`)
2. Export from the main `types/index.ts` if needed for cross-feature usage

## Build Verification

- ✅ Backend compiles successfully with new directory structure
- ⚠️ Frontend has pre-existing TypeScript errors (unrelated to infrastructure)

## Current Progress

### Completed Infrastructure
- ✅ Component directories created (`forms/`, `reading/`, `admin/`, `completion/`, `shared/`)
- ✅ Barrel export files created for main component directories
- ✅ Shared component subdirectories created (`buttons/`, `cards/`, `overlays/`, `indicators/`)

### Existing Form Components
The following form components have been created/refactored:
- ✅ `StoryFormField.tsx` - Individual form field component (refactored to use SuggestionChips)
- ✅ `SuggestionChips.tsx` - Suggestion chip component (extracted from StoryFormField)
- ✅ `FormProgressBar.tsx` - Progress indicator component (existing)
- ⏳ `AccessibleFormWrapper.tsx` - Form accessibility wrapper (needs review)
- ⏳ `FormNavigation.tsx` - Navigation buttons (needs extraction)

### Recent Progress

**Task 2.3 Completed**: 
- Extracted `SuggestionChips` component from `StoryFormField`
- Refactored `StoryFormField` to use the new component
- Added `Suggestion` type to `types/index.ts`
- Improved component documentation

**Key Changes**:
- `StoryFormField.tsx`: Now uses `SuggestionChips` component, simplified prop interface (`onEnterPress` → `onNext`)
- `SuggestionChips.tsx`: Handles suggestion rendering with animations
- `types/index.ts`: Added `Suggestion` interface for type safety

### Next Steps

1. **Task 2.4**: Extract FormNavigation component (Back, Next, Randomize buttons)
2. **Task 2.5**: Review and refine useStoryFormState hook
3. **Task 2.6**: Refactor InputPage to use all extracted components
4. **Update barrel exports**: Add all form components to `forms/index.ts`
5. **Task 3**: Refactor ReadingPage components
6. **Task 4**: Refactor AdminPage components
7. **Task 5**: Refactor CompletionPage components
8. **Task 6**: Refactor backend orchestration services
9. **Task 7**: Refactor backend tracking services

Each task will populate the appropriate directories with extracted components, hooks, and services.
