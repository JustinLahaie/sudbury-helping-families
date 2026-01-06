import { prisma } from '@/lib/prisma'
import DonateClient from './DonateClient'

const defaultImpacts = [
  {
    id: 'default-1',
    amount: '$25',
    icon: 'Pizza',
    title: 'Meals for a Family',
    description: 'Provides nutritious meals for a family in need.',
    order: 0,
  },
  {
    id: 'default-2',
    amount: '$50',
    icon: 'ShoppingBag',
    title: 'Essential Supplies',
    description: 'Covers essential household items and toiletries.',
    order: 1,
  },
  {
    id: 'default-3',
    amount: '$100',
    icon: 'Backpack',
    title: 'Back to School',
    description: 'Supplies a child with school supplies and clothing.',
    order: 2,
  },
  {
    id: 'default-4',
    amount: '$200+',
    icon: 'Gift',
    title: 'Family Support',
    description: 'Comprehensive support during times of crisis.',
    order: 3,
  },
]

export default async function DonatePage() {
  const dbImpacts = await prisma.donationImpact.findMany({
    orderBy: { order: 'asc' },
  })

  // Use database impacts if available, otherwise use defaults
  const impacts = dbImpacts.length > 0 ? dbImpacts : defaultImpacts

  return <DonateClient impacts={impacts} />
}
