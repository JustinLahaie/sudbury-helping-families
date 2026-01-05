import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming and past events from Sudbury & Area Helping Families in Need. Join us for youth dances, community drives, and fundraising events.',
  openGraph: {
    title: 'Events | Sudbury Helping Families',
    description: 'Join us at upcoming community events including youth dances in Valley East, family support drives, and fundraising activities.',
  },
}

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
