'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, Image, Settings, LogOut, ExternalLink, Heart, Menu, X } from 'lucide-react'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/timeline', label: 'Timeline/Gallery', icon: Image },
  { href: '/admin/donations', label: 'Donation Impacts', icon: Heart },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
]

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="min-h-screen bg-[#1a2e2e]">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#152424] border-b border-[#38b6c4]/20 flex items-center justify-between px-4 z-40">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-[#e0f7fa] hover:bg-[#38b6c4]/10 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold text-[#e0f7fa]">Admin Panel</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-[#152424] border-r border-[#38b6c4]/20 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#38b6c4]/20 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#e0f7fa]">Admin Panel</h1>
            <p className="text-sm text-[#38b6c4]">SAHFIN Management</p>
          </div>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-2 text-[#e0f7fa] hover:bg-[#38b6c4]/10 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
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
            onClick={closeSidebar}
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

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}
