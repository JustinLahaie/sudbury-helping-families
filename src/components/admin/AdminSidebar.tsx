'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, Image, Settings, LogOut, ExternalLink, Heart } from 'lucide-react'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/timeline', label: 'Timeline/Gallery', icon: Image },
  { href: '/admin/donations', label: 'Donation Impacts', icon: Heart },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#152424] border-r border-[#38b6c4]/20 flex flex-col z-50">
      {/* Header */}
      <div className="p-6 border-b border-[#38b6c4]/20">
        <h1 className="text-xl font-bold text-[#e0f7fa]">Admin Panel</h1>
        <p className="text-sm text-[#38b6c4]">SAHFIN Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                isActive
                  ? 'bg-[#38b6c4]/20 text-[#38b6c4]'
                  : 'text-[#e0f7fa]/70 hover:bg-[#38b6c4]/10 hover:text-[#e0f7fa]'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#38b6c4]/20 space-y-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#38b6c4] text-sm hover:text-[#f5a623] transition-colors"
        >
          <ExternalLink size={16} />
          <span>View Site</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-2 text-[#e0f7fa]/70 hover:text-[#f5a623] transition-colors w-full"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
