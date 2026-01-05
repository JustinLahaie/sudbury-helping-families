'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Users, ImageIcon, Calendar, Heart, Mail, Facebook } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About Us', icon: Users },
  { href: '/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/donate', label: 'Donate', icon: Heart },
  { href: '/contact', label: 'Contact', icon: Mail },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide navigation on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-[#1a2e2e]/90 backdrop-blur-md border-b border-[#38b6c4]/20 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-full" />
          <span className="text-sm font-semibold text-[#e0f7fa]">SAHFIN</span>
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-[#38b6c4] hover:text-[#f5a623] transition-colors"
          aria-label="Open menu"
        >
          <Menu size={28} />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-72 bg-[#1a2e2e] border-r border-[#38b6c4]/20 z-50 flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#38b6c4]/20">
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                <Image src="/logo.jpg" alt="Logo" width={48} height={48} className="rounded-full" />
                <div>
                  <p className="font-bold text-[#e0f7fa]">Sudbury & Area</p>
                  <p className="text-xs text-[#38b6c4]">Helping Families in Need</p>
                </div>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-[#38b6c4] hover:text-[#f5a623] transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#e0f7fa] hover:bg-[#38b6c4]/10 hover:text-[#38b6c4] transition-all group"
                    >
                      <item.icon size={20} className="text-[#38b6c4] group-hover:text-[#f5a623] transition-colors" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t border-[#38b6c4]/20">
              <a
                href="https://www.facebook.com/share/14R9XcKSaaW/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#e0f7fa] hover:bg-[#38b6c4]/10 transition-all"
              >
                <Facebook size={20} className="text-[#38b6c4]" />
                <span>Follow us on Facebook</span>
              </a>
              <p className="mt-4 text-xs text-center text-[#38b6c4]/60">
                Est. 2012 - Fuelled by Kindness
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 bg-[#1a2e2e] border-r border-[#38b6c4]/20 flex-col z-40">
        <div className="p-6 border-b border-[#38b6c4]/20">
          <Link href="/" className="flex flex-col items-center gap-3">
            <Image src="/logo.jpg" alt="Logo" width={80} height={80} className="rounded-full" />
            <div className="text-center">
              <p className="font-bold text-[#e0f7fa]">Sudbury & Area</p>
              <p className="text-sm text-[#38b6c4]">Helping Families in Need</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#e0f7fa] hover:bg-[#38b6c4]/10 hover:text-[#38b6c4] transition-all group"
                >
                  <item.icon size={20} className="text-[#38b6c4] group-hover:text-[#f5a623] transition-colors" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-[#38b6c4]/20">
          <a
            href="https://www.facebook.com/share/14R9XcKSaaW/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#38b6c4]/10 text-[#38b6c4] hover:bg-[#38b6c4]/20 transition-all"
          >
            <Facebook size={18} />
            <span className="text-sm">Facebook</span>
          </a>
          <p className="mt-4 text-xs text-center text-[#38b6c4]/60">
            Est. 2012<br />Fuelled by Kindness
          </p>
        </div>
      </aside>
    </>
  );
}
