# E2E Test Suite

This directory contains end-to-end tests for the Curio AI Blog platform using Playwright.

## Test Files

- **auth.spec.ts** - Authentication flows (signup, login, validation)
- **dashboard-access.spec.ts** - Dashboard access control and protection
- **user-flows.spec.ts** - Complete user journeys
- **public-pages.spec.ts** - Public page accessibility and SEO

## Running Tests

### Install Dependencies
```bash
npm install
```

### Install Playwright Browsers
```bash
npx playwright install
```

### Run All Tests
```bash
npm run test:e2e
```

### Run Tests with UI
```bash
npm run test:e2e:ui
```

### Run Tests in Headed Mode
```bash
npm run test:e2e:headed
```

### Debug Tests
```bash
npm run test:e2e:debug
```

## Environment Variables

Create a `.env.local` file with:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
TEST_ADMIN_EMAIL=admin@curioai.com
TEST_ADMIN_PASSWORD=your-admin-password
```

## Test Coverage

### ✅ Authentication
- User signup (regular user)
- Author signup
- Login (user, author, admin)
- Form validation
- Navigation between auth pages

### ✅ Dashboard Access
- Admin dashboard access
- Author dashboard access
- Route protection
- Redirects for unauthenticated users

### ✅ User Flows
- Complete signup → browse → comment flow
- Author signup → create post flow
- Admin login → manage posts flow
- Navigation flows
- Search functionality

### ✅ Public Pages
- All public pages load correctly
- Navigation links work
- SEO meta tags present
- Responsive design
- 404 page handling

## Test Results

Test results are saved in:
- HTML Report: `playwright-report/index.html`
- JSON Results: `test-results/results.json`
- Screenshots: On failure (in `test-results/`)
- Videos: On failure (in `test-results/`)

## Continuous Integration

Tests can be run in CI/CD pipelines. The config automatically:
- Uses retries on CI
- Runs in headless mode
- Generates reports
- Captures screenshots/videos on failure
