'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Save, Loader2, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'

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

const iconOptions = [
  { value: 'Pizza', label: 'Pizza (Meals)' },
  { value: 'ShoppingBag', label: 'Shopping Bag (Supplies)' },
  { value: 'Backpack', label: 'Backpack (School)' },
  { value: 'Gift', label: 'Gift (General)' },
  { value: 'Heart', label: 'Heart' },
  { value: 'Home', label: 'Home' },
  { value: 'Users', label: 'Users (Family)' },
  { value: 'Utensils', label: 'Utensils (Food)' },
]

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

  const updateImpact = (id: string, field: keyof DonationImpact, value: string | number) => {
    setImpacts(
      impacts.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    )
  }

  return (
    <div className="space-y-8">
      {/* Existing Impacts */}
      <div className="space-y-4">
        {impacts.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-[#e0f7fa]/50">No donation impacts yet. Add one below!</p>
          </div>
        ) : (
          impacts.map((impact) => (
            <div key={impact.id} className="glass-card p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Mobile: Header with grip and actions */}
                <div className="flex items-center justify-between sm:hidden">
                  <div className="flex items-center gap-2">
                    <div className="text-[#38b6c4]/50 cursor-move">
                      <GripVertical size={20} />
                    </div>
                    <span className="text-[#f5a623] font-bold">{impact.amount}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(impact)}
                      disabled={loading === impact.id}
                      className="p-2 rounded-lg bg-[#38b6c4]/20 hover:bg-[#38b6c4]/30 transition-colors disabled:opacity-50"
                    >
                      {loading === impact.id ? (
                        <Loader2 size={18} className="text-[#38b6c4] animate-spin" />
                      ) : (
                        <Save size={18} className="text-[#38b6c4]" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(impact.id)}
                      disabled={loading === impact.id}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={18} className="text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Desktop: Grip handle */}
                <div className="hidden sm:block text-[#38b6c4]/50 cursor-move">
                  <GripVertical size={20} />
                </div>

                {/* Form fields */}
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[#e0f7fa] mb-1 sm:mb-2 text-xs sm:text-sm font-medium">
                      Amount
                    </label>
                    <input
                      type="text"
                      value={impact.amount}
                      onChange={(e) => updateImpact(impact.id, 'amount', e.target.value)}
                      placeholder="e.g., $25"
                      className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#e0f7fa] mb-1 sm:mb-2 text-xs sm:text-sm font-medium">
                      Title
                    </label>
                    <input
                      type="text"
                      value={impact.title}
                      onChange={(e) => updateImpact(impact.id, 'title', e.target.value)}
                      placeholder="e.g., Meals for a Family"
                      className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#e0f7fa] mb-1 sm:mb-2 text-xs sm:text-sm font-medium">
                      Icon
                    </label>
                    <select
                      value={impact.icon}
                      onChange={(e) => updateImpact(impact.id, 'icon', e.target.value)}
                      className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
                    >
                      {iconOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#e0f7fa] mb-1 sm:mb-2 text-xs sm:text-sm font-medium">
                      Description
                    </label>
                    <input
                      type="text"
                      value={impact.description}
                      onChange={(e) => updateImpact(impact.id, 'description', e.target.value)}
                      placeholder="What this provides..."
                      className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
                    />
                  </div>
                </div>

                {/* Desktop: Action buttons */}
                <div className="hidden sm:flex gap-2">
                  <button
                    onClick={() => handleUpdate(impact)}
                    disabled={loading === impact.id}
                    className="p-2 rounded-lg bg-[#38b6c4]/20 hover:bg-[#38b6c4]/30 transition-colors disabled:opacity-50"
                  >
                    {loading === impact.id ? (
                      <Loader2 size={18} className="text-[#38b6c4] animate-spin" />
                    ) : (
                      <Save size={18} className="text-[#38b6c4]" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(impact.id)}
                    disabled={loading === impact.id}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={18} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Impact */}
      <div className="glass-card p-4 sm:p-6 border-[#f5a623]/30">
        <h2 className="text-lg sm:text-xl font-bold text-[#e0f7fa] mb-4">Add New Impact</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <div>
            <label className="block text-[#e0f7fa] mb-1 sm:mb-2 text-xs sm:text-sm font-medium">
              Amount
            </label>
            <input
              type="text"
              value={newImpact.amount}
              onChange={(e) => setNewImpact({ ...newImpact, amount: e.target.value })}
              placeholder="e.g., $25"
              className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
            />
          </div>
          <div>
            <label className="block text-[#e0f7fa] mb-1 sm:mb-2 text-xs sm:text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              value={newImpact.title}
              onChange={(e) => setNewImpact({ ...newImpact, title: e.target.value })}
              placeholder="e.g., Meals for a Family"
              className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
            />
          </div>
          <div>
            <label className="block text-[#e0f7fa] mb-1 sm:mb-2 text-xs sm:text-sm font-medium">
              Icon
            </label>
            <select
              value={newImpact.icon}
              onChange={(e) => setNewImpact({ ...newImpact, icon: e.target.value })}
              className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
            >
              {iconOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#e0f7fa] mb-1 sm:mb-2 text-xs sm:text-sm font-medium">
              Description
            </label>
            <input
              type="text"
              value={newImpact.description}
              onChange={(e) => setNewImpact({ ...newImpact, description: e.target.value })}
              placeholder="What this provides..."
              className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
            />
          </div>
        </div>
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
  )
}
