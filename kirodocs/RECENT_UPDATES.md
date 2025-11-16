# Recent Updates

> **Last Updated**: November 16, 2025

## November 16, 2025 - Documentation Reorganization

### 📚 Documentation Restructure
**Status**: ✅ Complete

Reorganized all project documentation for better maintainability:
- **Moved to kirodocs**: All scattered markdown files consolidated
- **Created archive**: Outdated docs moved to `kirodocs/archive/`
- **Updated READMEs**: Backend and frontend READMEs now reference kirodocs
- **Steering docs**: Updated to reflect current codebase

**Files Moved**:
- `EXPANSION_SUGGESTION_VARIETY.md` → `kirodocs/features/`
- `FEATURE_COMPLETE_FORM_VALIDATION.md` → `kirodocs/features/`
- `IMPROVEMENT_SUGGESTION_LIMIT.md` → `kirodocs/features/`
- `backend/VOICE_CONFIG_VERIFICATION.md` → `kirodocs/testing/`
- `frontend/src/api/__tests__/*.md` → `kirodocs/testing/`

**Files Archived**:
- `DOCUMENTATION_UPDATE_NOVEMBER_2025.md` → `archive/`
- `DOCUMENTATION_UPDATE_SUMMARY.md` → `archive/`

**Documentation**: This file

---

## November 16, 2025 - Feature Updates

### 🎓 Moral Themes Feature
**Status**: ✅ Complete

Transformed story theme system from visual styles to educational moral lessons:
- Added 15 moral theme options (honesty, friendship, courage, etc.)
- Updated AI prompts to weave themes naturally into stories
- Changed theme field from selector to text with suggestions
- Enhanced story generation to emphasize life lessons

**Files Changed**:
- `frontend/src/types/index.ts`
- `frontend/src/pages/InputPage.constants.ts`
- `frontend/src/utils/suggestions.ts`
- `backend/src/main/java/com/frankenstein/story/service/StoryGenerationService.java`

**Documentation**: [Moral Themes](features/MORAL_THEMES.md)

---

### 📝 Form Input Improvements
**Status**: ✅ Complete

Enhanced story input form with better UX:
- **Non-Linear Navigation**: Jump to any field at any time
- **Smart Randomize**: Only fills empty fields, preserves user choices
- **Clear All Button**: Quick reset of entire form
- **Improved Checkmarks**: Only show on fields with actual values
- **Better Progress**: Percentage based on completed fields

**Files Changed**:
- `frontend/src/components/shared/indicators/StepIndicator.tsx`
- `frontend/src/hooks/forms/useStoryFormState.ts`
- `frontend/src/components/forms/FormNavigation.tsx`
- `frontend/src/pages/InputPage.tsx`

**Documentation**: [Form Improvements](features/FORM_IMPROVEMENTS.md)

---

### ⚡ GPU Performance Optimizations
**Status**: ✅ Complete

Drastically reduced GPU-intensive effects to prevent Chrome crashes:
- **InputPage**: Removed ParticleBackground, reduced bats to 2
- **LoadingPage**: Removed multiple heavy effects
- **ReadingPage**: Disabled SubtleParticleBackground
- **CompletionPage**: Removed fireworks and confetti

**Impact**:
- GPU usage reduced from 80-100% to 20-40%
- Stable performance on all hardware
- Smooth 60fps animations
- No more Chrome crashes

**Files Changed**:
- `frontend/src/components/forms/FormBackground.tsx`
- `frontend/src/pages/LoadingPage.tsx`
- `frontend/src/pages/ReadingPage.tsx`
- `frontend/src/pages/CompletionPage.tsx`

**Documentation**: [GPU Optimization](performance/GPU_OPTIMIZATION.md)

---

### 🐛 Voice Selector Validation Fix
**Status**: ✅ Complete

Fixed "Please fill in this field" popup when selecting narrator voice:
- Added `type="button"` to VoiceSelector buttons
- Added `type="button"` to ThemeSelector buttons
- Added hidden input fields for proper form registration
- Prevents premature form submission

**Files Changed**:
- `frontend/src/components/VoiceSelector.tsx`
- `frontend/src/components/ThemeSelector.tsx`
- `frontend/src/components/forms/StoryFormField.tsx`

**Documentation**: [Voice Selector Validation](bugfixes/VOICE_SELECTOR_VALIDATION.md)

---

### 🔧 Admin Page Configuration Fix
**Status**: ✅ Complete

Fixed configuration editor not displaying on admin page:
- Added `useEffect` to sync configuration state
- Added null checks for conditional rendering
- Improved error handling for failed loads

