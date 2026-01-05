import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Sudbury & Area Helping Families in Need - a grassroots charity founded in 2012 by Mike Bellerose. Discover our mission, services, and community partners.',
  openGraph: {
    title: 'About Us | Sudbury Helping Families',
    description: 'A grassroots charity founded in 2012, helping over 200 families in the Sudbury area through food assistance, youth programs, and community support.',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
