import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import TimelineDisplay from '@/components/TimelineDisplay'
import GalleryHeader from '@/components/GalleryHeader'

export const metadata: Metadata = {
  title: 'Gallery & Timeline',
  description: 'Explore our journey through the years. See photos and stories from over a decade of helping families in the Sudbury area since 2012.',
  openGraph: {
    title: 'Gallery & Timeline | Sudbury Helping Families',
    description: 'Explore our journey through the years. See photos and stories from over a decade of helping families in the Sudbury area.',
  },
}

export default async function GalleryPage() {
  const timelineItems = await prisma.timelineSlide.findMany({
    orderBy: { order: 'asc' },
  })

  return (
    <div className="flex-1 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <GalleryHeader />

        {timelineItems.length > 0 ? (
          <TimelineDisplay items={timelineItems} />
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-[#e0f7fa]/70">
              Timeline coming soon! Check back for updates on our journey.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="glass-card p-8 text-center mt-12">
          <h2 className="text-2xl font-bold text-[#e0f7fa] mb-4">Have We Made an Impact on Your Family?</h2>
          <p className="text-[#e0f7fa]/70 mb-6">
            We&apos;d love to hear your story. Share your experience with us!
          </p>
          <a
            href="/contact"
            className="btn-primary inline-block"
          >
            Share Your Story
          </a>
        </div>
      </div>
    </div>
  )
}
