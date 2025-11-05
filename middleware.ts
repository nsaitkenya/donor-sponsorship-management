import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Middleware disabled for v0 preview environment
  // In production, enable Supabase session management here
  return
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
