# 🧪 Automated Testing Guide

Complete guide for running E2E tests on Curio AI Blog.

## 📋 Prerequisites

1. **Node.js 18+** installed
2. **Supabase project** set up with schema applied
3. **Environment variables** configured in `.env.local`
4. **Development server** can run (`npm run dev`)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Playwright Browsers
```bash
npx playwright install
```

### 3. Configure Test Environment

Create/update `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
TEST_ADMIN_EMAIL=admin@curioai.com
TEST_ADMIN_PASSWORD=your-admin-password
```

### 4. Run All Tests
```bash
npm run test:e2e
```

## 📝 Test Commands

### Run All Tests
```bash
npm run test:e2e
```

### Run Tests with UI (Interactive)
```bash
npm run test:e2e:ui
```

### Run Tests in Headed Mode (See Browser)
```bash
npm run test:e2e:headed
```

### Debug Tests
```bash
npm run test:e2e:debug
```

### Run Specific Test File
```bash
npx playwright test tests/e2e/auth.spec.ts
```

### Run Tests in Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 📊 Test Coverage

### ✅ Authentication Tests (`auth.spec.ts`)
- User signup (regular user)
- Author signup
- Login (user, author, admin)
- Form validation (password mismatch, short password)
- Invalid credentials handling
- Navigation between auth pages

### ✅ Dashboard Access Tests (`dashboard-access.spec.ts`)
- Admin dashboard access after login
- Author dashboard access after login
- Route protection (redirects to login)
- Protected routes testing

### ✅ User Flow Tests (`user-flows.spec.ts`)
- Complete signup → browse → comment flow
- Author signup → create post flow
- Admin login → manage posts flow
- Navigation flows
- Search functionality

### ✅ Public Pages Tests (`public-pages.spec.ts`)
- All public pages load correctly
- Navigation links work
- SEO meta tags present
- Responsive design
- 404 page handling

## 🔍 Test Results

After running tests, view results:

### HTML Report
```bash
npx playwright show-report
```

### Test Results Location
- **HTML Report**: `playwright-report/index.html`
- **JSON Results**: `test-results/results.json`
- **Screenshots**: `test-results/` (on failure)
- **Videos**: `test-results/` (on failure)

## 🐛 Troubleshooting

### Tests Fail to Start
**Issue**: Development server not running
**Solution**: Tests automatically start dev server, but ensure port 3000 is available

### Authentication Tests Fail
**Issue**: Supabase credentials not configured
**Solution**: Check `.env.local` has correct Supabase keys

### Browser Not Found
**Issue**: Playwright browsers not installed
**Solution**: Run `npx playwright install`

### Tests Timeout
**Issue**: Server taking too long to start
**Solution**: Increase timeout in `playwright.config.ts` or check server logs

## 📈 CI/CD Integration

Tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Install dependencies
  run: npm install
  
- name: Install Playwright browsers
  run: npx playwright install --with-deps
  
- name: Run tests
  run: npm run test:e2e
  env:
    NEXT_PUBLIC_SITE_URL: ${{ secrets.SITE_URL }}
    TEST_ADMIN_EMAIL: ${{ secrets.ADMIN_EMAIL }}
    TEST_ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
```

## 🎯 Test Scenarios Covered

### Signup Flow
1. ✅ Regular user signup
2. ✅ Author signup
3. ✅ Password validation
4. ✅ Form validation
5. ✅ Navigation to login

### Login Flow
1. ✅ User login → redirects to home
2. ✅ Author login → redirects to `/author`
3. ✅ Admin login → redirects to `/admin`
4. ✅ Invalid credentials handling
5. ✅ Navigation to signup

### Dashboard Access
1. ✅ Admin dashboard accessible after login
2. ✅ Author dashboard accessible after login
3. ✅ Protected routes redirect to login
4. ✅ Unauthenticated access blocked

### User Journeys
1. ✅ Signup → Browse → Comment
2. ✅ Author signup → Create post
3. ✅ Admin login → Manage posts
4. ✅ Navigation flows
5. ✅ Search functionality

### Public Pages
1. ✅ All pages load correctly
2. ✅ Navigation works
3. ✅ SEO tags present
4. ✅ Responsive design
5. ✅ 404 handling

## 📝 Writing New Tests

### Test Structure
```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('Test case description', async ({ page }) => {
    await page.goto('/route')
    // Test actions
    await expect(page.locator('selector')).toBeVisible()
  })
})
```

### Best Practices
1. Use descriptive test names
2. Group related tests in `test.describe`
3. Clean up test data after tests
4. Use `test.beforeEach` for setup
5. Use `test.afterEach` for cleanup

## 🔐 Test Accounts

Tests use dynamic test accounts with timestamps:
- User: `test-user-{timestamp}@example.com`
- Author: `test-author-{timestamp}@example.com`
- Admin: Uses `.env.local` credentials

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Test Reports](https://playwright.dev/docs/test-reporters)

---

**Happy Testing! 🎉**
