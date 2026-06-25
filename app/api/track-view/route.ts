import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createHash } from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { postId } = await req.json()
    if (!postId || typeof postId !== 'string') {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    // Hash IP for privacy — never store raw IPs
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'
    const ipHash = createHash('sha256')
      .update(ip + (process.env.NEXTAUTH_SECRET || 'salt'))
      .digest('hex')
    const userAgent = req.headers.get('user-agent')

    // Deduplicate: one view per IP per post per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentView = await db.pageView.findFirst({
      where: { post_id: postId, ip_hash: ipHash, created_at: { gt: oneHourAgo } },
      select: { id: true },
    })

    if (recentView) {
      return NextResponse.json({ ok: true, counted: false })
    }

    await db.pageView.create({
      data: { post_id: postId, ip_hash: ipHash, user_agent: userAgent },
    })
    await db.post.update({
      where: { id: postId },
      data: { views_count: { increment: 1 } },
    })

    return NextResponse.json({ ok: true, counted: true })
  } catch (err: any) {
    console.error('track-view error:', err.message)
    return NextResponse.json({ ok: false })
  }
}
