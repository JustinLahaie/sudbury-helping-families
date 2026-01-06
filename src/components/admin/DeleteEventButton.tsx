'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface DeleteEventButtonProps {
  eventId: string
  eventTitle: string
}

export default function DeleteEventButton({ eventId, eventTitle }: DeleteEventButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete event')
      }

      toast.success('Event deleted')
      router.refresh()
    } catch {
      toast.error('Failed to delete event')
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
