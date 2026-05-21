import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_PATHS = ['/login', '/offline', '/manifest.webmanifest', '/icon.svg', '/sw.js']
const isPublic = (p: string) =>
  PUBLIC_PATHS.includes(p) ||
  p.startsWith('/_next') ||
  p.startsWith('/icon-') ||
  p.startsWith('/apple-icon')

export async function middleware(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase isn't configured yet, run the app in demo (unauthenticated) mode
  // so the build and a fresh deploy still work without env vars.
  if (!url || !key) return NextResponse.next()

  const res = NextResponse.next()
  const supabase = createServerClient(url, key, {
    cookies: {
      get(name: string) { return req.cookies.get(name)?.value },
      set(name: string, value: string, options: any) { res.cookies.set({ name, value, ...options }) },
      remove(name: string, options: any) { res.cookies.set({ name, value: '', ...options }) },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  const path = req.nextUrl.pathname

  if (!user && !isPublic(path)) {
    const redirect = req.nextUrl.clone()
    redirect.pathname = '/login'
    redirect.searchParams.set('next', path)
    return NextResponse.redirect(redirect)
  }
  if (user && path === '/login') {
    const redirect = req.nextUrl.clone()
    redirect.pathname = '/'
    return NextResponse.redirect(redirect)
  }
  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
