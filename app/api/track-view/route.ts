import { NextRequest, NextResponse } from 'next/server'
import { incrementPostViews } from '@/lib/queries'

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json()
    
    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || null
    const ipHash = Buffer.from(ip).toString('base64').slice(0, 20)

    await incrementPostViews(postId, ipHash, userAgent)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 })
  }
}
