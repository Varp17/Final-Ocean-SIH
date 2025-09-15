import { SystemSettings } from "@/components/admin/system-settings"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
        <p className="text-slate-600">Configure Atlas-Alert system parameters and preferences</p>
      </div>
      <SystemSettings />
    </div>
  )
}
