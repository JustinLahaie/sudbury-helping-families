import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { authConfig } from './auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('[AUTH] authorize called with email:', credentials?.email)

        if (!credentials?.email || !credentials?.password) {
          console.log('[AUTH] Missing credentials')
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          })

          console.log('[AUTH] User found:', user ? 'yes' : 'no')

          if (!user) return null

          const passwordMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          console.log('[AUTH] Password match:', passwordMatch)

          if (!passwordMatch) return null

          return { id: user.id, email: user.email, name: user.name }
        } catch (error) {
          console.error('[AUTH] Error in authorize:', error)
          return null
        }
      },
    }),
  ],
})
