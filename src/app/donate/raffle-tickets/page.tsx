import { Metadata } from 'next'
import RaffleTicketsClient from './RaffleTicketsClient'

export const metadata: Metadata = {
  title: 'Raffle Tickets | Sudbury Helping Families',
  description: 'Purchase raffle tickets to support families in need. Win amazing prizes while helping the Sudbury community.',
}

export default function RaffleTicketsPage() {
  return <RaffleTicketsClient />
}
