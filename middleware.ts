import { getToken } from 'next-auth/jwt'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = request.nextUrl

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    if (pathname.startsWith('/admin')) {
      loginUrl.pathname = '/admin/login'
    }
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith('/admin') && token.role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (
    pathname.startsWith('/author') &&
    token.role !== 'author' &&
    token.role !== 'admin'
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (
    pathname.startsWith('/moderator') &&
    token.role !== 'moderator' &&
    token.role !== 'admin'
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/author/:path*', '/moderator/:path*', '/profile/:path*', '/bookmarks/:path*'],
}
