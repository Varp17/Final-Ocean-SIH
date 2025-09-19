"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  BarChart3,
  Brain,
  MapPin,
  MessageSquare,
  CheckCircle,
  XCircle,
  Activity,
  Eye,
  Calendar,
  User,
  AlertTriangle,
  TrendingUp,
} from "lucide-react"
import { LiveInteractiveMap } from "@/components/maps/live-interactive-map"
import { SocialMediaFeed } from "@/components/social-media-feed"
import { ComprehensiveAnalytics } from "@/components/comprehensive-analytics"
import { RealTimeWidgets } from "./real-time-widgets"
import { LiveReportsManagement } from "./live-reports-management"
import { ModelProcessPipeline } from "./model-process-pipeline"
import { FinalReportsGeneration } from "./final-reports-generation"
import { AuditHistoryTracking } from "./audit-history-tracking"

interface PendingReport {
  id: string
  type: string
  location: string
  confidence: number
  socialCorroboration: number
  time: string
  priority: string
  description: string
  reporter: string
  coordinates: { lat: number; lng: number }
  images: string[]
  socialMentions: Array<{
    platform: string
    content: string
    timestamp: string
    engagement: number
  }>
  mlAnalysis: {
    threatLevel: string
    keywords: string[]
    sentiment: number
    reliability: number
  }
}

