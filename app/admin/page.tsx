import { AdminControlCenter } from "@/components/admin/dashboard/admin-control-center"
import { RealSatelliteMap } from "@/components/real-satellite-map"
import { RealTimeStats } from "@/components/admin/dashboard/real-time-stats"
import { WeatherWidget } from "@/components/admin/dashboard/weather-widget"
import { VisitorAnalytics } from "@/components/admin/dashboard/visitor-analytics"
import { RecentActivity } from "@/components/admin/dashboard/recent-activity"

export default function AdminDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ocean Monitoring Command Center</h1>
          <p className="text-muted-foreground">Real-time oversight of ocean hazard detection and emergency response</p>
        </div>
        <WeatherWidget />
      </div>

      {/* Real-time Statistics Grid */}
      <RealTimeStats />

      {/* Main Map Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-card rounded-lg border p-4">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">Live Ocean Monitoring</h2>
            <div className="h-96 lg:h-[600px]">
              <RealSatelliteMap userRole="admin" showAnalytics={true} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <VisitorAnalytics />
          <RecentActivity />
        </div>
      </div>

      {/* Control Center */}
      <AdminControlCenter />
    </div>
  )
}
