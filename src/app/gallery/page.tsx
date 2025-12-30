'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const timelineItems = [
  {
    year: '2024',
    title: 'Continuing Our Mission',
    description: 'Another year of supporting families and spreading kindness throughout Sudbury.',
    image: '/gallery/img1.jpg',
  },
  {
    year: '2023',
    title: 'Holiday Support',
    description: 'Providing Christmas joy to families in need during the holiday season.',
    image: '/gallery/img2.jpg',
  },
  {
    year: '2022',
    title: 'Community Events',
    description: 'Bringing back youth dances and community gatherings in Valley East.',
    image: '/gallery/img3.jpg',
  },
  {
    year: '2021',
    title: 'Pandemic Support',
    description: 'Stepping up during challenging times to help families affected by COVID-19.',
    image: '/gallery/img4.jpg',
  },
  {
    year: '2020',
    title: 'Emergency Relief',
    description: 'Rapid response to community needs during unprecedented times.',
    image: '/gallery/img5.jpg',
  },
  {
    year: '2018',
    title: 'Youth Sports Sponsorship',
    description: 'Supporting local hockey teams so every child can play.',
    image: '/gallery/img6.jpg',
  },
  {
    year: '2015',
    title: 'Growing Our Reach',
    description: 'Expanding our services to more families across the Sudbury region.',
    image: '/gallery/img7.jpg',
  },
  {
    year: '2012',
    title: 'Our Beginning',
    description: 'Founded with a simple mission: help families in need.',
    image: '/gallery/img8.jpg',
  },
];

export default function GalleryPage() {
  return (
    <div className="flex-1 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#38b6c4] via-[#f5a623] to-[#38b6c4]" />

          {timelineItems.map((item, index) => (
            <motion.div
              key={item.year}
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
                  {/* Image Placeholder */}
                  <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#38b6c4]/20 to-[#f5a623]/20 flex items-center justify-center">
                    <div className="text-center px-4">
                      <p className="text-[#38b6c4]/60 text-sm">Photo Coming Soon</p>
                      <p className="text-[#e0f7fa]/40 text-xs mt-1">Gallery images will be added</p>
                    </div>
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

        {/* Call to Action */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="glass-card p-8 text-center mt-12"
        >
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
        </motion.div>
      </div>
    </div>
  );
}
