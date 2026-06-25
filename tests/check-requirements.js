#!/usr/bin/env node

/**
 * Check if requirements are met for running tests
 */

const nodeVersion = process.version
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

log('\n🔍 Checking Requirements\n', 'cyan')
log('='.repeat(50), 'cyan')

// Check Node.js version
log(`\nNode.js Version: ${nodeVersion}`, 'blue')
if (majorVersion >= 18) {
  log('✅ Node.js 18+ detected (fetch API available)', 'green')
} else {
  log('❌ Node.js 18+ required for fetch API', 'red')
  log('   Please upgrade to Node.js 18 or later', 'yellow')
  process.exit(1)
}

// Check if fetch is available
if (typeof fetch !== 'undefined') {
  log('✅ fetch API is available', 'green')
} else {
  log('❌ fetch API not available', 'red')
  log('   This should not happen on Node.js 18+', 'yellow')
  process.exit(1)
}

// Check if server is running
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
log(`\nChecking server at: ${BASE_URL}`, 'blue')

fetch(BASE_URL)
  .then(response => {
    if (response.ok) {
      log('✅ Server is running', 'green')
      log('\n' + '='.repeat(50), 'cyan')
      log('\n🎉 All requirements met! You can run tests now:', 'green')
      log('   npm test', 'cyan')
      log('   npm run test:auth', 'cyan')
      log('   npm run test:all', 'cyan')
      log('\n' + '='.repeat(50) + '\n', 'cyan')
    } else {
      log(`⚠️  Server returned ${response.status}`, 'yellow')
      log('   Server might be starting up...', 'yellow')
    }
  })
  .catch(error => {
    log('❌ Cannot connect to server', 'red')
    log(`   Error: ${error.message}`, 'yellow')
    log('\n💡 Start the server with: npm run dev', 'yellow')
    log('\n' + '='.repeat(50) + '\n', 'cyan')
    process.exit(1)
  })
