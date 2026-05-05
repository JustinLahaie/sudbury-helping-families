'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface EventGalleryProps {
  images: { id: string; url: string }[]
  alt: string
}

export default function EventGallery({ images, alt }: EventGalleryProps) {
  const [index, setIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const total = images.length
  if (total === 0) return null

  const goTo = (next: number) => {
    const wrapped = ((next % total) + total) % total
    setIndex(wrapped)
  }

  useEffect(() => {
    const node = trackRef.current
    if (!node) return
    const child = node.children[index] as HTMLElement | undefined
    if (child) {
      node.scrollTo({ left: child.offsetLeft, behavior: 'smooth' })
    }
  }, [index])

  useEffect(() => {
    const node = trackRef.current
    if (!node) return
    let timeout: ReturnType<typeof setTimeout> | null = null
    const onScroll = () => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        const width = node.clientWidth
        if (width > 0) {
          const next = Math.round(node.scrollLeft / width)
          if (next !== index && next >= 0 && next < total) {
            setIndex(next)
          }
        }
      }, 120)
    }
    node.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      node.removeEventListener('scroll', onScroll)
      if (timeout) clearTimeout(timeout)
    }
  }, [index, total])

  return (
    <div className="relative w-full bg-black/20">
      <div
        ref={trackRef}
        className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {images.map((img, i) => (
          <div
            key={img.id}
            className="relative flex-shrink-0 w-full snap-center"
            style={{ width: '100%' }}
          >
            <div className="relative w-full h-72 md:h-96">
              <Image
                src={img.url}
                alt={`${alt} - photo ${i + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
                priority={i === 0}
              />
            </div>
          </div>
        ))}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#1a2e2e]/70 text-[#e0f7fa] hover:bg-[#38b6c4] hover:text-[#1a2e2e] transition-colors backdrop-blur"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#1a2e2e]/70 text-[#e0f7fa] hover:bg-[#38b6c4] hover:text-[#1a2e2e] transition-colors backdrop-blur"
          >
            <ChevronRight size={22} />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to photo ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-6 bg-[#f5a623]' : 'w-2 bg-[#e0f7fa]/50 hover:bg-[#e0f7fa]/80'
                }`}
              />
            ))}
          </div>

          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#1a2e2e]/70 text-[#e0f7fa] text-xs backdrop-blur">
            {index + 1} / {total}
          </div>
        </>
      )}
    </div>
  )
}
