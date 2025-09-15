"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  Users,
  MapPin,
  Zap,
  Database,
  Wifi,
  Clock,
  Target,
  Brain,
  MessageSquare,
} from "lucide-react"

interface AnalyticsData {
  overview: any
  realTimeMetrics: any
  geographicData: any
  trendAnalysis: any
  mlPerformance: any
  systemHealth: any
}

export function ComprehensiveAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchAnalyticsData()
    const interval = setInterval(fetchAnalyticsData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch("/api/analytics/dashboard")
      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      console.error("[Analytics] Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      {/* Real-time Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reports (1h)</p>
                <p className="text-2xl font-bold text-blue-600">{analyticsData.realTimeMetrics.reportsLastHour}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Social Mentions</p>
                <p className="text-2xl font-bold text-green-600">{analyticsData.realTimeMetrics.socialMediaMentions}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emergency Alerts</p>
                <p className="text-2xl font-bold text-red-600">{analyticsData.realTimeMetrics.emergencyAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Users Online</p>
                <p className="text-2xl font-bold text-purple-600">{analyticsData.realTimeMetrics.usersOnline}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="ml">ML Performance</TabsTrigger>
          <TabsTrigger value="social">Social Analytics</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overview Stats */}
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Reports</span>
                  <Badge variant="secondary">{analyticsData.overview.totalReports.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Incidents</span>
                  <Badge variant="destructive">{analyticsData.overview.activeIncidents}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Resolved Incidents</span>
                  <Badge variant="default">{analyticsData.overview.resolvedIncidents.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Avg Response Time</span>
                  <Badge variant="outline">{analyticsData.overview.avgResponseTime} min</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>System Uptime</span>
                  <Badge variant="default">{analyticsData.overview.systemUptime}%</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Response Time Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={analyticsData.trendAnalysis.reportTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Report Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Report Volume Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.trendAnalysis.reportTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sentiment Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.trendAnalysis.sentimentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="positive" fill="#00C49F" />
                    <Bar dataKey="negative" fill="#FF8042" />
                    <Bar dataKey="urgent" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Hashtag Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Trending Hashtags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {analyticsData.trendAnalysis.hashtagTrends.map((hashtag: any, index: number) => (
                  <div key={hashtag.hashtag} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-blue-600">{hashtag.hashtag}</span>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>{hashtag.count.toLocaleString()} posts</div>
                      <div className="text-green-600">+{hashtag.growth}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Geographic Hotspots */}
            <Card>
              <CardHeader>
                <CardTitle>Incident Hotspots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.geographicData.hotspots.map((hotspot: any) => (
                    <div key={hotspot.location} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-semibold">{hotspot.location}</p>
                          <p className="text-sm text-gray-600">{hotspot.incidentCount} incidents</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          hotspot.riskLevel === "high"
                            ? "destructive"
                            : hotspot.riskLevel === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {hotspot.riskLevel}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Regional Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.geographicData.regionStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="reports" fill="#8884d8" />
                    <Bar dataKey="resolved" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ml" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ML Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>Classification Accuracy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {analyticsData.mlPerformance.classificationAccuracy.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600">Hazard Classification</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Sentiment Accuracy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {analyticsData.mlPerformance.sentimentAccuracy.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600">Social Media Analysis</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Processing Speed</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {analyticsData.mlPerformance.processingLatency.toFixed(0)}ms
                  </div>
                  <p className="text-sm text-gray-600">Average Latency</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ML Performance Details */}
          <Card>
            <CardHeader>
              <CardTitle>ML Model Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Threat Detection Rate</span>
                    <Badge variant="default">{analyticsData.mlPerformance.threatDetectionRate.toFixed(1)}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>False Positive Rate</span>
                    <Badge variant="outline">{analyticsData.mlPerformance.falsePositiveRate.toFixed(1)}%</Badge>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Accurate", value: analyticsData.mlPerformance.classificationAccuracy },
                        { name: "Inaccurate", value: 100 - analyticsData.mlPerformance.classificationAccuracy },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          {/* Social Media Analytics would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Comprehensive social media analytics including hashtag tracking, sentiment analysis, and real-time
                monitoring capabilities.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">API Response</p>
                    <p className="text-xl font-bold">{analyticsData.systemHealth.apiResponseTime.toFixed(0)}ms</p>
                  </div>
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">WebSocket</p>
                    <p className="text-xl font-bold">{analyticsData.systemHealth.websocketConnections}</p>
                  </div>
                  <Wifi className="w-6 h-6 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Memory Usage</p>
                    <p className="text-xl font-bold">{analyticsData.systemHealth.memoryUsage.toFixed(1)}%</p>
                  </div>
                  <Database className="w-6 h-6 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Error Rate</p>
                    <p className="text-xl font-bold">{analyticsData.systemHealth.errorRate.toFixed(2)}%</p>
                  </div>
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
