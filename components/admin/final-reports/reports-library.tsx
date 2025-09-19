"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Download, Eye, Edit, Archive, Search } from "lucide-react"
import { useState } from "react"

interface FinalReport {
  id: string
  title: string
  incidentId: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  status: "draft" | "review" | "approved" | "published" | "archived"
  createdBy: string
  createdAt: Date
  lastModified: Date
  classification: "public" | "internal" | "restricted" | "confidential"
  pageCount: number
  downloadCount: number
  tags: string[]
}

export function ReportsLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  const reports: FinalReport[] = [
    {
      id: "FR-001",
      title: "Mumbai Port Oil Spill Emergency - Comprehensive Analysis",
      incidentId: "INC-2025-001",
      type: "oil_spill",
      severity: "critical",
      status: "published",
      createdBy: "Dr. Sharma",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      classification: "internal",
      pageCount: 24,
      downloadCount: 45,
      tags: ["oil_spill", "environmental", "emergency_response", "mumbai"],
    },
    {
      id: "FR-002",
      title: "Chennai Marina High Wave Alert - Response Assessment",
      incidentId: "INC-2025-002",
      type: "high_waves",
      severity: "high",
      status: "approved",
      createdBy: "Coastal Safety Team",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 12 * 60 * 60 * 1000),
      classification: "public",
      pageCount: 16,
      downloadCount: 23,
      tags: ["high_waves", "beach_safety", "public_warning", "chennai"],
    },
    {
      id: "FR-003",
      title: "Kochi Storm Surge Event - Technical Analysis",
      incidentId: "INC-2025-003",
      type: "storm_surge",
      severity: "critical",
      status: "review",
      createdBy: "Weather Analysis Team",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000),
      classification: "internal",
      pageCount: 32,
      downloadCount: 12,
      tags: ["storm_surge", "weather", "technical_analysis", "kochi"],
    },
    {
      id: "FR-004",
      title: "Goa Beach Debris Incident - Environmental Impact",
      incidentId: "INC-2025-004",
      type: "debris",
      severity: "medium",
      status: "draft",
      createdBy: "Environmental Team",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 1 * 60 * 60 * 1000),
      classification: "public",
      pageCount: 12,
      downloadCount: 5,
      tags: ["debris", "environmental", "pollution", "goa"],
    },
    {
      id: "FR-005",
      title: "Visakhapatnam Chemical Pollution - Emergency Response",
      incidentId: "INC-2025-005",
      type: "pollution",
      severity: "high",
      status: "published",
      createdBy: "Chemical Response Unit",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      classification: "restricted",
      pageCount: 28,
      downloadCount: 67,
      tags: ["chemical_pollution", "emergency", "industrial", "visakhapatnam"],
    },
  ]

  const filteredReports = reports.filter((report) => {
    const searchMatch =
      searchQuery === "" ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const statusMatch = filterStatus === "all" || report.status === filterStatus
    const typeMatch = filterType === "all" || report.type === filterType

    return searchMatch && statusMatch && typeMatch
  })

  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title)
      case "downloads":
        return b.downloadCount - a.downloadCount
      case "date":
      default:
        return b.createdAt.getTime() - a.createdAt.getTime()
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200"
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "archived":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

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

  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case "confidential":
        return "🔒"
      case "restricted":
        return "⚠️"
      case "internal":
        return "🏢"
      case "public":
      default:
        return "🌐"
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground">Reports Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Search Reports</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search title, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="oil_spill">Oil Spill</SelectItem>
                  <SelectItem value="high_waves">High Waves</SelectItem>
                  <SelectItem value="storm_surge">Storm Surge</SelectItem>
                  <SelectItem value="debris">Debris</SelectItem>
                  <SelectItem value="pollution">Pollution</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Latest First</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="downloads">Most Downloaded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Final Reports</h2>
          <Badge variant="outline">{sortedReports.length} reports found</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedReports.map((report) => (
            <Card key={report.id} className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-card-foreground line-clamp-2">{report.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(report.status)}>{report.status.toUpperCase()}</Badge>
                      <Badge className={getSeverityColor(report.severity)}>{report.severity.toUpperCase()}</Badge>
                      <span className="text-xs text-muted-foreground">#{report.incidentId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg">{getClassificationIcon(report.classification)}</span>
                    <span className="text-xs text-muted-foreground capitalize">{report.classification}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Created by:</span>
                    <p className="font-medium">{report.createdBy}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pages:</span>
                    <p className="font-medium">{report.pageCount}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    <p className="font-medium">{formatDate(report.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Downloads:</span>
                    <p className="font-medium">{report.downloadCount}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {report.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag.replace("_", " ")}
                    </Badge>
                  ))}
                  {report.tags.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{report.tags.length - 4} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="flex items-center gap-1 bg-transparent">
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{report.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Incident ID:</span> {report.incidentId}
                          </div>
                          <div>
                            <span className="font-medium">Type:</span> {report.type.replace("_", " ")}
                          </div>
                          <div>
                            <span className="font-medium">Severity:</span> {report.severity}
                          </div>
                          <div>
                            <span className="font-medium">Classification:</span> {report.classification}
                          </div>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm">
                            This is a preview of the final report. The complete document contains detailed analysis,
                            response actions, and recommendations based on the incident investigation.
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button size="sm" variant="outline" className="flex items-center gap-1 bg-transparent">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>

                  {report.status === "draft" && (
                    <Button size="sm" variant="outline" className="flex items-center gap-1 bg-transparent">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  )}

                  {report.status === "published" && (
                    <Button size="sm" variant="outline" className="flex items-center gap-1 bg-transparent">
                      <Archive className="h-4 w-4" />
                      Archive
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
