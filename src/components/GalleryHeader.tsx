'use client'

import { motion } from 'framer-motion'

export default function GalleryHeader() {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="text-center mb-16"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-[#e0f7fa] mb-4">Our Impact Through the Years</h1>
      <p className="text-[#38b6c4] text-lg max-w-2xl mx-auto">
        For more than a decade, we&apos;ve been proud to support our community in meaningful ways.
        Every photo tells a story of compassion, dignity, and community coming together.
      </p>
    </motion.div>
  )
}
