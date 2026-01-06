import { prisma } from '@/lib/prisma'
import DonationImpactManager from '@/components/admin/DonationImpactManager'

export default async function DonationsPage() {
  const impacts = await prisma.donationImpact.findMany({
    orderBy: { order: 'asc' },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#e0f7fa]">Donation Impacts</h1>
        <p className="text-[#38b6c4] mt-1">
          Manage the &quot;What Your Donation Provides&quot; section on the donate page
        </p>
      </div>

      <DonationImpactManager initialImpacts={impacts} />
    </div>
  )
}
