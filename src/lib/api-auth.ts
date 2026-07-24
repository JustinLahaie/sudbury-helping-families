import { cookies } from 'next/headers'
import { decode } from '@auth/core/jwt'

/**
 * Get the session in API Route Handlers.
 * Works around next-auth v5 beta auth() returning null in Next.js 16 Route Handlers.
 *
 * NextAuth splits large JWTs across cookies named `<base>.0`, `<base>.1`, ...
 * so we must reassemble those chunks before decoding. On HTTPS the base name
 * is `__Secure-authjs.session-token`; on HTTP it's `authjs.session-token`.
 */
export async function getApiSession() {
  const cookieStore = await cookies()

  const candidateBases = [
    '__Secure-authjs.session-token',
    'authjs.session-token',
  ]

  for (const base of candidateBases) {
    const token = readCookieValue(cookieStore, base)
    if (!token) continue

    try {
      const decoded = await decode({
        token,
        secret: process.env.AUTH_SECRET!,
        salt: base,
      })
      if (decoded) return decoded
    } catch (error) {
      console.error(`[api-auth] Failed to decode session cookie "${base}":`, error)
    }
  }

  return null
}

type CookieStore = Awaited<ReturnType<typeof cookies>>

function readCookieValue(store: CookieStore, base: string): string | null {
  const single = store.get(base)?.value
  if (single) return single

  const chunks: string[] = []
  for (let i = 0; i < 20; i++) {
    const part = store.get(`${base}.${i}`)?.value
    if (!part) break
    chunks.push(part)
  }
  return chunks.length > 0 ? chunks.join('') : null
}
