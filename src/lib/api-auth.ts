import { cookies } from 'next/headers'
import { decode } from '@auth/core/jwt'

/**
 * Get the session in API Route Handlers.
 * Works around next-auth v5 beta auth() returning null in Next.js 16 Route Handlers.
 */
export async function getApiSession() {
  const cookieStore = await cookies()

  // Try both secure (HTTPS/production) and non-secure (HTTP/dev) cookie names
  const token =
    cookieStore.get('__Secure-authjs.session-token')?.value ||
    cookieStore.get('authjs.session-token')?.value

  if (!token) return null

  try {
    const salt =
      cookieStore.get('__Secure-authjs.session-token')?.value
        ? '__Secure-authjs.session-token'
        : 'authjs.session-token'

    const decoded = await decode({
      token,
      secret: process.env.AUTH_SECRET!,
      salt,
    })
    return decoded
  } catch {
    return null
  }
}
