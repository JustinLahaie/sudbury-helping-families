'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface DeleteRaffleButtonProps {
  raffleId: string
  raffleTitle: string
}

export default function DeleteRaffleButton({ raffleId, raffleTitle }: DeleteRaffleButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${raffleTitle}"? This will also delete all entries.`)) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/raffles/${raffleId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete raffle')
      }

      toast.success('Raffle deleted')
      router.refresh()
    } catch {
      toast.error('Failed to delete raffle')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-50"
      title="Delete"
    >
      {isDeleting ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Trash2 size={18} />
      )}
    </button>
  )
}
