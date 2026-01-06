'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface TimelineItem {
  id: string
  year: string
  title: string
  description: string
  imageUrl: string | null
  order: number
}

interface TimelineDisplayProps {
  items: TimelineItem[]
}

export default function TimelineDisplay({ items }: TimelineDisplayProps) {
  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#38b6c4] via-[#f5a623] to-[#38b6c4]" />

      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`relative flex items-center mb-16 ${
            index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
          }`}
        >
          {/* Timeline Dot */}
          <div className="absolute left-4 md:left-1/2 w-4 h-4 -ml-2 rounded-full bg-[#f5a623] border-4 border-[#1a2e2e] z-10" />

          {/* Content */}
          <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#38b6c4]/20 to-[#f5a623]/20">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center px-4">
                      <p className="text-[#38b6c4]/60 text-sm">Photo Coming Soon</p>
                      <p className="text-[#e0f7fa]/40 text-xs mt-1">Gallery images will be added</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <span className="inline-block px-3 py-1 rounded-full bg-[#f5a623]/20 text-[#f5a623] text-sm font-semibold mb-3">
                  {item.year}
                </span>
                <h3 className="text-xl font-bold text-[#e0f7fa] mb-2">{item.title}</h3>
                <p className="text-[#e0f7fa]/70">{item.description}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
