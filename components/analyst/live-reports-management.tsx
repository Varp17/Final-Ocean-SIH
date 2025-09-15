"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Filter,
  Search,
  MapPin,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Send,
  Eye,
  AlertTriangle,
  MessageSquare,
  ImageIcon,
  Phone,
  Globe,
} from "lucide-react"

interface Report {
  id: string
  source: "Social Media" | "Website" | "WhatsApp" | "Voice Call"
  status: "AI Verified" | "Pending Analyst" | "Under Processing" | "Rejected"
  hazardType: "Flood" | "Tsunami" | "High Waves" | "Oil Spill" | "Cyclone" | "Storm Surge"
  time: string
  userId: string
  userTag: string
  location: string
  sentiment: "Fear" | "Panic" | "Neutral" | "Positive"
  confidence: number
  socialCorroboration: number
  description: string
  media?: string[]
  audioTranscript?: string
  similarReports: number
  priority: "high" | "medium" | "low"
}

interface ReportDetail {
  userInput: string
  sentimentAnalysis: {
    fear: number
    panic: number
    neutral: number
    positive: number
  }
  location: {
    coordinates: [number, number]
    address: string
  }
  similarReports: Array<{
    id: string
    similarity: number
    location: string
    time: string
  }>
}

export function LiveReportsManagement() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: "RPT-2025-001",
      source: "Social Media",
      status: "AI Verified",
      hazardType: "High Waves",
      time: "2 min ago",
      userId: "@coastal_watcher",
      userTag: "Twitter",
      location: "Mumbai Coast",
      sentiment: "Fear",
      confidence: 89,
      socialCorroboration: 12,
      description: "Massive waves hitting the shore, people evacuating",
      media: ["wave_video.mp4", "evacuation_photo.jpg"],
      similarReports: 5,
      priority: "high",
    },
    {
      id: "RPT-2025-002",
      source: "Website",
      status: "Pending Analyst",
      hazardType: "Flood",
      time: "5 min ago",
      userId: "citizen_123",
      userTag: "Registered User",
      location: "Chennai Marina",
      sentiment: "Panic",
      confidence: 76,
      socialCorroboration: 8,
      description: "Water levels rising rapidly near the beach area",
      similarReports: 3,
      priority: "high",
    },
    {
      id: "RPT-2025-003",
      source: "WhatsApp",
      status: "Under Processing",
      hazardType: "Oil Spill",
      time: "12 min ago",
      userId: "+91-9876543210",
      userTag: "WhatsApp User",
      location: "Kochi Port",
      sentiment: "Neutral",
      confidence: 94,
      socialCorroboration: 23,
      description: "Black substance floating on water surface",
      media: ["oil_spill_image.jpg"],
      similarReports: 8,
      priority: "medium",
    },
    {
      id: "RPT-2025-004",
      source: "Voice Call",
      status: "AI Verified",
      hazardType: "Tsunami",
      time: "18 min ago",
      userId: "Emergency Caller",
      userTag: "Hotline",
      location: "Vizag Coast",
      sentiment: "Fear",
      confidence: 92,
      socialCorroboration: 45,
      description: "Unusual water recession observed, animals fleeing",
      audioTranscript:
        "Hello, I'm calling from Vizag beach. The water has gone back very far and animals are running away from the shore. This looks very dangerous.",
      similarReports: 12,
      priority: "high",
    },
  ])

  const [filteredReports, setFilteredReports] = useState<Report[]>(reports)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [reportDetail, setReportDetail] = useState<ReportDetail | null>(null)

  // Filter states
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [hazardFilter, setHazardFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Apply filters
  useEffect(() => {
    let filtered = reports

    if (sourceFilter !== "all") {
      filtered = filtered.filter((report) => report.source === sourceFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter)
    }

    if (hazardFilter !== "all") {
      filtered = filtered.filter((report) => report.hazardType === hazardFilter)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (report) =>
          report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.userId.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredReports(filtered)
  }, [sourceFilter, statusFilter, hazardFilter, searchQuery, reports])

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "Social Media":
        return <MessageSquare className="h-4 w-4" />
      case "Website":
        return <Globe className="h-4 w-4" />
      case "WhatsApp":
        return <MessageSquare className="h-4 w-4" />
      case "Voice Call":
        return <Phone className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AI Verified":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            ✅ AI Verified
          </Badge>
        )
      case "Pending Analyst":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            ⏳ Pending Review
          </Badge>
        )
      case "Under Processing":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            🔄 Processing
          </Badge>
        )
      case "Rejected":
        return <Badge variant="destructive">❌ Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Fear":
        return "text-red-600"
      case "Panic":
        return "text-red-800"
      case "Neutral":
        return "text-gray-600"
      case "Positive":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-500"
    }
  }

  const handleReportAction = (reportId: string, action: "verify" | "reject" | "send_to_admin") => {
    setReports((prev) =>
      prev.map((report) => {
        if (report.id === reportId) {
          switch (action) {
            case "verify":
              return { ...report, status: "AI Verified" as const }
            case "reject":
              return { ...report, status: "Rejected" as const }
            case "send_to_admin":
              // This would typically send to admin dashboard
              console.log(`Sending report ${reportId} to admin`)
              return report
            default:
              return report
          }
        }
        return report
      }),
    )
  }

  const openReportDetail = (report: Report) => {
    setSelectedReport(report)
    // Mock detailed data
    setReportDetail({
      userInput: report.description,
      sentimentAnalysis: {
        fear: report.sentiment === "Fear" ? 70 : 20,
        panic: report.sentiment === "Panic" ? 60 : 15,
        neutral: report.sentiment === "Neutral" ? 80 : 30,
        positive: report.sentiment === "Positive" ? 75 : 10,
      },
      location: {
        coordinates: [19.076, 72.8777], // Mumbai coordinates as example
        address: report.location,
      },
      similarReports: [
        { id: "RPT-2025-005", similarity: 85, location: "Nearby Coast", time: "1 hour ago" },
        { id: "RPT-2025-006", similarity: 72, location: "Adjacent Beach", time: "2 hours ago" },
        { id: "RPT-2025-007", similarity: 68, location: "Same District", time: "3 hours ago" },
      ],
    })
  }

  return (
    <div className="space-y-6">
      {/* Filters Sidebar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Source Filter */}
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Social Media">Social Media</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                <SelectItem value="Voice Call">Voice Call</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="AI Verified">AI Verified</SelectItem>
                <SelectItem value="Pending Analyst">Pending Analyst</SelectItem>
                <SelectItem value="Under Processing">Under Processing</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Hazard Type Filter */}
            <Select value={hazardFilter} onValueChange={setHazardFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Hazard Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hazards</SelectItem>
                <SelectItem value="Flood">Flood</SelectItem>
                <SelectItem value="Tsunami">Tsunami</SelectItem>
                <SelectItem value="High Waves">High Waves</SelectItem>
                <SelectItem value="Oil Spill">Oil Spill</SelectItem>
                <SelectItem value="Cyclone">Cyclone</SelectItem>
                <SelectItem value="Storm Surge">Storm Surge</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Live Reports ({filteredReports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className={`border-l-4 ${getPriorityColor(report.priority)} bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getSourceIcon(report.source)}
                          <span className="text-sm font-medium text-gray-600">{report.source}</span>
                        </div>
                        <Badge variant="outline">{report.hazardType}</Badge>
                        {getStatusBadge(report.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{report.time}</span>
                      </div>
                    </div>

                    {/* Content Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">{report.userId}</span>
                          <span className="text-xs text-gray-500">({report.userTag})</span>
                        </div>
                        <p className="text-sm text-gray-800 mb-2">{report.description}</p>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{report.location}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Confidence:</span>
                          <span className="font-medium">{report.confidence}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Sentiment:</span>
                          <span className={`font-medium ${getSentimentColor(report.sentiment)}`}>
                            {report.sentiment}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Social:</span>
                          <span className="font-medium">{report.socialCorroboration} mentions</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Similar:</span>
                          <span className="font-medium">{report.similarReports} reports</span>
                        </div>
                      </div>
                    </div>

                    {/* Media Indicators */}
                    {(report.media || report.audioTranscript) && (
                      <div className="flex items-center gap-2">
                        {report.media && (
                          <div className="flex items-center gap-1 text-xs text-blue-600">
                            <ImageIcon className="h-3 w-3" />
                            {report.media.length} media files
                          </div>
                        )}
                        {report.audioTranscript && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <Phone className="h-3 w-3" />
                            Audio transcript available
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => openReportDetail(report)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-[600px] sm:w-[800px]">
                        <SheetHeader>
                          <SheetTitle>Report Details - {selectedReport?.id}</SheetTitle>
                          <SheetDescription>Comprehensive analysis and verification details</SheetDescription>
                        </SheetHeader>

                        {selectedReport && reportDetail && (
                          <div className="mt-6 space-y-6">
                            <Tabs defaultValue="content" className="w-full">
                              <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="content">Content</TabsTrigger>
                                <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                                <TabsTrigger value="location">Location</TabsTrigger>
                                <TabsTrigger value="similar">Similar</TabsTrigger>
                              </TabsList>

                              <TabsContent value="content" className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">User Input</h4>
                                  <p className="text-sm bg-gray-50 p-3 rounded">{reportDetail.userInput}</p>
                                </div>

                                {selectedReport.audioTranscript && (
                                  <div>
                                    <h4 className="font-medium mb-2">Audio Transcript</h4>
                                    <p className="text-sm bg-blue-50 p-3 rounded">{selectedReport.audioTranscript}</p>
                                  </div>
                                )}

                                {selectedReport.media && (
                                  <div>
                                    <h4 className="font-medium mb-2">Media Files</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                      {selectedReport.media.map((file, index) => (
                                        <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                                          {file}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </TabsContent>

                              <TabsContent value="sentiment" className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-4">Sentiment Analysis</h4>
                                  <div className="space-y-3">
                                    {Object.entries(reportDetail.sentimentAnalysis).map(([emotion, score]) => (
                                      <div key={emotion} className="flex items-center justify-between">
                                        <span className="capitalize text-sm">{emotion}</span>
                                        <div className="flex items-center gap-2">
                                          <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div
                                              className="bg-blue-600 h-2 rounded-full"
                                              style={{ width: `${score}%` }}
                                            />
                                          </div>
                                          <span className="text-sm font-medium w-8">{score}%</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent value="location" className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Location Details</h4>
                                  <div className="bg-gray-50 p-4 rounded space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-600">Address:</span>
                                      <span className="text-sm font-medium">{reportDetail.location.address}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-600">Coordinates:</span>
                                      <span className="text-sm font-medium">
                                        {reportDetail.location.coordinates[0]}, {reportDetail.location.coordinates[1]}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="h-48 bg-gray-200 rounded flex items-center justify-center">
                                    <span className="text-gray-500">Map Preview</span>
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent value="similar" className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-4">Similar Reports</h4>
                                  <div className="space-y-3">
                                    {reportDetail.similarReports.map((similar) => (
                                      <div
                                        key={similar.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded"
                                      >
                                        <div>
                                          <div className="font-medium text-sm">{similar.id}</div>
                                          <div className="text-xs text-gray-600">
                                            {similar.location} • {similar.time}
                                          </div>
                                        </div>
                                        <Badge variant="outline">{similar.similarity}% match</Badge>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>
                        )}
                      </SheetContent>
                    </Sheet>

                    {report.status === "Pending Analyst" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700 bg-transparent"
                          onClick={() => handleReportAction(report.id, "verify")}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => handleReportAction(report.id, "reject")}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 hover:text-blue-700 bg-transparent"
                      onClick={() => handleReportAction(report.id, "send_to_admin")}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
