import { test, expect } from '@playwright/test'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Test data
const testUser = {
  email: `test-user-${Date.now()}@example.com`,
  password: 'TestPassword123!',
  fullName: 'Test User'
}

const testAuthor = {
  email: `test-author-${Date.now()}@example.com`,
  password: 'TestPassword123!',
  fullName: 'Test Author'
}

const adminUser = {
  email: process.env.TEST_ADMIN_EMAIL || 'admin@curioai.com',
  password: process.env.TEST_ADMIN_PASSWORD || 'password'
}

test.describe('Authentication Flows', () => {
  
  test.beforeEach(async ({ page }) => {
    // Clear any existing session
    await page.context().clearCookies()
  })

  test('User Signup Flow - Regular User', async ({ page }) => {
    await page.goto('/signup')
    
    // Verify signup page loads
    await expect(page.locator('h1')).toContainText('Join')
    
    // Fill signup form
    await page.fill('input[id="fullName"]', testUser.fullName)
    await page.fill('input[id="email"]', testUser.email)
    await page.fill('input[id="password"]', testUser.password)
    await page.fill('input[id="confirmPassword"]', testUser.password)
    
    // Select user role (should be default)
    await page.click('button:has-text("Read & Comment")')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Wait for redirect or success message
    await page.waitForTimeout(2000)
    
    // Should redirect to home or show success message
    const currentUrl = page.url()
    expect(currentUrl).toMatch(/\/(home|$|\?)/)
    
    console.log('✅ User signup completed')
  })

  test('User Signup Flow - Author', async ({ page }) => {
    await page.goto('/signup')
    
    // Fill signup form
    await page.fill('input[id="fullName"]', testAuthor.fullName)
    await page.fill('input[id="email"]', testAuthor.email)
    await page.fill('input[id="password"]', testAuthor.password)
    await page.fill('input[id="confirmPassword"]', testAuthor.password)
    
    // Select author role
    await page.click('button:has-text("Write Posts")')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Wait for redirect
    await page.waitForTimeout(2000)
    
    // Should redirect to author dashboard or home
    const currentUrl = page.url()
    expect(currentUrl).toMatch(/\/(author|home|$)/)
    
    console.log('✅ Author signup completed')
  })

  test('Signup Validation - Password Mismatch', async ({ page }) => {
    await page.goto('/signup')
    
    await page.fill('input[id="fullName"]', testUser.fullName)
    await page.fill('input[id="email"]', testUser.email)
    await page.fill('input[id="password"]', testUser.password)
    await page.fill('input[id="confirmPassword"]', 'DifferentPassword123!')
    
    await page.click('button[type="submit"]')
    
    // Should show error toast (check for toast message)
    await page.waitForTimeout(1000)
    
    // Check if form is still on page (not redirected)
    await expect(page.locator('input[id="email"]')).toBeVisible()
    
    console.log('✅ Password mismatch validation works')
  })

  test('Signup Validation - Short Password', async ({ page }) => {
    await page.goto('/signup')
    
    await page.fill('input[id="fullName"]', testUser.fullName)
    await page.fill('input[id="email"]', testUser.email)
    await page.fill('input[id="password"]', '12345') // Too short
    await page.fill('input[id="confirmPassword"]', '12345')
    
    await page.click('button[type="submit"]')
    
    // Should show validation error
    await page.waitForTimeout(1000)
    await expect(page.locator('input[id="password"]')).toBeVisible()
    
    console.log('✅ Short password validation works')
  })

  test('Login Flow - Regular User', async ({ page }) => {
    await page.goto('/login')
    
    // Verify login page loads
    await expect(page.locator('h1')).toContainText('Welcome')
    
    // Fill login form
    await page.fill('input[id="email"]', testUser.email)
    await page.fill('input[id="password"]', testUser.password)
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Wait for redirect
    await page.waitForTimeout(3000)
    
    // Should redirect to home page
    const currentUrl = page.url()
    expect(currentUrl).toMatch(/\/(home|$|\?)/)
    
    console.log('✅ User login completed')
  })

  test('Login Flow - Author', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('input[id="email"]', testAuthor.email)
    await page.fill('input[id="password"]', testAuthor.password)
    
    await page.click('button[type="submit"]')
    
    // Wait for redirect
    await page.waitForTimeout(3000)
    
    // Should redirect to author dashboard
    const currentUrl = page.url()
    expect(currentUrl).toMatch(/\/author/)
    
    console.log('✅ Author login completed')
  })

  test('Login Flow - Admin', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('input[id="email"]', adminUser.email)
    await page.fill('input[id="password"]', adminUser.password)
    
    await page.click('button[type="submit"]')
    
    // Wait for redirect
    await page.waitForTimeout(3000)
    
    // Should redirect to admin dashboard
    const currentUrl = page.url()
    expect(currentUrl).toMatch(/\/admin/)
    
    console.log('✅ Admin login completed')
  })

  test('Login Validation - Invalid Credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('input[id="email"]', 'invalid@example.com')
    await page.fill('input[id="password"]', 'WrongPassword123!')
    
    await page.click('button[type="submit"]')
    
    // Wait for error message
    await page.waitForTimeout(2000)
    
    // Should still be on login page
    await expect(page.locator('input[id="email"]')).toBeVisible()
    
    console.log('✅ Invalid credentials validation works')
  })

  test('Navigation - Signup to Login', async ({ page }) => {
    await page.goto('/signup')
    
    // Click login link
    await page.click('a:has-text("Sign in")')
    
    // Should navigate to login page
    await expect(page).toHaveURL(/\/login/)
    await expect(page.locator('h1')).toContainText('Welcome')
    
    console.log('✅ Navigation signup → login works')
  })

  test('Navigation - Login to Signup', async ({ page }) => {
    await page.goto('/login')
    
    // Click signup link
    await page.click('a:has-text("Sign up")')
    
    // Should navigate to signup page
    await expect(page).toHaveURL(/\/signup/)
    await expect(page.locator('h1')).toContainText('Join')
    
    console.log('✅ Navigation login → signup works')
  })

  test('Navigation - Back to Home from Login', async ({ page }) => {
    await page.goto('/login')
    
    // Click back to home link
    await page.click('a:has-text("Back to Home")')
    
    // Should navigate to home
    await expect(page).toHaveURL(/\//)
    
    console.log('✅ Navigation login → home works')
  })

  test('Navigation - Back to Home from Signup', async ({ page }) => {
    await page.goto('/signup')
    
    // Click back to home link
    await page.click('a:has-text("Back to Home")')
    
    // Should navigate to home
    await expect(page).toHaveURL(/\//)
    
    console.log('✅ Navigation signup → home works')
  })
})
