import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const ad = await db.advertisement.findUnique({ where: { id: params.id } })

  if (!ad) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...ad,
    created_at: ad.created_at.toISOString(),
    start_date: ad.start_date?.toISOString() ?? null,
    end_date: ad.end_date?.toISOString() ?? null,
  })
}
