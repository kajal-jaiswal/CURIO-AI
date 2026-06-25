import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password || password.length < 8) {
      return NextResponse.json({ error: 'Token and password (min 8 chars) required' }, { status: 400 })
    }

    const user = await db.user.findFirst({
      where: {
        reset_token: token,
        reset_token_expires: { gt: new Date() },
        is_active: true,
      },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Reset link is invalid or has expired' }, { status: 400 })
    }

    const hash = await bcrypt.hash(password, 12)

    await db.user.update({
      where: { id: user.id },
      data: {
        password_hash: hash,
        reset_token: null,
        reset_token_expires: null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
