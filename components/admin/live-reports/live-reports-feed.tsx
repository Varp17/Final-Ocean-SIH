"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, User, CheckCircle, Eye, XCircle, Search } from "lucide-react"
import { useState } from "react"

interface ReportFeedItem {
  id: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  status: "pending" | "verified" | "investigating" | "resolved"
  location: string
  reporter: string
  reporterType: "citizen" | "authority" | "sensor"
  timestamp: Date
  description: string
  confidence: number
  images?: number
  assignedAnalyst?: string
}

export function LiveReportsFeed() {
  const [sortBy, setSortBy] = useState("timestamp")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const reports: ReportFeedItem[] = [
    {
      id: "RPT-001",
      type: "Oil Spill",
      severity: "critical",
      status: "verified",
      location: "Mumbai Port, Sector 7",
      reporter: "Port Authority",
      reporterType: "authority",
      timestamp: new Date(Date.now() - 5 * 60000),
      description: "Large oil spill detected near container terminal. Immediate containment required.",
      confidence: 95,
      images: 3,
      assignedAnalyst: "Dr. Sharma",
    },
    {
      id: "RPT-002",
      type: "High Waves",
      severity: "high",
      status: "investigating",
      location: "Chennai Marina Beach",
      reporter: "Beach Safety Officer",
      reporterType: "authority",
      timestamp: new Date(Date.now() - 12 * 60000),
      description: "Waves reaching 4-5 meters. Multiple swimmers reported in distress.",
      confidence: 88,
      images: 2,
      assignedAnalyst: "Analyst Team B",
    },
    {
      id: "RPT-003",
      type: "Debris Wash-up",
      severity: "medium",
      status: "pending",
      location: "Goa Anjuna Beach",
      reporter: "Tourist",
      reporterType: "citizen",
      timestamp: new Date(Date.now() - 18 * 60000),
      description: "Large amount of plastic debris washed ashore. Possible container spill.",
      confidence: 72,
      images: 1,
    },
    {
      id: "RPT-004",
      type: "Storm Surge",
      severity: "critical",
      status: "verified",
      location: "Kochi Backwaters",
      reporter: "Weather Station",
      reporterType: "sensor",
      timestamp: new Date(Date.now() - 25 * 60000),
      description: "Unusual water level rise detected. Storm surge approaching coastal areas.",
      confidence: 92,
      assignedAnalyst: "Dr. Patel",
    },
    {
      id: "RPT-005",
      type: "Chemical Pollution",
      severity: "high",
      status: "pending",
      location: "Visakhapatnam Port",
      reporter: "Environmental Monitor",
      reporterType: "authority",
      timestamp: new Date(Date.now() - 35 * 60000),
      description: "Chemical discharge detected in port waters. pH levels abnormal.",
      confidence: 85,
      images: 2,
    },
    {
      id: "RPT-006",
      type: "Marine Life Distress",
      severity: "medium",
      status: "resolved",
      location: "Mangalore Coast",
      reporter: "Fisherman",
      reporterType: "citizen",
      timestamp: new Date(Date.now() - 45 * 60000),
      description: "Dead fish washing ashore. Possible pollution-related incident.",
      confidence: 78,
      assignedAnalyst: "Marine Biologist",
    },
  ]

  const filteredReports = reports.filter((report) => {
    const statusMatch = filterStatus === "all" || report.status === filterStatus
    const searchMatch =
      searchQuery === "" ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase())

    return statusMatch && searchMatch
  })

  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case "severity":
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        return severityOrder[b.severity] - severityOrder[a.severity]
      case "confidence":
        return b.confidence - a.confidence
      case "timestamp":
      default:
        return b.timestamp.getTime() - a.timestamp.getTime()
    }
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
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

  const getReporterIcon = (type: string) => {
    switch (type) {
      case "authority":
        return "🏛️"
      case "sensor":
        return "📡"
      case "citizen":
      default:
        return "👤"
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return timestamp.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground">Reports Feed Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Search Reports</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search location, type, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Filter by Status</label>
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
              <label className="text-sm font-medium">Sort by</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timestamp">Latest First</SelectItem>
                  <SelectItem value="severity">Severity</SelectItem>
                  <SelectItem value="confidence">Confidence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Live Reports Feed</h2>
          <Badge variant="outline">{sortedReports.length} reports</Badge>
        </div>

        {sortedReports.map((report) => (
          <Card key={report.id} className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-card-foreground">{report.type}</h3>
                    <Badge className={getSeverityColor(report.severity)}>{report.severity.toUpperCase()}</Badge>
                    <Badge className={getStatusColor(report.status)}>{report.status.toUpperCase()}</Badge>
                    <span className="text-sm text-muted-foreground">#{report.id}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{report.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatTimestamp(report.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{getReporterIcon(report.reporterType)}</span>
                      <span>{report.reporter}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {report.confidence}% confidence
                  </Badge>
                  {report.images && (
                    <Badge variant="outline" className="text-xs">
                      {report.images} images
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-card-foreground leading-relaxed mb-4">{report.description}</p>

              {report.assignedAnalyst && (
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Assigned to: {report.assignedAnalyst}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                {report.status === "pending" && (
                  <>
                    <Button size="sm" className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Verify
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-1 bg-transparent">
                      <Eye className="h-4 w-4" />
                      Investigate
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-1 bg-transparent">
                      <XCircle className="h-4 w-4" />
                      False Alarm
                    </Button>
                  </>
                )}

                {report.status === "investigating" && (
                  <Button size="sm" className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Confirm Verified
                  </Button>
                )}

                <Button size="sm" variant="outline">
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  Assign Team
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
