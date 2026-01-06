'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from './ImageUpload'

interface TimelineFormProps {
  slide?: {
    id: string
    year: string
    title: string
    description: string
    imageUrl: string | null
    order: number
  }
}

export default function TimelineForm({ slide }: TimelineFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    year: slide?.year || '',
    title: slide?.title || '',
    description: slide?.description || '',
    imageUrl: slide?.imageUrl || null as string | null,
    order: slide?.order ?? 0,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }))
  }

  const handleImageChange = (url: string | null) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: url,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = slide ? `/api/admin/timeline/${slide.id}` : '/api/admin/timeline'
      const method = slide ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Failed to save timeline slide')
      }

      toast.success(slide ? 'Slide updated!' : 'Slide created!')
      router.push('/admin/timeline')
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
      {/* Year */}
      <div>
        <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
          Year *
        </label>
        <input
          type="text"
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="e.g., 2024 or 2012-2015"
          className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-4 py-3 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
          required
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
          Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., First Community Event"
          className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-4 py-3 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Tell the story of this moment in your timeline..."
          className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-4 py-3 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4] resize-none"
          required
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
          Image
        </label>
        <ImageUpload
          value={formData.imageUrl}
          onChange={handleImageChange}
          disabled={loading}
        />
      </div>

      {/* Order (for editing) */}
      {slide && (
        <div>
          <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
            Display Order
          </label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min={0}
            className="w-32 bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-4 py-3 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
          />
          <p className="text-[#38b6c4]/70 text-sm mt-1">
            Lower numbers appear first
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {slide ? 'Update Slide' : 'Create Slide'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-lg border border-[#38b6c4]/30 text-[#e0f7fa] hover:bg-[#38b6c4]/10 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
