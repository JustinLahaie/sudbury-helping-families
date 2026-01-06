'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface DeleteTimelineButtonProps {
  slideId: string
  slideTitle: string
}

export default function DeleteTimelineButton({ slideId, slideTitle }: DeleteTimelineButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${slideTitle}"?`)) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/admin/timeline/${slideId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete slide')
      }

      toast.success('Slide deleted')
      router.refresh()
    } catch {
      toast.error('Failed to delete slide')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-50"
      title="Delete"
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  )
}
