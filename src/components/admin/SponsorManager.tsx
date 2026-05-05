'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  GripVertical,
  Users,
  ExternalLink,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import ImageUpload from '@/components/admin/ImageUpload'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Sponsor {
  id: string
  name: string
  logoUrl: string | null
  websiteUrl: string | null
  order: number
}

interface Props {
  initialSponsors: Sponsor[]
}

function SortableSponsorCard({
  sponsor,
  onUpdate,
  onDelete,
  onChange,
  onLogoChange,
  loading,
}: {
  sponsor: Sponsor
  onUpdate: () => void
  onDelete: () => void
  onChange: (field: keyof Sponsor, value: string) => void
  onLogoChange: (url: string | null) => void
  loading: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sponsor.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass-card overflow-hidden transition-shadow ${
        isDragging ? 'shadow-xl shadow-[#38b6c4]/20 z-50' : ''
      }`}
    >
      {/* Card Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1a2e2e]/50 border-b border-[#38b6c4]/10">
        <button
          {...attributes}
          {...listeners}
          className="touch-none p-1 rounded hover:bg-[#38b6c4]/20 text-[#38b6c4]/50 hover:text-[#38b6c4] transition-colors cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={18} />
        </button>
        <div className="flex items-center gap-3 flex-1">
          {sponsor.logoUrl ? (
            <div className="relative w-8 h-8 rounded bg-white/10 overflow-hidden flex-shrink-0">
              <Image src={sponsor.logoUrl} alt={sponsor.name} fill className="object-contain" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#38b6c4]/20 flex items-center justify-center flex-shrink-0">
              <Users size={16} className="text-[#38b6c4]" />
            </div>
          )}
          <span className="text-[#e0f7fa] font-medium truncate">{sponsor.name || 'Untitled'}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-[#e0f7fa]/70 mb-1.5 text-xs font-medium uppercase tracking-wide">
              Name
            </label>
            <input
              type="text"
              value={sponsor.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Partner name"
              className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-3 py-2.5 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4] transition-colors"
            />
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-[#e0f7fa]/70 mb-1.5 text-xs font-medium uppercase tracking-wide">
              Website URL (optional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={sponsor.websiteUrl || ''}
                onChange={(e) => onChange('websiteUrl', e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-3 py-2.5 pr-10 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4] transition-colors"
              />
              {sponsor.websiteUrl && (
                <a
                  href={sponsor.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#38b6c4] hover:text-[#f5a623]"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-[#e0f7fa]/70 mb-1.5 text-xs font-medium uppercase tracking-wide">
            Logo (optional)
          </label>
          <ImageUpload
            value={sponsor.logoUrl}
            onChange={(url) => onLogoChange(url)}
          />
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-end gap-2 px-4 py-3 bg-[#1a2e2e]/30 border-t border-[#38b6c4]/10">
        <button
          onClick={onDelete}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors text-sm disabled:opacity-50"
        >
          <Trash2 size={14} />
          Delete
        </button>
        <button
          onClick={onUpdate}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#38b6c4]/20 text-[#38b6c4] hover:bg-[#38b6c4]/30 transition-colors text-sm font-medium disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          Save
        </button>
      </div>
    </div>
  )
}

export default function SponsorManager({ initialSponsors }: Props) {
  const router = useRouter()
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors)
  const [loading, setLoading] = useState<string | null>(null)
  const [newSponsor, setNewSponsor] = useState({
    name: '',
    logoUrl: null as string | null,
    websiteUrl: '',
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = sponsors.findIndex((s) => s.id === active.id)
      const newIndex = sponsors.findIndex((s) => s.id === over.id)

      const newSponsors = arrayMove(sponsors, oldIndex, newIndex).map((item, index) => ({
        ...item,
        order: index,
      }))

      setSponsors(newSponsors)

      try {
        const res = await fetch('/api/admin/sponsors/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: newSponsors.map((item) => ({ id: item.id, order: item.order })),
          }),
        })

        if (!res.ok) throw new Error('Failed to reorder')
        toast.success('Order saved!')
      } catch {
        toast.error('Failed to save order')
        setSponsors(initialSponsors)
      }
    }
  }

  const handleAdd = async () => {
    if (!newSponsor.name) {
      toast.error('Please enter a sponsor name')
      return
    }

    setLoading('add')
    try {
      const res = await fetch('/api/admin/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSponsor,
          order: sponsors.length,
        }),
      })

      if (!res.ok) throw new Error('Failed to add')

      toast.success('Sponsor added!')
      setNewSponsor({ name: '', logoUrl: null, websiteUrl: '' })
      router.refresh()
    } catch {
      toast.error('Failed to add sponsor')
    } finally {
      setLoading(null)
    }
  }

  const handleUpdate = async (sponsor: Sponsor) => {
    setLoading(sponsor.id)
    try {
      const res = await fetch(`/api/admin/sponsors/${sponsor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sponsor),
      })

      if (!res.ok) throw new Error('Failed to update')

      toast.success('Sponsor updated!')
      router.refresh()
    } catch {
      toast.error('Failed to update sponsor')
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sponsor?')) return

    setLoading(id)
    try {
      const res = await fetch(`/api/admin/sponsors/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete')

      toast.success('Sponsor deleted!')
      setSponsors(sponsors.filter((s) => s.id !== id))
      router.refresh()
    } catch {
      toast.error('Failed to delete sponsor')
    } finally {
      setLoading(null)
    }
  }

  const updateSponsor = (id: string, field: keyof Sponsor, value: string) => {
    setSponsors(
      sponsors.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  const updateSponsorLogo = (id: string, url: string | null) => {
    setSponsors(
      sponsors.map((s) => (s.id === id ? { ...s, logoUrl: url } : s))
    )
  }

  return (
    <div className="space-y-6">
      {/* Existing Sponsors */}
      {sponsors.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#38b6c4]/10 flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-[#38b6c4]/50" />
          </div>
          <p className="text-[#e0f7fa]/50 text-lg">No sponsors yet</p>
          <p className="text-[#e0f7fa]/30 text-sm mt-1">Add your first sponsor below</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sponsors.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {sponsors.map((sponsor) => (
                <SortableSponsorCard
                  key={sponsor.id}
                  sponsor={sponsor}
                  onUpdate={() => handleUpdate(sponsor)}
                  onDelete={() => handleDelete(sponsor.id)}
                  onChange={(field, value) => updateSponsor(sponsor.id, field, value)}
                  onLogoChange={(url) => updateSponsorLogo(sponsor.id, url)}
                  loading={loading === sponsor.id}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add New Sponsor */}
      <div className="glass-card overflow-hidden border-[#f5a623]/30">
        <div className="px-4 py-3 bg-[#f5a623]/10 border-b border-[#f5a623]/20">
          <h2 className="text-lg font-bold text-[#e0f7fa] flex items-center gap-2">
            <Plus size={20} className="text-[#f5a623]" />
            Add New Sponsor
          </h2>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-[#e0f7fa]/70 mb-1.5 text-xs font-medium uppercase tracking-wide">
                Name *
              </label>
              <input
                type="text"
                value={newSponsor.name}
                onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                placeholder="Partner name"
                className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-3 py-2.5 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4] transition-colors"
              />
            </div>

            {/* Website URL */}
            <div>
              <label className="block text-[#e0f7fa]/70 mb-1.5 text-xs font-medium uppercase tracking-wide">
                Website URL (optional)
              </label>
              <input
                type="text"
                value={newSponsor.websiteUrl}
                onChange={(e) => setNewSponsor({ ...newSponsor, websiteUrl: e.target.value })}
                placeholder="https://..."
                className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-3 py-2.5 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4] transition-colors"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-[#e0f7fa]/70 mb-1.5 text-xs font-medium uppercase tracking-wide">
              Logo (optional)
            </label>
            <ImageUpload
              value={newSponsor.logoUrl}
              onChange={(url) => setNewSponsor({ ...newSponsor, logoUrl: url || null })}
            />
          </div>
        </div>

        <div className="px-4 py-3 bg-[#1a2e2e]/30 border-t border-[#38b6c4]/10">
          <button
            onClick={handleAdd}
            disabled={loading === 'add'}
            className="btn-accent flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50"
          >
            {loading === 'add' ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Plus size={18} />
            )}
            Add Sponsor
          </button>
        </div>
      </div>
    </div>
  )
}
