#!/usr/bin/env node

/**
 * Environment Variables Checker
 * Verifies all required environment variables are set
 */

require('dotenv').config({ path: '.env.local' })

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

const required = {
  'NEXT_PUBLIC_SUPABASE_URL': {
    required: true,
    description: 'Supabase Project URL',
    where: 'Supabase Dashboard → Settings → API → Project URL',
  },
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': {
    required: true,
    description: 'Supabase Anon/Public Key',
    where: 'Supabase Dashboard → Settings → API → anon public key',
  },
  'SUPABASE_SERVICE_ROLE_KEY': {
    required: true,
    description: 'Supabase Service Role Key',
    where: 'Supabase Dashboard → Settings → API → service_role key',
  },
  'NEXT_PUBLIC_SITE_URL': {
    required: true,
    description: 'Your Site URL',
    where: 'http://localhost:3000 (local) or your domain (production)',
    default: 'http://localhost:3000',
  },
}

const optional = {
  'GEMINI_API_KEY': {
    description: 'Google Gemini API Key (for AI features)',
    where: 'https://makersuite.google.com/app/apikey',
  },
  'CRON_SECRET': {
    description: 'Secret key for cron job security',
    where: 'Generate random 32+ character string',
  },
}

let allGood = true

log('\n🔍 Checking Environment Variables\n', 'cyan')
log('='.repeat(60), 'cyan')

// Check required variables
log('\n📋 Required Variables:\n', 'blue')

for (const [key, info] of Object.entries(required)) {
  const value = process.env[key]
  const hasValue = value && value !== '' && !value.includes('your_') && !value.includes('placeholder')
  
  if (!hasValue && info.default) {
    log(`⚠️  ${key}`, 'yellow')
    log(`   Not set, using default: ${info.default}`, 'yellow')
    log(`   ${info.description}`, 'yellow')
  } else if (!hasValue) {
    log(`❌ ${key}`, 'red')
    log(`   Missing! ${info.description}`, 'red')
    log(`   Get it from: ${info.where}`, 'yellow')
    allGood = false
  } else {
    // Mask sensitive values
    const masked = key.includes('KEY') || key.includes('SECRET')
      ? `${value.substring(0, 10)}...${value.substring(value.length - 4)}`
      : value
    log(`✅ ${key}`, 'green')
    log(`   ${masked}`, 'green')
  }
}

// Check optional variables
log('\n📋 Optional Variables (for AI features):\n', 'blue')

let optionalCount = 0
for (const [key, info] of Object.entries(optional)) {
  const value = process.env[key]
  const hasValue = value && value !== '' && !value.includes('your_') && !value.includes('placeholder')
  
  if (hasValue) {
    const masked = key.includes('KEY') || key.includes('SECRET')
      ? `${value.substring(0, 10)}...${value.substring(value.length - 4)}`
      : value
    log(`✅ ${key}`, 'green')
    log(`   ${masked}`, 'green')
    optionalCount++
  } else {
    log(`⚪ ${key}`, 'yellow')
    log(`   Not set (optional) - ${info.description}`, 'yellow')
    log(`   Get it from: ${info.where}`, 'yellow')
  }
}

// Summary
log('\n' + '='.repeat(60), 'cyan')
log('\n📊 Summary\n', 'cyan')

if (allGood) {
  log('✅ All required variables are set!', 'green')
  log(`✅ ${optionalCount}/${Object.keys(optional).length} optional variables set`, 'green')
  log('\n🎉 You\'re ready to run the app!', 'green')
  log('\nNext steps:', 'blue')
  log('1. Run: npm run dev', 'blue')
  log('2. Open: http://localhost:3000', 'blue')
  log('3. Login with your admin account', 'blue')
} else {
  log('❌ Some required variables are missing!', 'red')
  log('\n💡 Fix:', 'yellow')
  log('1. Open .env.local file', 'yellow')
  log('2. Add missing variables (see above)', 'yellow')
  log('3. Get values from Supabase Dashboard → Settings → API', 'yellow')
  log('4. Run this check again: node check-env.js', 'yellow')
}

log('\n' + '='.repeat(60) + '\n', 'cyan')

// Validate format
log('🔍 Validating Format:\n', 'blue')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
if (supabaseUrl && !supabaseUrl.startsWith('https://') && !supabaseUrl.includes('supabase.co')) {
  log('⚠️  NEXT_PUBLIC_SUPABASE_URL should start with https:// and contain supabase.co', 'yellow')
}

const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (anonKey && anonKey.length < 50) {
  log('⚠️  NEXT_PUBLIC_SUPABASE_ANON_KEY seems too short (should be ~200+ chars)', 'yellow')
}

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (serviceKey && serviceKey.length < 50) {
  log('⚠️  SUPABASE_SERVICE_ROLE_KEY seems too short (should be ~200+ chars)', 'yellow')
}

process.exit(allGood ? 0 : 1)
