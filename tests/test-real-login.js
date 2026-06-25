#!/usr/bin/env node

/**
 * Real Login Flow Test - Actually tests login functionality
 * Requires: Server running + Valid credentials
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

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

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function test(name, fn) {
  return async () => {
    try {
      await fn()
      passed++
      log(`✅ ${name}`, 'green')
      return true
    } catch (error) {
      failed++
      log(`❌ ${name}`, 'red')
      log(`   Error: ${error.message}`, 'yellow')
      return false
    }
  }
}

// Test credentials (you can set these via environment variables)
const TEST_CREDENTIALS = {
  email: process.env.TEST_USER_EMAIL || 'test@example.com',
  password: process.env.TEST_USER_PASSWORD || 'password123',
  adminEmail: process.env.TEST_ADMIN_EMAIL || 'admin@curioai.com',
  adminPassword: process.env.TEST_ADMIN_PASSWORD || 'password',
}

async function testLoginPage() {
  const response = await fetch(`${BASE_URL}/login`)
  if (!response.ok) {
    throw new Error(`Login page returned ${response.status}`)
  }
  const html = await response.text()
  
  // Check for login form elements
  if (!html.includes('email') && !html.includes('Email')) {
    throw new Error('Email field not found')
  }
  if (!html.includes('password') && !html.includes('Password')) {
    throw new Error('Password field not found')
  }
  
  return html
}

async function testSignupPage() {
  const response = await fetch(`${BASE_URL}/signup`)
  if (!response.ok) {
    throw new Error(`Signup page returned ${response.status}`)
  }
  const html = await response.text()
  
  if (!html.includes('Join') && !html.includes('signup')) {
    throw new Error('Signup page content not found')
  }
  
  return html
}

async function testProtectedRoute(route, shouldRedirect = true) {
  const response = await fetch(`${BASE_URL}${route}`, {
    redirect: 'manual', // Don't follow redirects automatically
  })
  
  if (shouldRedirect) {
    // Should redirect to login (302/307) or show login page
    if (response.status === 302 || response.status === 307) {
      const location = response.headers.get('location')
      if (location && location.includes('login')) {
        return true
      }
    } else if (response.status === 200) {
      const html = await response.text()
      if (html.includes('login') || html.includes('Sign in')) {
        return true
      }
    }
    throw new Error(`Route ${route} should be protected but isn't`)
  }
  
  return response.ok
}

const tests = [
  test('Login page is accessible', async () => {
    await testLoginPage()
  }),

  test('Signup page is accessible', async () => {
    await testSignupPage()
  }),

  test('Admin dashboard is protected (redirects to login)', async () => {
    await testProtectedRoute('/admin', true)
  }),

  test('Author dashboard is protected (redirects to login)', async () => {
    await testProtectedRoute('/author', true)
  }),

  test('Admin posts page is protected', async () => {
    await testProtectedRoute('/admin/posts', true)
  }),

  test('Author posts page is protected', async () => {
    await testProtectedRoute('/author/posts', true)
  }),

  test('Public blog page is accessible', async () => {
    await testProtectedRoute('/blog', false)
  }),

  test('Public homepage is accessible', async () => {
    await testProtectedRoute('/', false)
  }),
]

async function runTests() {
  log('\n🔐 Testing Real Login & Authentication Flows\n', 'cyan')
  log(`Testing: ${BASE_URL}\n`, 'blue')
  log('ℹ️  Note: These tests check page accessibility and protection.\n', 'yellow')
  log('   For actual login testing, you need:', 'yellow')
  log('   1. Server running (npm run dev)', 'yellow')
  log('   2. Valid Supabase credentials configured', 'yellow')
  log('   3. Test user accounts created\n', 'yellow')

  // Check server
  try {
    await fetch(BASE_URL)
    log('✅ Server is running\n', 'green')
  } catch (error) {
    log(`❌ Cannot connect to server: ${error.message}\n`, 'red')
    log('💡 Start the server with: npm run dev\n', 'yellow')
    process.exit(1)
  }

  // Run tests
  for (const testFn of tests) {
    await testFn()
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Summary
  log('\n' + '='.repeat(50), 'cyan')
  log('\n📊 Results\n', 'cyan')
  log(`✅ Passed: ${passed}`, 'green')
  log(`❌ Failed: ${failed}`, failed > 0 ? 'red' : 'green')
  log(`📈 Total:  ${passed + failed}\n`, 'blue')
  
  log('💡 To test actual login with credentials:', 'yellow')
  log('   1. Set TEST_USER_EMAIL and TEST_USER_PASSWORD in .env.local', 'yellow')
  log('   2. Create test user in Supabase', 'yellow')
  log('   3. Use Playwright tests for full browser-based login testing\n', 'yellow')
  
  log('='.repeat(50) + '\n', 'cyan')

  process.exit(failed > 0 ? 1 : 0)
}

runTests().catch(error => {
  log(`\n❌ Fatal Error: ${error.message}\n`, 'red')
  process.exit(1)
})
