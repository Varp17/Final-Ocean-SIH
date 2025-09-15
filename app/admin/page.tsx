import { AdminControlCenter } from "@/components/admin/dashboard/admin-control-center"
import { RealSatelliteMap } from "@/components/real-satellite-map"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor and manage the Atlas-Alert system</p>
      </div>

      <div className="h-96 lg:h-[600px]">
        <RealSatelliteMap userRole="admin" showAnalytics={true} />
      </div>

      <AdminControlCenter />
    </div>
  )
}
