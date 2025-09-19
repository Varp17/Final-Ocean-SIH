"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Layers,
  AlertTriangle,
  Filter,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Navigation,
  Phone,
} from "lucide-react"
import { useState, useEffect } from "react"

interface LiveReport {
  id: string
  type: "flood" | "high_waves" | "oil_spill" | "debris" | "pollution" | "storm_surge"
  severity: "low" | "medium" | "high" | "critical"
  status: "pending" | "verified" | "investigating" | "resolved" | "false_alarm"
  location: string
  coordinates: { lat: number; lng: number }
  reporter: string
  reporterType: "citizen" | "authority" | "sensor" | "satellite"
  timestamp: Date
  description: string
  images?: string[]
  confidence: number
  assignedTeam?: string
  estimatedAffected: number
}

interface MapLayer {
  id: string
  name: string
  visible: boolean
  color: string
  count: number
}

export function LiveReportsMapInterface() {
  const [selectedReport, setSelectedReport] = useState<LiveReport | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const [layers, setLayers] = useState<MapLayer[]>([
    { id: "pending", name: "Pending Reports", visible: true, color: "#f59e0b", count: 8 },
    { id: "verified", name: "Verified Reports", visible: true, color: "#dc2626", count: 18 },
    { id: "investigating", name: "Under Investigation", visible: true, color: "#3b82f6", count: 5 },
    { id: "resolved", name: "Resolved Reports", visible: false, color: "#16a34a", count: 12 },
    { id: "teams", name: "Response Teams", visible: true, color: "#7c3aed", count: 6 },
    { id: "sensors", name: "Sensor Network", visible: false, color: "#0ea5e9", count: 24 },
  ])

  const [liveReports, setLiveReports] = useState<LiveReport[]>([
    {
      id: "LR-001",
      type: "oil_spill",
      severity: "critical",
      status: "verified",
      location: "Mumbai Port, Sector 7",
      coordinates: { lat: 18.9388, lng: 72.8354 },
      reporter: "Port Authority",
      reporterType: "authority",
      timestamp: new Date(Date.now() - 15 * 60000),
      description: "Large oil spill detected near container terminal. Estimated 500L crude oil leaked.",
      images: ["oil-spill-1.jpg", "oil-spill-2.jpg"],
      confidence: 95,
      assignedTeam: "Coast Guard Alpha",
      estimatedAffected: 1200,
    },
    {
      id: "LR-002",
      type: "high_waves",
      severity: "high",
      status: "investigating",
      location: "Chennai Marina Beach",
      coordinates: { lat: 13.0475, lng: 80.2824 },
      reporter: "Beach Safety Officer",
      reporterType: "authority",
      timestamp: new Date(Date.now() - 8 * 60000),
      description: "Waves reaching 4-5 meters height. Multiple swimmers in distress reported.",
      confidence: 88,
      assignedTeam: "Marine Response Beta",
      estimatedAffected: 300,
    },
    {
      id: "LR-003",
      type: "debris",
      severity: "medium",
      status: "pending",
      location: "Goa Anjuna Beach",
      coordinates: { lat: 15.5732, lng: 73.7395 },
      reporter: "Tourist",
      reporterType: "citizen",
      timestamp: new Date(Date.now() - 25 * 60000),
      description: "Large amount of plastic debris washed ashore. Possible container spill.",
      confidence: 72,
      estimatedAffected: 150,
    },
    {
      id: "LR-004",
      type: "storm_surge",
      severity: "critical",
      status: "verified",
      location: "Kochi Backwaters",
      coordinates: { lat: 9.9312, lng: 76.2673 },
      reporter: "Weather Station",
      reporterType: "sensor",
      timestamp: new Date(Date.now() - 45 * 60000),
      description: "Unusual water level rise detected. Storm surge approaching coastal areas.",
      confidence: 92,
      assignedTeam: "Emergency Team Gamma",
      estimatedAffected: 2500,
    },
    {
      id: "LR-005",
      type: "pollution",
      severity: "high",
      status: "pending",
      location: "Visakhapatnam Port",
      coordinates: { lat: 17.6868, lng: 83.2185 },
      reporter: "Environmental Monitor",
      reporterType: "authority",
      timestamp: new Date(Date.now() - 12 * 60000),
      description: "Chemical discharge detected in port waters. pH levels abnormal.",
      confidence: 85,
      estimatedAffected: 800,
    },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update report statuses or add new reports
      setLiveReports((prev) => {
        const updated = prev.map((report) => {
          if (Math.random() < 0.1) {
            const statuses = ["pending", "verified", "investigating", "resolved"]
            const currentIndex = statuses.indexOf(report.status)
            const nextStatus = statuses[Math.min(currentIndex + 1, statuses.length - 1)]
            return { ...report, status: nextStatus as any }
          }
          return report
        })

        // Occasionally add a new report
        if (Math.random() < 0.05) {
          const newReport: LiveReport = {
            id: `LR-${String(Date.now()).slice(-3)}`,
            type: ["flood", "high_waves", "debris", "pollution"][Math.floor(Math.random() * 4)] as any,
            severity: ["medium", "high", "critical"][Math.floor(Math.random() * 3)] as any,
            status: "pending",
            location: "New Location",
            coordinates: { lat: 19.076 + Math.random() * 0.1, lng: 72.8777 + Math.random() * 0.1 },
            reporter: "Citizen Report",
            reporterType: "citizen",
            timestamp: new Date(),
            description: "New hazard detected by monitoring system",
            confidence: 60 + Math.random() * 30,
            estimatedAffected: Math.floor(Math.random() * 1000),
          }
          return [newReport, ...updated.slice(0, 9)] // Keep last 10 reports
        }

        return updated
      })

      // Update layer counts
      setLayers((prev) =>
        prev.map((layer) => ({
          ...layer,
          count: liveReports.filter((r) => {
            switch (layer.id) {
              case "pending":
                return r.status === "pending"
              case "verified":
                return r.status === "verified"
              case "investigating":
                return r.status === "investigating"
              case "resolved":
                return r.status === "resolved"
              default:
                return false
            }
          }).length,
        })),
      )
    }, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [liveReports])

  const toggleLayer = (layerId: string) => {
    setLayers((prev) => prev.map((layer) => (layer.id === layerId ? { ...layer, visible: !layer.visible } : layer)))
  }

  const filteredReports = liveReports.filter((report) => {
    const statusMatch = filterStatus === "all" || report.status === filterStatus
    const severityMatch = filterSeverity === "all" || report.severity === filterSeverity
    const searchMatch =
      searchQuery === "" ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase())

    return statusMatch && severityMatch && searchMatch
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#dc2626"
      case "high":
        return "#f59e0b"
      case "medium":
        return "#3b82f6"
      case "low":
        return "#16a34a"
      default:
        return "#6b7280"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-red-100 text-red-800 border-red-200"
      case "investigating":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleReportAction = (reportId: string, action: "verify" | "investigate" | "resolve" | "false_alarm") => {
    setLiveReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: action === "false_alarm" ? "resolved" : (action as any),
            }
          : report,
      ),
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Map Display */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-card-foreground">Live Reports Map</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {filteredReports.length} reports shown
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Map Container */}
            <div className="h-96 lg:h-[600px] bg-muted rounded-lg relative overflow-hidden border-2 border-dashed border-border">
              {/* Simulated Map Background */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/mumbai-satellite-view-from-space-showing-coastline.jpg')",
                }}
              >
                <div className="absolute inset-0 bg-blue-900 bg-opacity-20" />

                {/* Report Markers */}
                {filteredReports.map((report, index) => {
                  const isVisible = layers.find((l) => l.id === report.status)?.visible
                  if (!isVisible) return null

                  return (
                    <div
                      key={report.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
                      style={{
                        left: `${20 + index * 15}%`,
                        top: `${25 + index * 12}%`,
                      }}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="relative group">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse"
                          style={{ backgroundColor: getSeverityColor(report.severity) }}
                        >
                          <AlertTriangle className="h-3 w-3 text-white" />
                        </div>

                        {report.status === "verified" && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
                        )}

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 max-w-48">
                          <div className="font-semibold">{report.location}</div>
                          <div>
                            {report.type.replace("_", " ")} - {report.severity}
                          </div>
                          <div className="text-gray-300">{report.description.slice(0, 50)}...</div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 space-y-2">
                  <div className="text-xs font-semibold">Severity Levels</div>
                  {["critical", "high", "medium", "low"].map((severity) => (
                    <div key={severity} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getSeverityColor(severity) }} />
                      <span className="capitalize">{severity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <div className="space-y-4">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-card-foreground">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium">Severity</label>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Map Layers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-card-foreground">
              <Layers className="h-4 w-4" />
              Map Layers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {layers.map((layer) => (
              <div key={layer.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }} />
                  <span className="text-sm">{layer.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {layer.count}
                  </Badge>
                </div>
                <Switch checked={layer.visible} onCheckedChange={() => toggleLayer(layer.id)} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-card-foreground">
              <Clock className="h-4 w-4" />
              Recent Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-64 overflow-y-auto">
            {filteredReports.slice(0, 5).map((report) => (
              <div
                key={report.id}
                className="p-2 border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{report.id}</span>
                  <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-1">{report.location}</div>
                <div className="text-xs text-card-foreground truncate">{report.description}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                Report Details - {selectedReport.id}
                <Badge className={getStatusColor(selectedReport.status)}>{selectedReport.status}</Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <p className="text-sm text-muted-foreground">{selectedReport.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <p className="text-sm text-muted-foreground capitalize">{selectedReport.type.replace("_", " ")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Severity</label>
                  <Badge
                    className="text-xs"
                    style={{
                      backgroundColor: getSeverityColor(selectedReport.severity),
                      color: "white",
                    }}
                  >
                    {selectedReport.severity.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Confidence</label>
                  <p className="text-sm text-muted-foreground">{selectedReport.confidence}%</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedReport.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Reporter</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.reporter} ({selectedReport.reporterType})
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Estimated Affected</label>
                  <p className="text-sm text-muted-foreground">{selectedReport.estimatedAffected} people</p>
                </div>
              </div>

              {selectedReport.assignedTeam && (
                <div>
                  <label className="text-sm font-medium">Assigned Team</label>
                  <p className="text-sm text-muted-foreground">{selectedReport.assignedTeam}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {selectedReport.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleReportAction(selectedReport.id, "verify")}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReportAction(selectedReport.id, "investigate")}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      Investigate
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReportAction(selectedReport.id, "false_alarm")}
                      className="flex items-center gap-1"
                    >
                      <XCircle className="h-4 w-4" />
                      False Alarm
                    </Button>
                  </>
                )}

                {selectedReport.status === "investigating" && (
                  <Button
                    size="sm"
                    onClick={() => handleReportAction(selectedReport.id, "verify")}
                    className="flex items-center gap-1"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Confirm Verified
                  </Button>
                )}

                <Button size="sm" variant="outline" className="flex items-center gap-1 bg-transparent">
                  <Navigation className="h-4 w-4" />
                  Navigate
                </Button>

                <Button size="sm" variant="outline" className="flex items-center gap-1 bg-transparent">
                  <Phone className="h-4 w-4" />
                  Contact Team
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
