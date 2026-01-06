'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  GripVertical,
  Pizza,
  ShoppingBag,
  Backpack,
  Gift,
  Heart,
  Home,
  Users,
  Utensils,
  Package,
  ShoppingCart,
  DollarSign,
  type LucideIcon,
} from 'lucide-react'
import toast from 'react-hot-toast'
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

interface DonationImpact {
  id: string
  amount: string
  title: string
  description: string
  icon: string
  order: number
}

interface Props {
  initialImpacts: DonationImpact[]
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Pizza,
  ShoppingBag,
  Backpack,
  Gift,
  Heart,
  Home,
  Users,
  Utensils,
  Package,
  ShoppingCart,
  DollarSign,
}

const iconOptions = [
  { value: 'Utensils', label: 'Utensils' },
  { value: 'Pizza', label: 'Pizza' },
  { value: 'ShoppingBag', label: 'Shopping Bag' },
  { value: 'ShoppingCart', label: 'Shopping Cart' },
  { value: 'Package', label: 'Package' },
  { value: 'Backpack', label: 'Backpack' },
  { value: 'Gift', label: 'Gift' },
  { value: 'Heart', label: 'Heart' },
  { value: 'Home', label: 'Home' },
  { value: 'Users', label: 'Family' },
  { value: 'DollarSign', label: 'Dollar Sign' },
]

