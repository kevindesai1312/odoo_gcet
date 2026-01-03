import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const next = searchParams.get('next') ?? '/dashboard'

  // Redirect to dashboard (callback is no longer needed with JWT auth)
  return NextResponse.redirect(`${origin}${next}`)

  return NextResponse.redirect(`${origin}/auth/signin?error=Could not authenticate`)
}
