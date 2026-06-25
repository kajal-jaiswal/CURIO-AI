'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

function requireAdmin(session: any) {
  if (!session?.user || session.user.role !== 'admin') throw new Error('Admin only')
  return session.user
}

export async function createAd(data: {
  title: string
  description?: string
  image_url?: string
  link_url: string
  position: string
  is_active: boolean
  start_date?: string | null
  end_date?: string | null
}) {
  const session = await getServerSession(authOptions)
  requireAdmin(session)

  await db.advertisement.create({
    data: {
      title: data.title,
      description: data.description ?? '',
      image_url: data.image_url ?? null,
      link_url: data.link_url,
      position: data.position,
      is_active: data.is_active,
      start_date: data.start_date ? new Date(data.start_date) : null,
      end_date: data.end_date ? new Date(data.end_date) : null,
    },
  })

  revalidatePath('/admin/ads')
  return { success: true }
}

export async function updateAd(
  adId: string,
  data: {
    title: string
    description?: string
    image_url?: string
    link_url: string
    position: string
    is_active: boolean
    start_date?: string | null
    end_date?: string | null
  }
) {
  const session = await getServerSession(authOptions)
  requireAdmin(session)

  await db.advertisement.update({
    where: { id: adId },
    data: {
      title: data.title,
      description: data.description ?? '',
      image_url: data.image_url ?? null,
      link_url: data.link_url,
      position: data.position,
      is_active: data.is_active,
      start_date: data.start_date ? new Date(data.start_date) : null,
      end_date: data.end_date ? new Date(data.end_date) : null,
    },
  })

  revalidatePath('/admin/ads')
  return { success: true }
}

export async function deleteAd(adId: string) {
  const session = await getServerSession(authOptions)
  requireAdmin(session)

  await db.advertisement.delete({ where: { id: adId } })

  revalidatePath('/admin/ads')
  return { success: true }
}