// Sortable Item Component
function SortableImpactCard({
  impact,
  onUpdate,
  onDelete,
  onChange,
  loading,
}: {
  impact: DonationImpact
  onUpdate: () => void
  onDelete: () => void
  onChange: (field: keyof DonationImpact, value: string) => void
  loading: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: impact.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const IconComponent = iconMap[impact.icon] || Gift

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
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-lg bg-[#f5a623]/20 flex items-center justify-center">
            <IconComponent size={16} className="text-[#f5a623]" />
          </div>
          <span className="text-[#f5a623] font-bold text-lg">{impact.amount || '$0'}</span>
          <span className="text-[#e0f7fa]/50">-</span>
          <span className="text-[#e0f7fa] font-medium truncate">{impact.title || 'Untitled'}</span>
        </div>
      </div>

      {/* Card Body - Form Fields */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Amount */}
          <div>
            <label className="block text-[#e0f7fa]/70 mb-1.5 text-xs font-medium uppercase tracking-wide">
              Amount
            </label>
            <input
              type="text"
              value={impact.amount}
              onChange={(e) => onChange('amount', e.target.value)}
              placeholder="$25"
              className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-3 py-2.5 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4] transition-colors"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-[#e0f7fa]/70 mb-1.5 text-xs font-medium uppercase tracking-wide">
              Title
            </label>
            <input
              type="text"
              value={impact.title}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="Meals for a Family"
              className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-3 py-2.5 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4] transition-colors"
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-[#e0f7fa]/70 mb-1.5 text-xs font-medium uppercase tracking-wide">
              Icon
            </label>
            <div className="relative">
              <select
                value={impact.icon}
                onChange={(e) => onChange('icon', e.target.value)}
                className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg pl-10 pr-3 py-2.5 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4] transition-colors appearance-none"
              >
                {iconOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <IconComponent size={16} className="text-[#38b6c4]" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#e0f7fa]/70 mb-1.5 text-xs font-medium uppercase tracking-wide">
              Description
            </label>
            <input
              type="text"
              value={impact.description}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="What this provides..."
              className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-3 py-2.5 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Card Footer - Actions */}
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

export default function DonationImpactManager({ initialImpacts }: Props) {
  const router = useRouter()
  const [impacts, setImpacts] = useState<DonationImpact[]>(initialImpacts)
  const [loading, setLoading] = useState<string | null>(null)
  const [newImpact, setNewImpact] = useState({
    amount: '',
    title: '',
    description: '',
    icon: 'Gift',
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
      const oldIndex = impacts.findIndex((i) => i.id === active.id)
      const newIndex = impacts.findIndex((i) => i.id === over.id)

      const newImpacts = arrayMove(impacts, oldIndex, newIndex).map((item, index) => ({
        ...item,
        order: index,
      }))

      setImpacts(newImpacts)

      // Save new order to database
      try {
        const res = await fetch('/api/admin/donation-impacts/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: newImpacts.map((item) => ({ id: item.id, order: item.order })),
          }),
        })

        if (!res.ok) throw new Error('Failed to reorder')
        toast.success('Order saved!')
      } catch {
        toast.error('Failed to save order')
        // Revert on error
        setImpacts(initialImpacts)
      }
    }
  }

  const handleAdd = async () => {
    if (!newImpact.amount || !newImpact.title || !newImpact.description) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading('add')
    try {
      const res = await fetch('/api/admin/donation-impacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newImpact,
          order: impacts.length,
        }),
      })

      if (!res.ok) throw new Error('Failed to add')

      toast.success('Impact added!')
      setNewImpact({ amount: '', title: '', description: '', icon: 'Gift' })
      router.refresh()
    } catch {
      toast.error('Failed to add impact')
    } finally {
      setLoading(null)
    }
  }

  const handleUpdate = async (impact: DonationImpact) => {
    setLoading(impact.id)
    try {
      const res = await fetch(`/api/admin/donation-impacts/${impact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(impact),
      })

      if (!res.ok) throw new Error('Failed to update')

      toast.success('Impact updated!')
      router.refresh()
    } catch {
      toast.error('Failed to update impact')
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this impact?')) return

    setLoading(id)
    try {
      const res = await fetch(`/api/admin/donation-impacts/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete')

      toast.success('Impact deleted!')
      setImpacts(impacts.filter((i) => i.id !== id))
      router.refresh()
    } catch {
      toast.error('Failed to delete impact')
    } finally {
      setLoading(null)
    }
  }

  const updateImpact = (id: string, field: keyof DonationImpact, value: string) => {
    setImpacts(
      impacts.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    )
  }

  const NewIconComponent = iconMap[newImpact.icon] || Gift

  return (
    <div className="space-y-6">
      {/* Existing Impacts */}
      {impacts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#38b6c4]/10 flex items-center justify-center mx-auto mb-4">
            <Gift size={32} className="text-[#38b6c4]/50" />
          </div>
          <p className="text-[#e0f7fa]/50 text-lg">No donation impacts yet</p>
          <p className="text-[#e0f7fa]/30 text-sm mt-1">Add your first impact below</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={impacts.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {impacts.map((impact) => (
                <SortableImpactCard
                  key={impact.id}
                  impact={impact}
                  onUpdate={() => handleUpdate(impact)}
                  onDelete={() => handleDelete(impact.id)}
                  onChange={(field, value) => updateImpact(impact.id, field, value)}
                  loading={loading === impact.id}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add New Impact */}
      <div className="glass-card overflow-hidden border-[#f5a623]/30">
        <div className="px-4 py-3 bg-[#f5a623]/10 border-b border-[#f5a623]/20">
          <h2 className="text-lg font-bold text-[#e0f7fa] flex items-center gap-2">
            <Plus size={20} className="text-[#f5a623]" />
            Add New Impact
          </h2>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-[#e0f7fa]/70 mb-1.5 text-xs font-medium uppercase tracking-wide">
                Amount
              </label>
              <input
                type="text"
                value={newImpact.amount}
                onChange={(e) => setNewImpact({ ...newImpact, amount: e.target.value })}
                placeholder="$25"
                className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-3 py-2.5 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4] transition-colors"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-[#e0f7fa]/70 mb-1.5 text-xs font-medium uppercase tracking-wide">
                Title
              </label>
              <input
                type="text"
                value={newImpact.title}
                onChange={(e) => setNewImpact({ ...newImpact, title: e.target.value })}
                placeholder="Meals for a Family"
                className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-3 py-2.5 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4] transition-colors"
              />
            </div>

            {/* Icon */}
            <div>
              <label className="block text-[#e0f7fa]/70 mb-1.5 text-xs font-medium uppercase tracking-wide">
                Icon
              </label>
              <div className="relative">
                <select
                  value={newImpact.icon}
                  onChange={(e) => setNewImpact({ ...newImpact, icon: e.target.value })}
                  className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg pl-10 pr-3 py-2.5 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4] transition-colors appearance-none"
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <NewIconComponent size={16} className="text-[#38b6c4]" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[#e0f7fa]/70 mb-1.5 text-xs font-medium uppercase tracking-wide">
                Description
              </label>
              <input
                type="text"
                value={newImpact.description}
                onChange={(e) => setNewImpact({ ...newImpact, description: e.target.value })}
                placeholder="What this provides..."
                className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-3 py-2.5 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4] transition-colors"
              />
            </div>
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
            Add Impact
          </button>
        </div>
      </div>
    </div>
  )
}
