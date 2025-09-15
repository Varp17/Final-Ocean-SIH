import { SystemMonitoring } from "@/components/admin/monitoring/system-monitoring"

export default function MonitoringPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Monitoring</h1>
        <p className="text-gray-600">Monitor system health and performance</p>
      </div>
      <SystemMonitoring />
    </div>
  )
}
