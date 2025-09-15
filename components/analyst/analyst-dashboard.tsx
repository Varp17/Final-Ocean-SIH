"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Brain, MapPin, MessageSquare, CheckCircle, XCircle } from "lucide-react"
import { LiveInteractiveMap } from "@/components/maps/live-interactive-map"
import { SocialMediaFeed } from "@/components/social-media-feed"
import { ComprehensiveAnalytics } from "@/components/comprehensive-analytics"
import { RealTimeWidgets } from "./real-time-widgets"
import { LiveReportsManagement } from "./live-reports-management"
import { ModelProcessPipeline } from "./model-process-pipeline"
import { FinalReportsGeneration } from "./final-reports-generation"
import { AuditHistoryTracking } from "./audit-history-tracking"

export function AnalystDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userRole] = useState<"citizen" | "admin" | "analyst">("analyst")

  // Mock analytics data
  const [analyticsData] = useState({
    totalReports: 1247,
    verifiedReports: 892,
    mlConfidence: 87.3,
    socialMentions: 2341,
    hotspots: 15,
    sentimentScore: 0.72,
  })

  const [pendingVerification] = useState([
    {
      id: "1",
      type: "flood",
      location: "Mumbai Coast",
      confidence: 0.89,
      socialCorroboration: 12,
      time: "5 min ago",
      priority: "high",
    },
    {
      id: "2",
      type: "high_waves",
      location: "Chennai Marina",
      confidence: 0.76,
      socialCorroboration: 8,
      time: "12 min ago",
      priority: "medium",
    },
    {
      id: "3",
      type: "oil_spill",
      location: "Kochi Port",
      confidence: 0.94,
      socialCorroboration: 23,
      time: "18 min ago",
      priority: "high",
    },
  ])

  const [mlMetrics] = useState({
    textClassification: 89.2,
    imageAnalysis: 91.7,
    sentimentAnalysis: 85.4,
    locationExtraction: 93.1,
    threatAssessment: 87.8,
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
                        className="flex items-start sm:items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg gap-3"
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
    </div>
  )
}
