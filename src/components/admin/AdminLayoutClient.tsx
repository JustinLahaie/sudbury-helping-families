'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, Image, Settings, LogOut, ExternalLink, Heart, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/timeline', label: 'Timeline/Gallery', icon: Image },
  { href: '/admin/donations', label: 'Donation Impacts', icon: Heart },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
]

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed')
    if (saved !== null) {
      setCollapsed(JSON.parse(saved))
    }
  }, [])

  // Save collapsed state to localStorage
  const toggleCollapsed = () => {
    const newState = !collapsed
    setCollapsed(newState)
    localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(newState))
  }

  const closeMobile = () => setMobileOpen(false)

  return (
    <div className="min-h-screen bg-[#1a2e2e]">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#152424] border-b border-[#38b6c4]/20 flex items-center justify-between px-4 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-[#e0f7fa] hover:bg-[#38b6c4]/10 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold text-[#e0f7fa]">Admin Panel</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-[#152424] border-r border-[#38b6c4]/20 flex flex-col z-50 transform transition-all duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${collapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}
      >
        {/* Header */}
        <div className={`p-6 border-b border-[#38b6c4]/20 flex items-center ${collapsed ? 'lg:justify-center lg:p-4' : 'justify-between'}`}>
          <div className={collapsed ? 'lg:hidden' : ''}>
            <h1 className="text-xl font-bold text-[#e0f7fa]">Admin Panel</h1>
            <p className="text-sm text-[#38b6c4]">SAHFIN Management</p>
          </div>
          {/* Mobile close button */}
          <button
            onClick={closeMobile}
            className="lg:hidden p-2 text-[#e0f7fa] hover:bg-[#38b6c4]/10 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
          {/* Desktop collapse toggle */}
          <button
            onClick={toggleCollapsed}
            className="hidden lg:flex p-2 text-[#e0f7fa] hover:bg-[#38b6c4]/10 rounded-lg transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto ${collapsed ? 'lg:p-2' : 'p-4'}`}>
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-lg mb-2 transition-all ${
                  collapsed ? 'lg:justify-center lg:px-2 lg:py-3 px-4 py-3' : 'px-4 py-3'
                } ${
                  isActive
                    ? 'bg-[#38b6c4]/20 text-[#38b6c4]'
                    : 'text-[#e0f7fa]/70 hover:bg-[#38b6c4]/10 hover:text-[#e0f7fa]'
                }`}
              >
                <item.icon size={20} className="flex-shrink-0" />
                <span className={collapsed ? 'lg:hidden' : ''}>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className={`border-t border-[#38b6c4]/20 space-y-3 ${collapsed ? 'lg:p-2' : 'p-4'}`}>
          <Link
            href="/"
            onClick={closeMobile}
            title={collapsed ? 'View Site' : undefined}
            className={`flex items-center gap-2 text-[#38b6c4] text-sm hover:text-[#f5a623] transition-colors ${
              collapsed ? 'lg:justify-center lg:py-2' : ''
            }`}
          >
            <ExternalLink size={16} className="flex-shrink-0" />
            <span className={collapsed ? 'lg:hidden' : ''}>View Site</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            title={collapsed ? 'Sign Out' : undefined}
            className={`flex items-center gap-2 text-[#e0f7fa]/70 hover:text-[#f5a623] transition-colors w-full ${
              collapsed ? 'lg:justify-center lg:py-2' : ''
            }`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className={collapsed ? 'lg:hidden' : ''}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8 min-h-screen transition-all duration-300 ease-in-out ${
        collapsed ? 'lg:ml-20' : 'lg:ml-64'
      }`}>
        {children}
      </main>
    </div>
  )
}
