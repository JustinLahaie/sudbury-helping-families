'use client';

import { usePathname } from 'next/navigation';

export default function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <main className={`${isAdmin ? '' : 'lg:ml-64 pt-16 lg:pt-0'} min-h-screen flex flex-col`}>
      {children}
    </main>
  );
}
