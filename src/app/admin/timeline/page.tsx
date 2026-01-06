import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, ImageIcon, Pencil } from 'lucide-react'
import DeleteTimelineButton from '@/components/admin/DeleteTimelineButton'

export default async function TimelinePage() {
  const slides = await prisma.timelineSlide.findMany({
    orderBy: { order: 'asc' },
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#e0f7fa]">Timeline / Gallery</h1>
          <p className="text-[#38b6c4] mt-1">Manage your timeline slides</p>
        </div>
        <Link href="/admin/timeline/new" className="btn-accent flex items-center justify-center gap-2 w-full sm:w-auto">
          <Plus size={18} />
          Add Slide
        </Link>
      </div>

      {slides.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <ImageIcon size={48} className="mx-auto text-[#38b6c4]/50 mb-4" />
          <p className="text-[#e0f7fa]/70 mb-4">No timeline slides yet</p>
          <Link href="/admin/timeline/new" className="btn-primary">
            Create your first slide
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4">
            {slides.map((slide) => (
              <div key={slide.id} className="glass-card p-4">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    {slide.imageUrl ? (
                      <div className="relative w-20 h-16 rounded overflow-hidden">
                        <Image
                          src={slide.imageUrl}
                          alt={slide.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-16 rounded bg-[#1a2e2e] flex items-center justify-center">
                        <ImageIcon size={24} className="text-[#38b6c4]/30" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[#e0f7fa] font-medium truncate">{slide.title}</p>
                        <p className="text-[#38b6c4]/70 text-sm line-clamp-1">
                          {slide.description}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Link
                          href={`/admin/timeline/${slide.id}`}
                          className="p-2 rounded-lg hover:bg-[#38b6c4]/20 text-[#38b6c4] transition-colors"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </Link>
                        <DeleteTimelineButton slideId={slide.id} slideTitle={slide.title} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded text-xs bg-[#f5a623]/20 text-[#f5a623] font-medium">
                        {slide.year}
                      </span>
                      <span className="text-[#e0f7fa]/50 text-xs">
                        Order: {slide.order}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#38b6c4]/20">
                    <th className="text-left p-4 text-[#38b6c4] font-medium">Image</th>
                    <th className="text-left p-4 text-[#38b6c4] font-medium">Year</th>
                    <th className="text-left p-4 text-[#38b6c4] font-medium">Title</th>
                    <th className="text-left p-4 text-[#38b6c4] font-medium">Order</th>
                    <th className="text-right p-4 text-[#38b6c4] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slides.map((slide) => (
                    <tr
                      key={slide.id}
                      className="border-b border-[#38b6c4]/10 hover:bg-[#38b6c4]/5 transition-colors"
                    >
                      <td className="p-4">
                        {slide.imageUrl ? (
                          <div className="relative w-16 h-12 rounded overflow-hidden">
                            <Image
                              src={slide.imageUrl}
                              alt={slide.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-12 rounded bg-[#1a2e2e] flex items-center justify-center">
                            <ImageIcon size={20} className="text-[#38b6c4]/30" />
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded text-xs bg-[#f5a623]/20 text-[#f5a623] font-medium">
                          {slide.year}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-[#e0f7fa] font-medium">{slide.title}</p>
                        <p className="text-[#38b6c4]/70 text-sm line-clamp-1">
                          {slide.description}
                        </p>
                      </td>
                      <td className="p-4 text-[#e0f7fa]/70">
                        {slide.order}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/timeline/${slide.id}`}
                            className="p-2 rounded-lg hover:bg-[#38b6c4]/20 text-[#38b6c4] transition-colors"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </Link>
                          <DeleteTimelineButton slideId={slide.id} slideTitle={slide.title} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
