"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Activity, MapPin, TrendingUp, Search, Filter, RefreshCw } from "lucide-react"
import { useMLAnalysis } from "@/lib/hooks/use-ml-analysis"
import { SocialMediaFeed } from "@/components/social-media-feed"
import { ThreatMap } from "@/components/threat-map"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { ReportsList } from "@/components/reports-list"

export function AnalystDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { isAnalyzing } = useMLAnalysis()

  // Mock data for demonstration
  const [dashboardStats, setDashboardStats] = useState({
    activeThreats: 12,
    socialMentions: 847,
    verifiedReports: 34,
    affectedAreas: 8,
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">Analyst Dashboard</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Ocean Hazard Intelligence & Social Media Analytics
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent flex-1 sm:flex-none text-xs sm:text-sm"
            >
              <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">Live Monitoring</span>
              <span className="sm:hidden">Live</span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Active Threats</CardTitle>
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-red-600">{dashboardStats.activeThreats}</div>
              <p className="text-xs text-slate-600">+3 from last hour</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Social Mentions</CardTitle>
              <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-blue-600">{dashboardStats.socialMentions}</div>
              <p className="text-xs text-slate-600">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Verified Reports</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-emerald-600">{dashboardStats.verifiedReports}</div>
              <p className="text-xs text-slate-600">95% accuracy rate</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Affected Areas</CardTitle>
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-amber-600">{dashboardStats.affectedAreas}</div>
              <p className="text-xs text-slate-600">Coastal regions</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                <Input
                  placeholder="Search reports, locations, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 sm:pl-10 text-sm"
                />
              </div>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 sm:py-2.5">
              Overview
            </TabsTrigger>
            <TabsTrigger value="social" className="text-xs sm:text-sm py-2 sm:py-2.5">
              <span className="hidden sm:inline">Social Media</span>
              <span className="sm:hidden">Social</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="text-xs sm:text-sm py-2 sm:py-2.5">
              <span className="hidden sm:inline">Threat Map</span>
              <span className="sm:hidden">Map</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2 sm:py-2.5">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm sm:text-base">Recent Reports</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Latest verified hazard reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <ReportsList limit={5} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm sm:text-base">Threat Assessment</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">AI-powered risk analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium">Overall Threat Level</span>
                      <Badge variant="destructive" className="text-xs">
                        HIGH
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Cyclone Activity</span>
                        <span className="text-red-600">85%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 sm:h-2">
                        <div className="bg-red-500 h-1.5 sm:h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Storm Surge Risk</span>
                        <span className="text-amber-600">65%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 sm:h-2">
                        <div className="bg-amber-500 h-1.5 sm:h-2 rounded-full" style={{ width: "65%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Coastal Flooding</span>
                        <span className="text-yellow-600">45%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 sm:h-2">
                        <div className="bg-yellow-500 h-1.5 sm:h-2 rounded-full" style={{ width: "45%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="social">
            <SocialMediaFeed searchQuery={searchQuery} severityFilter={filterSeverity} />
          </TabsContent>

          <TabsContent value="map">
            <ThreatMap />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsCharts />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
