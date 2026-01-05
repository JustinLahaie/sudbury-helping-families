'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Facebook, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#152424] border-t border-[#38b6c4]/20 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-[#e0f7fa] mb-4">Sudbury & Area Helping Families</h3>
            <p className="text-[#38b6c4]/80 text-sm leading-relaxed">
              A community-driven grassroots charity supporting local families and individuals during times of hardship since 2012.
            </p>
            <p className="mt-4 text-[#f5a623] text-sm font-medium">
              Fuelled by Kindness. Powered by Community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-[#e0f7fa] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/events', label: 'Events' },
                { href: '/donate', label: 'Donate' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#38b6c4]/80 hover:text-[#38b6c4] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-[#e0f7fa] mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-[#38b6c4]/80">
                <Mail size={16} className="text-[#38b6c4]" />
                <a href="mailto:sudburyhelpingfamilies@hotmail.com" className="hover:text-[#38b6c4] transition-colors">
                  sudburyhelpingfamilies@hotmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#38b6c4]/80">
                <Phone size={16} className="text-[#38b6c4]" />
                <a href="tel:705-207-4170" className="hover:text-[#38b6c4] transition-colors">
                  705-207-4170
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#38b6c4]/80">
                <MapPin size={16} className="text-[#38b6c4]" />
                <span>Sudbury & surrounding communities</span>
              </li>
              <li className="mt-4">
                <a
                  href="https://www.facebook.com/share/14R9XcKSaaW/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#38b6c4]/10 text-[#38b6c4] hover:bg-[#38b6c4]/20 transition-all text-sm"
                >
                  <Facebook size={16} />
                  Follow on Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#38b6c4]/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#38b6c4]/60">
            © {new Date().getFullYear()} Sudbury and Area Helping Families in Need. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-[#38b6c4]/60">
            Made with <Heart size={12} className="text-[#f5a623]" /> in Sudbury
          </p>
        </div>
      </div>
    </footer>
  );
}
