import { prisma } from '@/lib/prisma'
import SponsorManager from '@/components/admin/SponsorManager'

export default async function AdminSponsorsPage() {
  const sponsors = await prisma.partner.findMany({
    orderBy: { order: 'asc' },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#e0f7fa]">Community Sponsors</h1>
        <p className="text-[#38b6c4] mt-2">
          Manage your community partners and sponsors. Drag to reorder.
        </p>
      </div>

      <SponsorManager initialSponsors={sponsors} />
    </div>
  )
}
