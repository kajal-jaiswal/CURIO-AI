#!/usr/bin/env node

/**
 * Simple E2E Test Suite - No Installation Required
 * Uses only Node.js built-in fetch API (Node 18+)
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

let passed = 0
let failed = 0
const results = []

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function test(name, fn) {
  return async () => {
    try {
      await fn()
      passed++
      results.push({ name, status: 'PASS', error: null })
      log(`✅ ${name}`, 'green')
      return true
    } catch (error) {
      failed++
      results.push({ name, status: 'FAIL', error: error.message })
      log(`❌ ${name}`, 'red')
      log(`   Error: ${error.message}`, 'yellow')
      return false
    }
  }
}

async function checkServer() {
  try {
    const response = await fetch(BASE_URL)
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`)
    }
    return true
  } catch (error) {
    throw new Error(`Cannot connect to server at ${BASE_URL}. Make sure 'npm run dev' is running.`)
  }
}

async function testPage(url, expectedText) {
  const response = await fetch(`${BASE_URL}${url}`)
  if (!response.ok) {
    throw new Error(`Page returned ${response.status}`)
  }
  const html = await response.text()
  if (expectedText && !html.includes(expectedText)) {
    throw new Error(`Expected text "${expectedText}" not found`)
  }
  return html
}

async function testFormSubmission(url, formData) {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
  return response
}

// Test Suite
const tests = [
  test('Server is running', async () => {
    await checkServer()
  }),

  test('Homepage loads', async () => {
    await testPage('/', 'Curio AI')
  }),

  test('Blog page loads', async () => {
    await testPage('/blog')
  }),

  test('About page loads', async () => {
    await testPage('/about', 'About')
  }),

  test('Contact page loads', async () => {
    await testPage('/contact', 'Contact')
  }),

  test('Privacy page loads', async () => {
    await testPage('/privacy', 'Privacy')
  }),

  test('Terms page loads', async () => {
    await testPage('/terms', 'Terms')
  }),

  test('Login page loads', async () => {
    await testPage('/login', 'Sign in')
  }),

  test('Signup page loads', async () => {
    await testPage('/signup', 'Join')
  }),

  test('404 page works', async () => {
    const response = await fetch(`${BASE_URL}/this-page-does-not-exist-12345`)
    const html = await response.text()
    if (!html.includes('404') && !html.includes('Not Found')) {
      throw new Error('404 page not showing correctly')
    }
  }),

  test('Sitemap is accessible', async () => {
    const response = await fetch(`${BASE_URL}/sitemap.xml`)
    if (!response.ok) {
      throw new Error(`Sitemap returned ${response.status}`)
    }
    const xml = await response.text()
    if (!xml.includes('<?xml')) {
      throw new Error('Sitemap is not valid XML')
    }
  }),

  test('Robots.txt is accessible', async () => {
    const response = await fetch(`${BASE_URL}/robots.txt`)
    if (!response.ok) {
      throw new Error(`Robots.txt returned ${response.status}`)
    }
    const text = await response.text()
    if (!text.includes('robots') && !text.includes('sitemap')) {
      throw new Error('Robots.txt content seems invalid')
    }
  }),

  test('RSS feed is accessible', async () => {
    const response = await fetch(`${BASE_URL}/feed.xml`)
    if (!response.ok) {
      throw new Error(`RSS feed returned ${response.status}`)
    }
    const xml = await response.text()
    if (!xml.includes('<?xml') || !xml.includes('rss')) {
      throw new Error('RSS feed is not valid XML')
    }
  }),

  test('Admin dashboard is protected', async () => {
    const response = await fetch(`${BASE_URL}/admin`)
    // Should redirect to login (302) or show login page
    if (response.status === 200) {
      const html = await response.text()
      if (!html.includes('login') && !html.includes('Sign in')) {
        throw new Error('Admin dashboard should be protected')
      }
    } else if (response.status !== 302 && response.status !== 307) {
      throw new Error(`Expected redirect, got ${response.status}`)
    }
  }),

  test('Author dashboard is protected', async () => {
    const response = await fetch(`${BASE_URL}/author`)
    // Should redirect to login
    if (response.status === 200) {
      const html = await response.text()
      if (!html.includes('login') && !html.includes('Sign in')) {
        throw new Error('Author dashboard should be protected')
      }
    } else if (response.status !== 302 && response.status !== 307) {
      throw new Error(`Expected redirect, got ${response.status}`)
    }
  }),

  test('Pages have SEO meta tags', async () => {
    const html = await testPage('/')
    if (!html.includes('<title>') && !html.includes('title')) {
      throw new Error('Page missing title tag')
    }
  }),

  test('Navigation links exist', async () => {
    const html = await testPage('/')
    const hasBlogLink = html.includes('/blog') || html.includes('href="/blog"')
    const hasAboutLink = html.includes('/about') || html.includes('href="/about"')
    
    if (!hasBlogLink && !hasAboutLink) {
      throw new Error('Navigation links not found')
    }
  }),
]

async function runTests() {
  log('\n🧪 Starting Simple E2E Test Suite\n', 'cyan')
  log(`Testing: ${BASE_URL}\n`, 'blue')

  // Check server first
  try {
    await checkServer()
    log('✅ Server is running\n', 'green')
  } catch (error) {
    log(`❌ ${error.message}\n`, 'red')
    log('💡 Start the server with: npm run dev\n', 'yellow')
    process.exit(1)
  }

  // Run all tests
  for (const testFn of tests) {
    await testFn()
    await new Promise(resolve => setTimeout(resolve, 100)) // Small delay between tests
  }

  // Print summary
  log('\n' + '='.repeat(50), 'cyan')
  log('\n📊 Test Results Summary\n', 'cyan')
  log(`✅ Passed: ${passed}`, 'green')
  log(`❌ Failed: ${failed}`, failed > 0 ? 'red' : 'green')
  log(`📈 Total:  ${passed + failed}\n`, 'blue')

  if (failed > 0) {
    log('Failed Tests:', 'red')
    results.filter(r => r.status === 'FAIL').forEach(r => {
      log(`  - ${r.name}: ${r.error}`, 'yellow')
    })
    log('')
  }

  log('='.repeat(50) + '\n', 'cyan')

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0)
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Fatal Error: ${error.message}\n`, 'red')
  process.exit(1)
})
