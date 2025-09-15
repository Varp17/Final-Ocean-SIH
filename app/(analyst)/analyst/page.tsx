import { AnalystDashboard } from "@/components/analyst/analyst-dashboard"
import { RealSatelliteMap } from "@/components/real-satellite-map"

export default function AnalystPage() {
  return (
    <div className="space-y-6">
      <div className="h-96 lg:h-[600px]">
        <RealSatelliteMap userRole="analyst" showAnalytics={true} />
      </div>

      <AnalystDashboard />
    </div>
  )
}
