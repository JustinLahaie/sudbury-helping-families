import { prisma } from '@/lib/prisma'
import SettingsForm from '@/components/admin/SettingsForm'

export default async function SettingsPage() {
  const settings = await prisma.siteSetting.findMany()

  // Convert array to object for easier access
  const settingsObject = settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {} as Record<string, string>)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#e0f7fa]">Site Settings</h1>
        <p className="text-[#38b6c4] mt-1">Manage your website content and information</p>
      </div>

      <SettingsForm initialSettings={settingsObject} />
    </div>
  )
}
