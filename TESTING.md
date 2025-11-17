# Testing Guide for Story Library Management

This document provides instructions for running the comprehensive test suite for the Story Library Management feature.

## Overview

The test suite includes:
- **Backend Unit Tests**: Tests for `StoryIndexService` and `StoryController`
- **Frontend Component Tests**: Tests for `LibraryModal` component
- **E2E Tests**: End-to-end tests with Playwright

## Backend Tests

### Prerequisites
- Java 21
- Maven 3.8+

### Running Backend Tests

```bash
# Run all tests
cd backend
mvnw test

# Run specific test class
mvnw test -Dtest=StoryIndexServiceTest
mvnw test -Dtest=StoryControllerTest

# Run tests with coverage
mvnw test jacoco:report
```

### Backend Test Coverage

**StoryIndexServiceTest** covers:
- Creating new index when file doesn't exist
- Appending to existing index
- Skipping duplicate entries
- Removing stories from index
- Handling non-existent stories
- Sorting stories by date (descending)
- Returning empty list when no index exists
- Checking story existence
- Concurrent additions (thread safety)
- Index persistence across service instances
- Index file location verification

**StoryControllerTest** covers:
- Listing all stories from index
- Returning empty list when no stories exist
- Handling errors during story list retrieval
- Deleting stories and their assets
- Returning 404 when story not found
- Handling errors during deletion

## Frontend Tests

### Prerequisites
- Node.js 18+
- npm or yarn

### Installing Test Dependencies

The frontend tests require additional dependencies that are not currently installed:

```bash
cd frontend

# Install testing libraries
npm install -D vitest @vitest/ui
npm install -D @testing-library/react @testing-library/user-event @testing-library/jest-dom
npm install -D jsdom
```

### Configuring Vitest

Create `frontend/vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

Create `frontend/src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom';
```

### Running Frontend Tests

```bash
cd frontend

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

Add these scripts to `frontend/package.json`:

```json
{
  "scripts": {
    "test": "vitest --run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### Frontend Test Coverage

**LibraryModal.test.tsx** covers:
- Rendering modal when open/closed
- Displaying loading state while fetching
- Fetching stories when modal opens
- Displaying error state on fetch failure
- Retry functionality on error
- Displaying empty state when no stories
- Displaying list of stories with dates
- Play button navigation to reading page
- Delete button showing confirmation dialog
- Canceling deletion
- Confirming deletion and removing from list
- Success/error toasts for deletion
- Closing modal via close button, backdrop, and Escape key
- Admin link navigation

## E2E Tests with Playwright

### Prerequisites
- Backend server running on `http://localhost:8083`
- Frontend server running on `http://localhost:3000`

### Installing Playwright

```bash
cd frontend

# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install
```

### Running E2E Tests

```bash
cd frontend

# Run all E2E tests
npx playwright test

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Run specific test file
npx playwright test e2e/story-library.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# View test report
npx playwright show-report
```

### E2E Test Coverage

**story-library.spec.ts** covers:
- Full story creation and library appearance flow
- Opening and closing library modal
- Displaying empty state
- Navigating to reading page via play button
- Showing delete confirmation dialog
- Canceling deletion
- Confirming deletion and removing story
- Navigating to admin page
- Loading states
- Error handling (requires API mocking)

### Important Notes for E2E Tests

1. **Story Generation Time**: The full flow test includes story generation, which can take 3-5 minutes due to AI processing. The test has a 5-minute timeout.

2. **Clean Storage**: For consistent test results, consider cleaning the storage directory before running tests:
   ```bash
   # Backup existing stories if needed
   rm -rf storage/*/
   rm storage/story-index.json
   ```

3. **Test Data**: Some tests check for existing stories. If no stories exist, those tests will be skipped.

4. **Parallel Execution**: E2E tests can be run in parallel, but be aware of potential race conditions with shared storage.

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '21'
      - name: Run backend tests
        run: |
          cd backend
          ./mvnw test

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      - name: Run frontend tests
        run: |
          cd frontend
          npm run test

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: actions/setup-java@v3
        with:
          java-version: '21'
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
          npx playwright install --with-deps
      - name: Start backend
        run: |
          cd backend
          ./mvnw spring-boot:run &
          sleep 30
      - name: Start frontend
        run: |
          cd frontend
          npm run dev &
          sleep 10
      - name: Run E2E tests
        run: |
          cd frontend
          npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: frontend/playwright-report/
```

## Test Maintenance

### Adding New Tests

1. **Backend**: Add tests to existing test classes or create new ones following the pattern in `StoryIndexServiceTest.java`
2. **Frontend**: Add tests to `LibraryModal.test.tsx` or create new test files in `__tests__` directories
3. **E2E**: Add tests to `story-library.spec.ts` or create new spec files in the `e2e` directory

### Mocking Guidelines

- **Backend**: Use Mockito for mocking dependencies
- **Frontend**: Use Vitest's `vi.mock()` for mocking modules
- **E2E**: Use Playwright's request interception for API mocking

### Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Cleanup**: Clean up test data after each test
3. **Assertions**: Use descriptive assertion messages
4. **Naming**: Use clear, descriptive test names that explain what is being tested
5. **Coverage**: Aim for 80%+ code coverage on critical paths
6. **Performance**: Keep unit tests fast (< 1 second each)
7. **Flakiness**: Avoid flaky tests by using proper waits and avoiding hardcoded timeouts

## Troubleshooting

### Backend Tests Failing

- Ensure Java 21 is installed: `java -version`
- Clean and rebuild: `mvnw clean install`
- Check for port conflicts if integration tests fail

### Frontend Tests Failing

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for missing dependencies
- Verify test setup file is configured correctly

### E2E Tests Failing

- Ensure both servers are running
- Check browser installation: `npx playwright install`
- Verify ports 3000 and 8083 are available
- Check storage directory permissions
- Review test screenshots and videos in `playwright-report/`

## Additional Resources

- [JUnit 5 Documentation](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
