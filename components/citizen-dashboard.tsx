"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, MapPin, Send, Shield, Waves, Navigation, Clock, AlertCircle } from "lucide-react"
import { useWebSocket } from "@/lib/hooks/use-websocket"
import { useRealTimeNotifications } from "@/lib/hooks/use-real-time-notifications"
import { useLiveLocation } from "@/lib/hooks/use-live-location"
import { RealTimeNotifications } from "@/components/real-time-notifications"
import { LiveLocationTracker } from "@/components/live-location-tracker"

interface HazardReport {
  id: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  location: string
  description: string
  timestamp: string
  status: "active" | "resolved" | "investigating"
  reportedBy: string
}

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
}

export function CitizenDashboard() {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [isReporting, setIsReporting] = useState(false)
  const [reportForm, setReportForm] = useState({
    type: "",
    severity: "",
    description: "",
    image: null as File | null,
  })
  const [nearbyReports, setNearbyReports] = useState<HazardReport[]>([
    {
      id: "1",
      type: "High Waves",
      severity: "high",
      location: "Marina Beach, Chennai",
      description: "Unusually high waves observed, unsafe for swimming",
      timestamp: "2 minutes ago",
      status: "active",
      reportedBy: "Anonymous",
    },
    {
      id: "2",
      type: "Rip Current",
      severity: "critical",
      location: "Kovalam Beach, Kerala",
      description: "Strong rip current detected near the main swimming area",
      timestamp: "15 minutes ago",
      status: "investigating",
      reportedBy: "Lifeguard Station",
    },
    {
      id: "3",
      type: "Jellyfish Swarm",
      severity: "medium",
      location: "Goa Beach",
      description: "Large jellyfish swarm spotted near shore",
      timestamp: "1 hour ago",
      status: "active",
      reportedBy: "Tourist",
    },
  ])

  const { isConnected, sendMessage } = useWebSocket()
  const { notifications } = useRealTimeNotifications()
  const { currentLocation, isTracking, startTracking, stopTracking } = useLiveLocation()

  useEffect(() => {
    startTracking()
    return () => stopTracking()
  }, [])

  const handleSubmitReport = async () => {
    if (!reportForm.type || !reportForm.severity || !reportForm.description) {
      alert("Please fill in all required fields")
      return
    }

    const newReport: HazardReport = {
      id: Date.now().toString(),
      type: reportForm.type,
      severity: reportForm.severity as any,
      location: currentLocation
        ? `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`
        : "Unknown Location",
      description: reportForm.description,
      timestamp: "Just now",
      status: "active",
      reportedBy: "You",
    }

    if (isConnected) {
      sendMessage({
        type: "NEW_REPORT",
        data: newReport,
      })
    }

    try {
      await fetch("/api/real-time/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "EMERGENCY_REPORT",
          report: newReport,
          location: currentLocation,
        }),
      })
    } catch (error) {
      console.log("[v0] Failed to broadcast report:", error)
    }

    setNearbyReports([newReport, ...nearbyReports])
    setReportForm({ type: "", severity: "", description: "", image: null })
    setIsReporting(false)

    alert("Report submitted successfully! Emergency services have been notified.")
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800"
      case "investigating":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50">
      <RealTimeNotifications />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-emerald-100">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Atlas-Alert</h1>
                <p className="text-xs text-gray-500">Ocean Safety Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className={`w-4 h-4 ${isTracking ? "text-emerald-600" : "text-gray-400"}`} />
              <span className="text-sm text-gray-600">{isTracking ? "Live Tracking" : "Location Inactive"}</span>
              {isConnected && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <LiveLocationTracker />

        {/* Quick Actions */}
        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-emerald-600" />
              <span>Report Ocean Hazard</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isReporting ? (
              <Button
                onClick={() => setIsReporting(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                size="lg"
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                Report Emergency
              </Button>
            ) : (
              <div className="space-y-4">
                <Select
                  value={reportForm.type}
                  onValueChange={(value) => setReportForm({ ...reportForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select hazard type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-waves">High Waves</SelectItem>
                    <SelectItem value="rip-current">Rip Current</SelectItem>
                    <SelectItem value="jellyfish">Jellyfish Swarm</SelectItem>
                    <SelectItem value="shark-sighting">Shark Sighting</SelectItem>
                    <SelectItem value="pollution">Water Pollution</SelectItem>
                    <SelectItem value="debris">Floating Debris</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={reportForm.severity}
                  onValueChange={(value) => setReportForm({ ...reportForm, severity: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Minor concern</SelectItem>
                    <SelectItem value="medium">Medium - Caution advised</SelectItem>
                    <SelectItem value="high">High - Dangerous conditions</SelectItem>
                    <SelectItem value="critical">Critical - Immediate danger</SelectItem>
                  </SelectContent>
                </Select>

                <Textarea
                  placeholder="Describe the hazard in detail..."
                  value={reportForm.description}
                  onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                  className="min-h-[80px]"
                />

                <div className="flex space-x-2">
                  <Button onClick={handleSubmitReport} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Report
                  </Button>
                  <Button variant="outline" onClick={() => setIsReporting(false)} className="px-4">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Safety Status */}
        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span>Current Safety Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div>
                <p className="font-semibold text-emerald-800">Safe Zone</p>
                <p className="text-sm text-emerald-600">No active hazards in your area</p>
              </div>
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nearby Reports */}
        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Navigation className="w-5 h-5 text-emerald-600" />
                <span>Nearby Reports</span>
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                {nearbyReports.length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nearbyReports.map((report) => (
              <div key={report.id} className="p-4 border border-gray-200 rounded-lg space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{report.type}</h4>
                      <Badge className={getSeverityColor(report.severity)}>{report.severity.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{report.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{report.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              <span>Emergency Contacts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start border-red-200 text-red-700 hover:bg-red-100 bg-transparent"
            >
              <span className="font-semibold mr-2">Coast Guard:</span>
              <span>1554</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-red-200 text-red-700 hover:bg-red-100 bg-transparent"
            >
              <span className="font-semibold mr-2">Emergency:</span>
              <span>112</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-red-200 text-red-700 hover:bg-red-100 bg-transparent"
            >
              <span className="font-semibold mr-2">Local Marine Police:</span>
              <span>100</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
