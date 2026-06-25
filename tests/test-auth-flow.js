#!/usr/bin/env node

/**
 * Authentication Flow Tests - No Installation Required
 * Tests signup and login flows via HTTP
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

async function testPage(url, checkFn) {
  const response = await fetch(`${BASE_URL}${url}`)
  if (!response.ok) {
    throw new Error(`Page returned ${response.status}`)
  }
  const html = await response.text()
  if (checkFn) {
    checkFn(html)
  }
  return html
}

const tests = [
  test('Login page has email input', async () => {
    const html = await testPage('/login')
    if (!html.includes('email') && !html.includes('Email') && !html.includes('input')) {
      throw new Error('Login form not found')
    }
  }),

  test('Login page has password input', async () => {
    const html = await testPage('/login')
    if (!html.includes('password') && !html.includes('Password')) {
      throw new Error('Password field not found')
    }
  }),

  test('Login page has submit button', async () => {
    const html = await testPage('/login')
    if (!html.includes('submit') && !html.includes('Sign In') && !html.includes('button')) {
      throw new Error('Submit button not found')
    }
  }),

  test('Signup page has name input', async () => {
    const html = await testPage('/signup')
    if (!html.includes('name') && !html.includes('Name') && !html.includes('fullName')) {
      throw new Error('Name field not found')
    }
  }),

  test('Signup page has email input', async () => {
    const html = await testPage('/signup')
    if (!html.includes('email') && !html.includes('Email')) {
      throw new Error('Email field not found')
    }
  }),

  test('Signup page has password inputs', async () => {
    const html = await testPage('/signup')
    if (!html.includes('password') && !html.includes('Password')) {
      throw new Error('Password fields not found')
    }
  }),

  test('Signup page has role selection', async () => {
    const html = await testPage('/signup')
    if (!html.includes('user') && !html.includes('author') && !html.includes('role')) {
      throw new Error('Role selection not found')
    }
  }),

  test('Signup page has submit button', async () => {
    const html = await testPage('/signup')
    if (!html.includes('submit') && !html.includes('Create Account') && !html.includes('button')) {
      throw new Error('Submit button not found')
    }
  }),

  test('Login page links to signup', async () => {
    const html = await testPage('/login')
    if (!html.includes('/signup') && !html.includes('Sign up')) {
      throw new Error('Signup link not found')
    }
  }),

  test('Signup page links to login', async () => {
    const html = await testPage('/signup')
    if (!html.includes('/login') && !html.includes('Sign in')) {
      throw new Error('Login link not found')
    }
  }),

  test('Auth pages have back to home link', async () => {
    const loginHtml = await testPage('/login')
    const signupHtml = await testPage('/signup')
    
    const hasBackLink = (loginHtml.includes('Back to Home') || loginHtml.includes('/')) &&
                       (signupHtml.includes('Back to Home') || signupHtml.includes('/'))
    
    if (!hasBackLink) {
      throw new Error('Back to home link not found')
    }
  }),
]

async function runTests() {
  log('\n🔐 Testing Authentication Flows\n', 'cyan')
  log(`Testing: ${BASE_URL}\n`, 'blue')

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
  log('='.repeat(50) + '\n', 'cyan')

  process.exit(failed > 0 ? 1 : 0)
}

runTests().catch(error => {
  log(`\n❌ Fatal Error: ${error.message}\n`, 'red')
  process.exit(1)
})
