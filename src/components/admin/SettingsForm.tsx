'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save } from 'lucide-react'
import toast from 'react-hot-toast'

interface SettingsFormProps {
  initialSettings: Record<string, string>
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    mission_statement: initialSettings.mission_statement || '',
    families_helped: initialSettings.families_helped || '200',
    years_active: initialSettings.years_active || '12',
    total_donations: initialSettings.total_donations || '0',
    contact_email: initialSettings.contact_email || '',
    contact_phone: initialSettings.contact_phone || '',
    founder_name: initialSettings.founder_name || '',
    facebook_url: initialSettings.facebook_url || '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!res.ok) {
        throw new Error('Failed to save settings')
      }

      toast.success('Settings saved!')
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Impact Stats */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-[#e0f7fa] mb-4">Impact Statistics</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
              Families Helped
            </label>
            <input
              type="text"
              name="families_helped"
              value={settings.families_helped}
              onChange={handleChange}
              placeholder="e.g., 200"
              className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-4 py-3 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
            />
          </div>
          <div>
            <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
              Years Active
            </label>
            <input
              type="text"
              name="years_active"
              value={settings.years_active}
              onChange={handleChange}
              placeholder="e.g., 12"
              className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-4 py-3 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
            />
          </div>
          <div>
            <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
              Total Donations ($)
            </label>
            <input
              type="text"
              name="total_donations"
              value={settings.total_donations}
              onChange={handleChange}
              placeholder="e.g., 5000"
              className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-4 py-3 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
            />
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-[#e0f7fa] mb-4">Mission Statement</h2>
        <textarea
          name="mission_statement"
          value={settings.mission_statement}
          onChange={handleChange}
          rows={4}
          placeholder="Enter your organization's mission statement..."
          className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-4 py-3 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4] resize-none"
        />
      </div>

      {/* Contact Information */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-[#e0f7fa] mb-4">Contact Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
              Founder Name
            </label>
            <input
              type="text"
              name="founder_name"
              value={settings.founder_name}
              onChange={handleChange}
              placeholder="e.g., Mike Bellerose"
              className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-4 py-3 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
            />
          </div>
          <div>
            <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
              Contact Email
            </label>
            <input
              type="email"
              name="contact_email"
              value={settings.contact_email}
              onChange={handleChange}
              placeholder="e.g., contact@example.com"
              className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-4 py-3 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
            />
          </div>
          <div>
            <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
              Contact Phone
            </label>
            <input
              type="tel"
              name="contact_phone"
              value={settings.contact_phone}
              onChange={handleChange}
              placeholder="e.g., 705-207-4170"
              className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-4 py-3 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
            />
          </div>
          <div>
            <label className="block text-[#e0f7fa] mb-2 text-sm font-medium">
              Facebook URL
            </label>
            <input
              type="url"
              name="facebook_url"
              value={settings.facebook_url}
              onChange={handleChange}
              placeholder="e.g., https://facebook.com/..."
              className="w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-4 py-3 text-[#e0f7fa] focus:outline-none focus:border-[#38b6c4]"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Save Settings
        </button>
      </div>
    </form>
  )
}
