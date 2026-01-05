import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Donate',
  description: 'Support families in need in the Sudbury area. Your donation helps provide meals, essential supplies, and youth programs. 100% community-funded charity.',
  openGraph: {
    title: 'Donate | Sudbury Helping Families',
    description: 'Support families in need in the Sudbury area. Every donation makes a difference - $25 provides meals, $50 covers essentials, $100 helps with back-to-school.',
  },
}

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
