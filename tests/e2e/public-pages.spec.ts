import { test, expect } from '@playwright/test'

test.describe('Public Pages Accessibility', () => {
  
  test('Homepage - Loads and Displays Content', async ({ page }) => {
    await page.goto('/')
    
    // Check for main elements
    await expect(page.locator('h1, h2')).toBeVisible()
    
    // Check for navigation
    const header = page.locator('header, nav')
    await expect(header).toBeVisible()
    
    // Check for footer
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    
    console.log('✅ Homepage loads correctly')
  })

  test('Blog Listing Page - Loads and Shows Posts', async ({ page }) => {
    await page.goto('/blog')
    
    // Should see blog heading
    await expect(page.locator('h1, h2')).toContainText(/Articles|Blog/i)
    
    // Check for filters or post list
    const content = page.locator('main, article, [class*="post"]')
    await expect(content.first()).toBeVisible()
    
    console.log('✅ Blog listing page loads correctly')
  })

  test('About Page - Accessible', async ({ page }) => {
    await page.goto('/about')
    
    await expect(page.locator('h1')).toContainText(/About/i)
    await expect(page.locator('main')).toBeVisible()
    
    console.log('✅ About page accessible')
  })

  test('Contact Page - Form Visible', async ({ page }) => {
    await page.goto('/contact')
    
    await expect(page.locator('h1')).toContainText(/Contact/i)
    
    // Check for form elements
    const form = page.locator('form')
    await expect(form).toBeVisible()
    
    console.log('✅ Contact page accessible with form')
  })

  test('Privacy Page - Accessible', async ({ page }) => {
    await page.goto('/privacy')
    
    await expect(page.locator('h1')).toContainText(/Privacy/i)
    await expect(page.locator('main')).toBeVisible()
    
    console.log('✅ Privacy page accessible')
  })

  test('Terms Page - Accessible', async ({ page }) => {
    await page.goto('/terms')
    
    await expect(page.locator('h1')).toContainText(/Terms/i)
    await expect(page.locator('main')).toBeVisible()
    
    console.log('✅ Terms page accessible')
  })

  test('404 Page - Shows for Invalid Routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-12345')
    
    // Should show 404 content
    await expect(page.locator('h1, h2')).toContainText(/404|Not Found/i)
    
    console.log('✅ 404 page works correctly')
  })

  test('Navigation - All Links Work', async ({ page }) => {
    await page.goto('/')
    
    const navLinks = [
      { text: 'Home', url: '/' },
      { text: 'Blog', url: '/blog' },
      { text: 'About', url: '/about' },
      { text: 'Contact', url: '/contact' }
    ]
    
    for (const link of navLinks) {
      const navLink = page.locator(`a:has-text("${link.text}")`).first()
      if (await navLink.count() > 0) {
        await navLink.click()
        await page.waitForTimeout(1000)
        await expect(page).toHaveURL(new RegExp(link.url.replace('/', '\\/')))
        console.log(`✅ Navigation link "${link.text}" works`)
      }
    }
  })

  test('SEO - Meta Tags Present', async ({ page }) => {
    await page.goto('/')
    
    // Check for title
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)
    
    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]')
    if (await metaDescription.count() > 0) {
      const description = await metaDescription.getAttribute('content')
      expect(description).toBeTruthy()
    }
    
    console.log('✅ SEO meta tags present')
  })

  test('Responsive - Mobile View', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/')
    
    // Check if page loads without horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = page.viewportSize()?.width || 375
    
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20) // Allow small margin
    
    console.log('✅ Mobile responsive design works')
  })
})
