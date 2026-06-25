const bcrypt = require('bcryptjs')
const { createClient } = require('@libsql/client')

const db = createClient({ url: 'file:./dev.db' })
const now = new Date().toISOString()

async function main() {
  const modHash = await bcrypt.hash('Moderator@123456', 12)
  const authorHash = await bcrypt.hash('Author@123456', 12)
  const userHash = await bcrypt.hash('User@123456', 12)

  await db.execute({
    sql: 'INSERT OR IGNORE INTO User (id, email, password_hash, full_name, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    args: ['user_moderator', 'moderator@curioai.com', modHash, 'Moderator', 'moderator', 1, now, now]
  })

  await db.execute({
    sql: 'INSERT OR IGNORE INTO User (id, email, password_hash, full_name, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    args: ['user_author', 'author@curioai.com', authorHash, 'Author', 'author', 1, now, now]
  })

  await db.execute({
    sql: 'INSERT OR IGNORE INTO User (id, email, password_hash, full_name, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    args: ['user_reader', 'user@curioai.com', userHash, 'Reader', 'user', 1, now, now]
  })

  console.log('Done! Test accounts created:')
  console.log('  Admin:     admin@curioai.com     / Admin@123456')
  console.log('  Moderator: moderator@curioai.com / Moderator@123456')
  console.log('  Author:    author@curioai.com    / Author@123456')
  console.log('  User:      user@curioai.com      / User@123456')

  db.close()
}

main().catch(console.error)
