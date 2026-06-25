import { test, expect } from '@playwright/test'

const adminUser = {
  email: process.env.TEST_ADMIN_EMAIL || 'admin@curioai.com',
  password: process.env.TEST_ADMIN_PASSWORD || 'password'
}

const testAuthor = {
  email: `test-author-${Date.now()}@example.com`,
  password: 'TestPassword123!',
  fullName: 'Test Author'
}

test.describe('Dashboard Access Control', () => {
  
  test('Admin Dashboard - Accessible After Login', async ({ page }) => {
    // Login as admin
    await page.goto('/login')
    await page.fill('input[id="email"]', adminUser.email)
    await page.fill('input[id="password"]', adminUser.password)
    await page.click('button[type="submit"]')
    await page.waitForTimeout(3000)
    
    // Navigate to admin dashboard
    await page.goto('/admin')
    
    // Should see admin dashboard
    await expect(page.locator('h1')).toContainText('Admin Dashboard')
    
    // Check for admin-specific elements
    await expect(page.locator('text=Posts')).toBeVisible()
    await expect(page.locator('text=Users')).toBeVisible()
    await expect(page.locator('text=Comments')).toBeVisible()
    
    console.log('✅ Admin dashboard accessible')
  })

  test('Admin Dashboard - Redirects to Login When Not Authenticated', async ({ page }) => {
    // Clear cookies
    await page.context().clearCookies()
    
    // Try to access admin dashboard
    await page.goto('/admin')
    
    // Should redirect to login
    await page.waitForTimeout(2000)
    await expect(page).toHaveURL(/\/login/)
    
    console.log('✅ Admin dashboard protected - redirects to login')
  })

  test('Author Dashboard - Accessible After Login', async ({ page }) => {
    // First signup as author
    await page.goto('/signup')
    await page.fill('input[id="fullName"]', testAuthor.fullName)
    await page.fill('input[id="email"]', testAuthor.email)
    await page.fill('input[id="password"]', testAuthor.password)
    await page.fill('input[id="confirmPassword"]', testAuthor.password)
    await page.click('button:has-text("Write Posts")')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(3000)
    
    // Navigate to author dashboard
    await page.goto('/author')
    
    // Should see author dashboard
    await expect(page.locator('h1, h2')).toContainText(/Author|Dashboard|Posts/i)
    
    console.log('✅ Author dashboard accessible')
  })

  test('Author Dashboard - Redirects to Login When Not Authenticated', async ({ page }) => {
    // Clear cookies
    await page.context().clearCookies()
    
    // Try to access author dashboard
    await page.goto('/author')
    
    // Should redirect to login
    await page.waitForTimeout(2000)
    await expect(page).toHaveURL(/\/login/)
    
    console.log('✅ Author dashboard protected - redirects to login')
  })

  test('Admin Routes - Protected', async ({ page }) => {
    await page.context().clearCookies()
    
    const protectedRoutes = [
      '/admin/posts',
      '/admin/comments',
      '/admin/users',
      '/admin/ads',
      '/admin/analytics'
    ]
    
    for (const route of protectedRoutes) {
      await page.goto(route)
      await page.waitForTimeout(1000)
      await expect(page).toHaveURL(/\/login/)
      console.log(`✅ ${route} is protected`)
    }
  })

  test('Author Routes - Protected', async ({ page }) => {
    await page.context().clearCookies()
    
    const protectedRoutes = [
      '/author/posts',
      '/author/posts/new',
      '/author/analytics'
    ]
    
    for (const route of protectedRoutes) {
      await page.goto(route)
      await page.waitForTimeout(1000)
      await expect(page).toHaveURL(/\/login/)
      console.log(`✅ ${route} is protected`)
    }
  })
})
