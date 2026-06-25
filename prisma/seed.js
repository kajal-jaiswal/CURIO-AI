// Plain JS seed — no TSX/ESM needed, uses @libsql/client directly
const { createClient } = require('@libsql/client')
const bcrypt = require('bcryptjs')

const db = createClient({ url: process.env.DATABASE_URL || 'file:./dev.db' })

async function run(sql, args = []) {
  return db.execute({ sql, args })
}

async function main() {
  console.log('Seeding database...')

  // Categories — must match GENERATION_CATEGORIES in lib/news-service.ts
  const categories = [
    ['ai-tools',    'AI Tools',     'Reviews and guides for AI software and automation tools'],
    ['technology',  'Technology',   'Latest tech trends, gadgets, and software news'],
    ['business',    'Business',     'AI for small business, startups, and entrepreneurship'],
    ['healthcare',  'Healthcare',   'Health tech, medical breakthroughs, and wellness'],
    ['information', 'Information',  'General knowledge, science, and world news'],
    ['crime',       'Crime',        'Criminal justice, cybercrime, and public safety'],
    ['startups',    'Startups',     'Startup culture, funding, and founder stories'],
    ['productivity','Productivity', 'AI-powered productivity tips and workflows'],
  ]

  for (const [slug, name, description] of categories) {
    const id = `cat_${slug.replace(/-/g, '_')}`
    await run(
      `INSERT OR IGNORE INTO Category (id, name, slug, description) VALUES (?, ?, ?, ?)`,
      [id, name, slug, description]
    )
  }
  console.log(`✓ ${categories.length} categories seeded`)

  // Tags
  const tags = [
    ['ai', 'AI'],
    ['machine-learning', 'Machine Learning'],
    ['productivity', 'Productivity'],
    ['tools', 'Tools'],
    ['automation', 'Automation'],
    ['chatgpt', 'ChatGPT'],
    ['small-business', 'Small Business'],
    ['tutorial', 'Tutorial'],
  ]

  for (const [slug, name] of tags) {
    const id = `tag_${slug.replace(/-/g, '_')}`
    await run(
      `INSERT OR IGNORE INTO Tag (id, name, slug) VALUES (?, ?, ?)`,
      [id, name, slug]
    )
  }
  console.log(`✓ ${tags.length} tags seeded`)

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@curioai.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456'
  const adminHash = await bcrypt.hash(adminPassword, 12)
  const now = new Date().toISOString()

  await run(
    `INSERT OR IGNORE INTO User (id, email, password_hash, full_name, role, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['user_admin', adminEmail, adminHash, 'Admin', 'admin', 1, now, now]
  )
  console.log(`✓ Admin user: ${adminEmail} / ${adminPassword}`)

  console.log('\nDatabase seeded successfully!')
  console.log(`\nLogin: http://localhost:3000/admin/login`)
  console.log(`Email:    ${adminEmail}`)
  console.log(`Password: ${adminPassword}`)
}

main()
  .catch(err => { console.error(err); process.exit(1) })
  .finally(() => db.close())
