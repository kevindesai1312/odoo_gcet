import { type NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export async function middleware(request: NextRequest) {
  const publicPaths = ['/', '/auth/signin', '/auth/signup', '/auth/callback']
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname)
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')

  // Get token from cookies
  const token = request.cookies.get('auth-token')?.value

  // If no token and not a public path, redirect to signin
  if (!token && !isPublicPath && !isApiRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/signin'
    return NextResponse.redirect(url)
  }

  // If token exists, verify it
  if (token) {
    try {
      await jwtVerify(token, secret)
      
      // If user is authenticated and trying to access signin/signup, redirect to dashboard
      if (request.nextUrl.pathname === '/auth/signin' || request.nextUrl.pathname === '/auth/signup') {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    } catch (error) {
      // Invalid token, clear it and redirect to signin
      const response = NextResponse.next()
      response.cookies.delete('auth-token')
      if (!isPublicPath && !isApiRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/signin'
        return NextResponse.redirect(url)
      }
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