**Files Changed**:
- `frontend/src/pages/AdminPage.tsx`

---

### 📖 3D Book Image Alignment
**Status**: ✅ Complete

Fixed image alignment in 3D book display:
- Standardized image sizing across left and right pages
- Changed to `objectFit: 'cover'` with proper positioning
- Images now split perfectly down the middle

**Files Changed**:
- `frontend/src/components/reading/Book3DDisplay.tsx`

---

### 📊 Progress Bar Enhancement
**Status**: ✅ Complete

Improved audio progress bar display:
- Status (Playing/Paused) on left
- Percentage on right
- Added horizontal padding
- Better visual separation

**Files Changed**:
- `frontend/src/components/shared/indicators/StatusIndicator.tsx`

---

### 🎨 Completion Page Optimization
**Status**: ✅ Complete

Simplified completion page for better performance:
- Removed heavy particle effects
- Reduced infinite animations
- Kept essential celebration elements
- Improved load time

**Files Changed**:
- `frontend/src/pages/CompletionPage.tsx`
- `frontend/src/components/completion/CelebrationEffects.tsx`

---

### 🚨 Unsafe API Removal
**Status**: ✅ Complete

Removed Advice Slip API due to content safety concerns:
- Replaced with ZenQuotes API (already integrated)
- Ensures age-appropriate content for children
- Curated quotes from famous authors
- Better user experience with author attribution

**Files Changed**:
- `frontend/src/pages/CompletionPage.tsx`
- `frontend/src/api/adviceSlip.ts` (deleted)

**Documentation**: [Unsafe API Removal](bugfixes/UNSAFE_API_REMOVAL.md)

---

### 📚 API Migration: ZenQuotes
**Status**: ✅ Complete

Migrated from Quotable API to ZenQuotes due to SSL issues:
- Updated API endpoint
- Modified response parsing
- Updated all documentation references
- Maintained same interface

**Files Changed**:
- `frontend/src/api/quotable.ts`
- Multiple documentation files

**Documentation**: [API Migration](bugfixes/API_MIGRATION_ZENQUOTES.md)

---

## Previous Updates

### Earlier November 2025
- Story customization features (voice selection, themes)
- Admin dashboard for API tracking
- Voice configuration via UI
- Integration testing framework
- Responsive sizing improvements
- Component refactoring
- Free API integrations (quotes, jokes, time of day)

See individual documentation files for detailed information on earlier updates.

---

### 📝 Suggestion Expansion
**Status**: ✅ Complete

Expanded suggestion lists from 6 to 20 options per field:
- Character names, settings, villains, items, traits, goals, time periods, moods
- 159 total unique suggestions across all fields
- Random 6 displayed per page load for variety
- Fisher-Yates shuffle algorithm for fair randomization

**Files Changed**:
- `frontend/src/utils/suggestions.ts`
- `frontend/src/components/forms/SuggestionChips.tsx`

**Documentation**: [Expansion: Suggestion Variety](features/EXPANSION_SUGGESTION_VARIETY.md)

---

### ✅ Complete Form Validation
**Status**: ✅ Complete

Added validation to ensure all fields filled before story creation:
- "Create Story" button disabled until all fields complete
- Helper text shows "Fill all fields to create story"
- Double validation (UI + submission handler)
- Toast notification for validation failures

**Files Changed**:
- `frontend/src/pages/InputPage.tsx`
- `frontend/src/components/forms/FormNavigation.tsx`
- `frontend/src/hooks/forms/useStoryFormState.ts`

**Documentation**: [Complete Form Validation](features/FEATURE_COMPLETE_FORM_VALIDATION.md)

---

### 🎲 Limited Random Suggestions
**Status**: ✅ Complete

Modified suggestion display to show maximum 6 random options:
- Reduces visual clutter (theme field reduced from 15 to 6)
- Fisher-Yates shuffle for unbiased randomization
- Memoized to prevent re-shuffling on renders
- Different suggestions on each page load

**Files Changed**:
- `frontend/src/components/forms/SuggestionChips.tsx`

**Documentation**: [Suggestion Limit](features/IMPROVEMENT_SUGGESTION_LIMIT.md)

---

## Previous Updates

### Earlier November 2025
- Story customization features (voice selection, themes)
- Admin dashboard for API tracking
- Voice configuration via UI
- Integration testing framework
- Responsive sizing improvements
- Component refactoring
- Free API integrations (quotes, jokes, time of day)

See individual documentation files for detailed information on earlier updates.

---

**Last Updated**: November 16, 2025
