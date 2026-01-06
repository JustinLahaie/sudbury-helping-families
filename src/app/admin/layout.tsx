import { headers } from 'next/headers'
import AdminLayoutClient from '@/components/admin/AdminLayoutClient'

// Force dynamic rendering to ensure session is always checked
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin - SAHFIN',
  description: 'Admin dashboard for Sudbury and Area Helping Families in Need',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isLoginPage = pathname.includes('/admin/login')

  // Don't show sidebar on login page
  if (isLoginPage) {
    return <>{children}</>
  }

  // Always show admin layout (session check handled by middleware)
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
