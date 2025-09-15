"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, AlertTriangle, Shield, Phone, Camera, Navigation } from "lucide-react"
import { LiveInteractiveMap } from "@/components/maps/live-interactive-map"
import { EmergencyReportForm } from "@/components/forms/emergency-report-form"
import { useRealTimeNotifications } from "@/lib/hooks/use-real-time-notifications"
import { useLiveLocation } from "@/lib/hooks/use-live-location"

export function CitizenDashboard() {
  const [showReportForm, setShowReportForm] = useState(false)
  const [userRole] = useState<"citizen" | "admin" | "analyst">("citizen")
  const { notifications, clearNotification } = useRealTimeNotifications()
  const { location, accuracy, startTracking, stopTracking, isTracking } = useLiveLocation()

  // Mock data for nearby reports and safety status
  const [nearbyReports] = useState([
    {
      id: "1",
      type: "flood",
      severity: "high",
      distance: "0.8 km",
      time: "5 min ago",
      verified: true,
      description: "Water level rising near coastal road",
    },
    {
      id: "2",
      type: "high_waves",
      severity: "medium",
      distance: "1.2 km",
      time: "12 min ago",
      verified: false,
      description: "Unusual wave patterns observed",
    },
  ])

  const [safetyStatus] = useState({
    status: "caution",
    zone: "Yellow Zone - Exercise Caution",
    nearestSafeZone: "Marina Community Center - 2.1 km",
    activeAlerts: 2,
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "text-green-600 bg-green-50"
      case "caution":
        return "text-yellow-600 bg-yellow-50"
      case "danger":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Emergency Alert Banner */}
      {notifications.length > 0 && (
        <div className="bg-red-600 text-white p-3 sm:p-4">
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-2 flex-1 min-w-0">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-sm sm:text-base">Emergency Alert</span>
                <p className="mt-1 text-sm">{notifications[0].message}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-2 w-full sm:w-auto text-xs sm:text-sm"
                  onClick={() => {
                    /* Navigate to safe zone */
                  }}
                >
                  <Navigation className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Get Directions to Safety
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-red-700 flex-shrink-0"
              onClick={() => clearNotification(notifications[0].id)}
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Atlas Alert</h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              {location ? (
                <span className="truncate">
                  Current Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </span>
              ) : (
                <span>Location not available</span>
              )}
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Button
              variant={isTracking ? "destructive" : "default"}
              size="sm"
              onClick={isTracking ? stopTracking : startTracking}
              className="flex-1 sm:flex-none text-xs sm:text-sm"
            >
              {isTracking ? "Stop Tracking" : "Share Location"}
            </Button>
            <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
              <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Safety Status Card */}
      <div className="p-3 sm:p-4">
        <Card className="mb-3 sm:mb-4">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                <Shield
                  className={`h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 ${safetyStatus.status === "safe" ? "text-green-600" : safetyStatus.status === "caution" ? "text-yellow-600" : "text-red-600"}`}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm sm:text-base">{safetyStatus.zone}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 break-words">
                    Nearest Safe Zone: {safetyStatus.nearestSafeZone}
                  </p>
                </div>
              </div>
              <Badge className={`${getStatusColor(safetyStatus.status)} text-xs flex-shrink-0`}>
                {safetyStatus.activeAlerts} Active Alerts
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Live Map */}
        <Card className="mb-3 sm:mb-4">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg">Live Hazard Map</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-48 sm:h-64 lg:h-80 relative">
              <LiveInteractiveMap userRole={userRole} />
            </div>
          </CardContent>
        </Card>

        {/* Nearby Reports */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg">Nearby Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            {nearbyReports.map((report) => (
              <div
                key={report.id}
                className="flex items-start sm:items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg gap-3"
              >
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-1 sm:mt-0 flex-shrink-0 ${getSeverityColor(report.severity)}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium capitalize text-xs sm:text-sm">{report.type.replace("_", " ")}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{report.description}</p>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-gray-500 mt-1">
                      <span>{report.distance}</span>
                      <span>•</span>
                      <span>{report.time}</span>
                      {report.verified && (
                        <>
                          <span>•</span>
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          <Button className="h-14 sm:h-16 bg-red-600 hover:bg-red-700" onClick={() => setShowReportForm(true)}>
            <div className="text-center">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1" />
              <span className="text-xs sm:text-sm font-medium">Report Emergency</span>
            </div>
          </Button>
          <Button variant="outline" className="h-14 sm:h-16 bg-transparent">
            <div className="text-center">
              <Camera className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1" />
              <span className="text-xs sm:text-sm font-medium">Quick Photo</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Emergency Report Form Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <EmergencyReportForm onClose={() => setShowReportForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
