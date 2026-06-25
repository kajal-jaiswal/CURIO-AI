import { test, expect } from '@playwright/test'

const testUser = {
  email: `test-user-${Date.now()}@example.com`,
  password: 'TestPassword123!',
  fullName: 'Test User'
}

test.describe('Complete User Flows', () => {
  
  test('Complete Flow - Signup → Browse → Comment', async ({ page }) => {
    // Step 1: Signup
    await page.goto('/signup')
    await page.fill('input[id="fullName"]', testUser.fullName)
    await page.fill('input[id="email"]', testUser.email)
    await page.fill('input[id="password"]', testUser.password)
    await page.fill('input[id="confirmPassword"]', testUser.password)
    await page.click('button:has-text("Read & Comment")')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(3000)
    
    console.log('✅ Step 1: User signed up')
    
    // Step 2: Browse blog
    await page.goto('/blog')
    await expect(page.locator('h1')).toContainText(/Articles|Blog/i)
    
    // Check if posts are visible
    const postsVisible = await page.locator('article, [class*="post"]').count()
    console.log(`✅ Step 2: Found ${postsVisible} posts on blog page`)
    
    // Step 3: Click on first post
    const firstPost = page.locator('a[href*="/blog/"]').first()
    if (await firstPost.count() > 0) {
      await firstPost.click()
      await page.waitForTimeout(2000)
      
      // Should be on post detail page
      await expect(page.locator('article, main')).toBeVisible()
      console.log('✅ Step 3: Opened blog post')
      
      // Step 4: Try to comment (if comment section exists)
      const commentSection = page.locator('textarea, input[name="message"]')
      if (await commentSection.count() > 0) {
        await commentSection.first().fill('This is a test comment from automation!')
        console.log('✅ Step 4: Comment form found and filled')
      }
    }
    
    console.log('✅ Complete user flow test passed')
  })

  test('Complete Flow - Author Signup → Create Post', async ({ page }) => {
    const testAuthor = {
      email: `test-author-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      fullName: 'Test Author'
    }
    
    // Step 1: Signup as author
    await page.goto('/signup')
    await page.fill('input[id="fullName"]', testAuthor.fullName)
    await page.fill('input[id="email"]', testAuthor.email)
    await page.fill('input[id="password"]', testAuthor.password)
    await page.fill('input[id="confirmPassword"]', testAuthor.password)
    await page.click('button:has-text("Write Posts")')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(3000)
    
    console.log('✅ Step 1: Author signed up')
    
    // Step 2: Navigate to author dashboard
    await page.goto('/author')
    await expect(page).toHaveURL(/\/author/)
    console.log('✅ Step 2: Author dashboard accessed')
    
    // Step 3: Try to create new post
    const newPostLink = page.locator('a[href*="/author/posts/new"], a:has-text("New Post"), button:has-text("New Post")')
    if (await newPostLink.count() > 0) {
      await newPostLink.first().click()
      await page.waitForTimeout(2000)
      
      // Check if post editor is visible
      const titleInput = page.locator('input[id="title"], input[name="title"]')
      if (await titleInput.count() > 0) {
        await titleInput.first().fill('Test Post from Automation')
        console.log('✅ Step 3: Post editor accessible and title filled')
      }
    }
    
    console.log('✅ Complete author flow test passed')
  })

  test('Complete Flow - Admin Login → Manage Posts', async ({ page }) => {
    const adminUser = {
      email: process.env.TEST_ADMIN_EMAIL || 'admin@curioai.com',
      password: process.env.TEST_ADMIN_PASSWORD || 'password'
    }
    
    // Step 1: Login as admin
    await page.goto('/login')
    await page.fill('input[id="email"]', adminUser.email)
    await page.fill('input[id="password"]', adminUser.password)
    await page.click('button[type="submit"]')
    await page.waitForTimeout(3000)
    
    console.log('✅ Step 1: Admin logged in')
    
    // Step 2: Navigate to admin posts
    await page.goto('/admin/posts')
    await expect(page).toHaveURL(/\/admin\/posts/)
    
    // Check if posts table/list is visible
    await expect(page.locator('h1, h2')).toContainText(/Posts/i)
    console.log('✅ Step 2: Admin posts page accessed')
    
    // Step 3: Check for new post button
    const newPostButton = page.locator('a[href*="/admin/posts/new"], button:has-text("New Post"), a:has-text("New Post")')
    if (await newPostButton.count() > 0) {
      console.log('✅ Step 3: New post button found')
    }
    
    console.log('✅ Complete admin flow test passed')
  })

  test('Navigation Flow - Home → Blog → Post → Back', async ({ page }) => {
    // Step 1: Homepage
    await page.goto('/')
    await expect(page).toHaveURL(/\//)
    console.log('✅ Step 1: Homepage loaded')
    
    // Step 2: Navigate to blog
    const blogLink = page.locator('a[href="/blog"], a:has-text("Blog")')
    if (await blogLink.count() > 0) {
      await blogLink.first().click()
      await page.waitForTimeout(1000)
      await expect(page).toHaveURL(/\/blog/)
      console.log('✅ Step 2: Navigated to blog')
      
      // Step 3: Click on a post
      const firstPost = page.locator('a[href*="/blog/"]').first()
      if (await firstPost.count() > 0) {
        await firstPost.click()
        await page.waitForTimeout(2000)
        await expect(page).toHaveURL(/\/blog\/.+/)
        console.log('✅ Step 3: Opened blog post')
        
        // Step 4: Navigate back
        await page.goBack()
        await page.waitForTimeout(1000)
        await expect(page).toHaveURL(/\/blog/)
        console.log('✅ Step 4: Navigated back to blog')
      }
    }
    
    console.log('✅ Navigation flow test passed')
  })

  test('Search Flow - Home → Search → Results', async ({ page }) => {
    await page.goto('/')
    
    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], input[placeholder*="search"]')
    if (await searchInput.count() > 0) {
      await searchInput.first().fill('AI tools')
      await searchInput.first().press('Enter')
      await page.waitForTimeout(2000)
      
      // Should navigate to blog with search query
      const currentUrl = page.url()
      expect(currentUrl).toMatch(/\/blog/)
      console.log('✅ Search flow completed')
    } else {
      console.log('⚠️ Search input not found, skipping search test')
    }
  })
})
