'use server'

import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function signUpAction(data: {
  fullName: string
  email: string
  password: string
  role: 'user' | 'author'
}) {
  if (!data.email || !data.password || !data.fullName) {
    return { success: false, error: 'All fields are required' }
  }

  if (data.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' }
  }

  try {
    const existing = await db.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    })

    if (existing) {
      return { success: false, error: 'An account with this email already exists' }
    }

    const password_hash = await bcrypt.hash(data.password, 12)

    await db.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        password_hash,
        full_name: data.fullName.trim(),
        role: data.role,
      },
    })

    return { success: true }
  } catch {
    return { success: false, error: 'Failed to create account. Please try again.' }
  }
}
