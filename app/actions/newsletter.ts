'use server'

import { db } from '@/lib/db'

export async function subscribeNewsletter(email: string) {
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Please enter a valid email address' }
  }

  try {
    await db.newsletter.create({
      data: { email: email.trim().toLowerCase() },
    })
    return { success: true }
  } catch (err: any) {
    // Unique constraint violation — already subscribed
    if (err?.code === 'P2002') {
      return { success: false, error: 'This email is already subscribed' }
    }
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
