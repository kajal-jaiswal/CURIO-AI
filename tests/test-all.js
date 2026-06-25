#!/usr/bin/env node

/**
 * Run All Tests - No Installation Required
 * Runs all test suites sequentially
 */

const { spawn } = require('child_process')
const path = require('path')

const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function runTest(script) {
  return new Promise((resolve, reject) => {
    log(`\n📋 Running: ${script}\n`, 'cyan')
    
    const testProcess = spawn('node', [path.join(__dirname, script)], {
      stdio: 'inherit',
      shell: true,
    })

    testProcess.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Test ${script} failed with code ${code}`))
      }
    })

    testProcess.on('error', (error) => {
      reject(error)
    })
  })
}

async function runAllTests() {
  log('\n🚀 Running All Test Suites\n', 'cyan')
  log('='.repeat(60) + '\n', 'cyan')

  const testSuites = [
    'simple-test.js',
    'test-auth-flow.js',
  ]

  let allPassed = true

  for (const suite of testSuites) {
    try {
      await runTest(suite)
      log(`\n✅ ${suite} completed successfully\n`, 'green')
    } catch (error) {
      log(`\n❌ ${suite} failed: ${error.message}\n`, 'yellow')
      allPassed = false
    }
  }

  log('\n' + '='.repeat(60), 'cyan')
  if (allPassed) {
    log('\n🎉 All test suites passed!\n', 'green')
  } else {
    log('\n⚠️  Some test suites failed\n', 'yellow')
  }
  log('='.repeat(60) + '\n', 'cyan')

  process.exit(allPassed ? 0 : 1)
}

runAllTests().catch(error => {
  log(`\n❌ Fatal Error: ${error.message}\n`, 'yellow')
  process.exit(1)
})