export function AnalystDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userRole] = useState<"citizen" | "admin" | "analyst">("analyst")
  const [selectedReport, setSelectedReport] = useState<PendingReport | null>(null)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const [analyticsData] = useState({
    totalReports: 1247,
    verifiedReports: 892,
    mlConfidence: 87.3,
    socialMentions: 2341,
    hotspots: 15,
    sentimentScore: 0.72,
  })

  const [pendingVerification] = useState<PendingReport[]>([
    {
      id: "1",
      type: "flood",
      location: "Mumbai Coast",
      confidence: 0.89,
      socialCorroboration: 12,
      time: "5 min ago",
      priority: "high",
      description:
        "Severe flooding reported along Mumbai coastline due to high tide and heavy rainfall. Water levels have risen significantly, affecting nearby residential areas and causing traffic disruptions.",
      reporter: "Mumbai Coastal Guard",
      coordinates: { lat: 19.076, lng: 72.8777 },
      images: ["/mumbai-flood-coastline.jpg", "/flooded-street-mumbai.jpg"],
      socialMentions: [
        {
          platform: "Twitter",
          content: "Massive flooding at Mumbai coast! Water everywhere, please avoid the area. #MumbaiFloods",
          timestamp: "3 min ago",
          engagement: 45,
        },
        {
          platform: "Instagram",
          content: "Can't believe how bad the flooding is here. Stay safe everyone! 🌊",
          timestamp: "7 min ago",
          engagement: 23,
        },
      ],
      mlAnalysis: {
        threatLevel: "High",
        keywords: ["flood", "water", "danger", "evacuation"],
        sentiment: -0.7,
        reliability: 0.92,
      },
    },
    {
      id: "2",
      type: "high_waves",
      location: "Chennai Marina",
      confidence: 0.76,
      socialCorroboration: 8,
      time: "12 min ago",
      priority: "medium",
      description:
        "Unusually high waves observed at Marina Beach, Chennai. Wave heights reaching 3-4 meters, posing risk to beachgoers and fishing activities.",
      reporter: "Chennai Port Authority",
      coordinates: { lat: 13.0827, lng: 80.2707 },
      images: ["/high-waves-chennai-marina-beach.jpg"],
      socialMentions: [
        {
          platform: "Facebook",
          content:
            "Huge waves at Marina Beach today! Beautiful but dangerous. Beach authorities have put up warning signs.",
          timestamp: "10 min ago",
          engagement: 18,
        },
      ],
      mlAnalysis: {
        threatLevel: "Medium",
        keywords: ["waves", "high", "beach", "warning"],
        sentiment: -0.3,
        reliability: 0.78,
      },
    },
    {
      id: "3",
      type: "oil_spill",
      location: "Kochi Port",
      confidence: 0.94,
      socialCorroboration: 23,
      time: "18 min ago",
      priority: "high",
      description:
        "Major oil spill detected near Kochi Port affecting marine life and coastal ecosystem. Immediate containment measures required to prevent further environmental damage.",
      reporter: "Environmental Protection Agency",
      coordinates: { lat: 9.9312, lng: 76.2673 },
      images: ["/oil-spill-kochi-port.jpg", "/oil-contaminated-water.jpg"],
      socialMentions: [
        {
          platform: "Twitter",
          content:
            "Oil spill at Kochi port is devastating! Marine life is in danger. Immediate action needed! #SaveOurOceans",
          timestamp: "15 min ago",
          engagement: 67,
        },
        {
          platform: "Instagram",
          content: "Heartbreaking to see the oil spill damage at Kochi. We need to protect our marine ecosystem! 🐟💔",
          timestamp: "20 min ago",
          engagement: 34,
        },
      ],
      mlAnalysis: {
        threatLevel: "Critical",
        keywords: ["oil", "spill", "environmental", "marine", "damage"],
        sentiment: -0.8,
        reliability: 0.95,
      },
    },
  ])

  const [mlMetrics] = useState({
    floodDetectionModel: 92,
    waveHeightModel: 85,
    oilSpillModel: 90,
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const handleReportClick = (report: PendingReport) => {
    setSelectedReport(report)
    setIsReportModalOpen(true)
  }

  const getThreatLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "critical":
        return "text-red-600 bg-red-50"
      case "high":
        return "text-orange-600 bg-orange-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Atlas Alert - Analyst Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">AI-Powered Threat Analysis & Verification</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs sm:text-sm">
              <Brain className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">ML Models Active</span>
              <span className="sm:hidden">ML Active</span>
            </Badge>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm bg-transparent">
              <span className="hidden sm:inline">Export Data</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="w-full overflow-x-auto">
            <TabsList className="grid grid-cols-8 w-full min-w-[800px] sm:min-w-0 h-auto">
              <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-4">
                <span className="hidden sm:inline">Overview</span>
                <span className="sm:hidden">Home</span>
              </TabsTrigger>
              <TabsTrigger value="verification" className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-4">
                <span className="hidden sm:inline">Live Reports</span>
                <span className="sm:hidden">Reports</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-4">
                <span className="hidden sm:inline">Social Analysis</span>
                <span className="sm:hidden">Social</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-4">
                <span className="hidden sm:inline">Hotspot Map</span>
                <span className="sm:hidden">Map</span>
              </TabsTrigger>
              <TabsTrigger value="ml" className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-4">
                <span className="hidden sm:inline">Model Process</span>
                <span className="sm:hidden">ML</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-4">
                <span className="hidden sm:inline">Final Reports</span>
                <span className="sm:hidden">Final</span>
              </TabsTrigger>
              <TabsTrigger value="audit" className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-4">
                <span className="hidden sm:inline">Audit & History</span>
                <span className="sm:hidden">Audit</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-4">
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <RealTimeWidgets />

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total Reports</CardTitle>
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">{analyticsData.totalReports.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+23% from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">ML Confidence</CardTitle>
                  <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">{analyticsData.mlConfidence}%</div>
                  <p className="text-xs text-muted-foreground">Average model accuracy</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Social Mentions</CardTitle>
                  <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">{analyticsData.socialMentions.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Disaster-related posts</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Active Hotspots</CardTitle>
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">{analyticsData.hotspots}</div>
                  <p className="text-xs text-muted-foreground">Detected clusters</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm sm:text-base">Verification Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">
                    {Math.round((analyticsData.verifiedReports / analyticsData.totalReports) * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">{analyticsData.verifiedReports} verified</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm sm:text-base">Sentiment Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">{analyticsData.sentimentScore.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Public concern level</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm sm:text-base">Pending Verification Queue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 sm:space-y-3">
                    {pendingVerification.slice(0, 3).map((report) => (
                      <div
                        key={report.id}
                        className="flex items-start sm:items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg gap-3 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleReportClick(report)}
                      >
                        <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-1 sm:mt-0 flex-shrink-0 ${getPriorityColor(report.priority)}`}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium capitalize text-xs sm:text-sm">{report.type.replace("_", " ")}</p>
                            <p className="text-xs text-gray-600 truncate">{report.location}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-gray-500 mt-1">
                              <span>Confidence: {Math.round(report.confidence * 100)}%</span>
                              <span className="hidden sm:inline">•</span>
                              <span>{report.socialCorroboration} social mentions</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleReportClick(report)
                            }}
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                            <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-3 sm:mt-4 bg-transparent text-xs sm:text-sm" variant="outline">
                    View All Pending ({pendingVerification.length})
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm sm:text-base">ML Model Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 sm:space-y-3">
                    {Object.entries(mlMetrics).map(([model, accuracy]) => (
                      <div key={model} className="flex items-center justify-between gap-3">
                        <span className="text-xs sm:text-sm capitalize flex-1 min-w-0 truncate">
                          {model.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-1.5 sm:h-2">
                            <div className="bg-blue-600 h-1.5 sm:h-2 rounded-full" style={{ width: `${accuracy}%` }} />
                          </div>
                          <span className="text-xs sm:text-sm font-medium w-10 text-right">{accuracy}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verification">
            <LiveReportsManagement />
          </TabsContent>

          <TabsContent value="social">
            <SocialMediaFeed />
          </TabsContent>

          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm sm:text-base lg:text-lg">
                  Hotspot Detection & Clustering Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-64 sm:h-80 lg:h-96 xl:h-[600px]">
                  <LiveInteractiveMap userRole={userRole} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ml">
            <ModelProcessPipeline />
          </TabsContent>

          <TabsContent value="reports">
            <FinalReportsGeneration />
          </TabsContent>

          <TabsContent value="audit">
            <AuditHistoryTracking />
          </TabsContent>

          <TabsContent value="analytics">
            <ComprehensiveAnalytics />
          </TabsContent>
        </Tabs>
      </div>

      {/* Comprehensive report detail modal with tabbed content */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Report Details - {selectedReport?.type.replace("_", " ").toUpperCase()}
            </DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              {/* Report Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{selectedReport.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedReport.reporter}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedReport.time}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`${getPriorityColor(selectedReport.priority)} text-white`}>
                      {selectedReport.priority.toUpperCase()} PRIORITY
                    </Badge>
                    <Badge className={getThreatLevelColor(selectedReport.mlAnalysis.threatLevel)}>
                      {selectedReport.mlAnalysis.threatLevel} Threat
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Confidence: {Math.round(selectedReport.confidence * 100)}% | Reliability:{" "}
                    {Math.round(selectedReport.mlAnalysis.reliability * 100)}%
                  </div>
                </div>
              </div>

              {/* Report Description */}
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedReport.description}</p>
              </div>

              {/* Tabbed Content */}
              <Tabs defaultValue="analysis" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="analysis">ML Analysis</TabsTrigger>
                  <TabsTrigger value="social">Social Media</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="images">Media</TabsTrigger>
                </TabsList>

                <TabsContent value="analysis" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Sentiment Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${selectedReport.mlAnalysis.sentiment < -0.5 ? "bg-red-500" : selectedReport.mlAnalysis.sentiment < 0 ? "bg-yellow-500" : "bg-green-500"}`}
                              style={{ width: `${Math.abs(selectedReport.mlAnalysis.sentiment) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{selectedReport.mlAnalysis.sentiment.toFixed(2)}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Keywords Detected</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {selectedReport.mlAnalysis.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="social" className="space-y-4">
                  <div className="space-y-3">
                    {selectedReport.socialMentions.map((mention, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {mention.platform}
                                </Badge>
                                <span className="text-xs text-gray-500">{mention.timestamp}</span>
                              </div>
                              <p className="text-sm">{mention.content}</p>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <TrendingUp className="h-3 w-3" />
                              {mention.engagement}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="location" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Coordinates</h4>
                      <p className="text-sm text-gray-600">
                        Lat: {selectedReport.coordinates.lat}
                        <br />
                        Lng: {selectedReport.coordinates.lng}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Location Details</h4>
                      <p className="text-sm text-gray-600">{selectedReport.location}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="images" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedReport.images.map((image, index) => (
                      <div key={index} className="bg-gray-100 rounded-lg p-4 text-center">
                        <div className="text-sm text-gray-500 mb-2">Image {index + 1}</div>
                        <div className="text-xs text-gray-400">{image}</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1 bg-transparent" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Report
                </Button>
                <Button className="flex-1 bg-transparent" variant="outline">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Report
                </Button>
                <Button className="flex-1">
                  <Activity className="h-4 w-4 mr-2" />
                  Forward to Admin
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
