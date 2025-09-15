"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  AlertTriangle,
  Clock,
  Target,
  Zap,
  RefreshCw,
  Download,
} from "lucide-react"

interface AnalyticsData {
  timeSeriesData: any[]
  geographicData: any[]
  severityDistribution: any[]
  responseMetrics: any[]
  predictiveData: any[]
  performanceMetrics: any[]
  realTimeStats: any
}

export function EnhancedAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("24h")
  const [selectedMetric, setSelectedMetric] = useState("reports")
  const [isLoading, setIsLoading] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    timeSeriesData: [
      { time: "00:00", reports: 12, verified: 8, response_time: 4.2, citizens: 145 },
      { time: "04:00", reports: 8, verified: 6, response_time: 3.8, citizens: 98 },
      { time: "08:00", reports: 25, verified: 18, response_time: 5.1, citizens: 234 },
      { time: "12:00", reports: 34, verified: 28, response_time: 4.7, citizens: 312 },
      { time: "16:00", reports: 41, verified: 32, response_time: 6.2, citizens: 287 },
      { time: "20:00", reports: 28, verified: 22, response_time: 4.9, citizens: 198 },
    ],
    geographicData: [
      { region: "Mumbai", reports: 156, severity_avg: 3.2, response_time: 4.5, population: 12500000 },
      { region: "Chennai", reports: 89, severity_avg: 2.8, response_time: 3.9, population: 7000000 },
      { region: "Kochi", reports: 67, severity_avg: 2.1, response_time: 3.2, population: 2100000 },
      { region: "Goa", reports: 34, severity_avg: 1.9, response_time: 2.8, population: 1500000 },
      { region: "Visakhapatnam", reports: 45, severity_avg: 2.4, response_time: 4.1, population: 2000000 },
    ],
    severityDistribution: [
      { name: "Critical", value: 15, color: "#dc2626" },
      { name: "High", value: 35, color: "#ea580c" },
      { name: "Medium", value: 78, color: "#ca8a04" },
      { name: "Low", value: 124, color: "#16a34a" },
    ],
    responseMetrics: [
      { team: "Alpha", avg_response: 3.2, incidents_handled: 45, success_rate: 94 },
      { team: "Beta", avg_response: 4.1, incidents_handled: 38, success_rate: 89 },
      { team: "Gamma", avg_response: 2.8, incidents_handled: 52, success_rate: 96 },
      { team: "Delta", avg_response: 3.9, incidents_handled: 41, success_rate: 91 },
    ],
    predictiveData: [
      { date: "Today", predicted: 45, actual: 42, confidence: 87 },
      { date: "Tomorrow", predicted: 52, actual: null, confidence: 82 },
      { date: "Day+2", predicted: 38, actual: null, confidence: 76 },
      { date: "Day+3", predicted: 41, actual: null, confidence: 71 },
    ],
    performanceMetrics: [
      { metric: "Response Time", value: 4.2, target: 5.0, performance: 84 },
      { metric: "Accuracy", value: 94.5, target: 90.0, performance: 105 },
      { metric: "Coverage", value: 87.3, target: 85.0, performance: 103 },
      { metric: "Efficiency", value: 91.8, target: 88.0, performance: 104 },
      { metric: "Satisfaction", value: 4.6, target: 4.0, performance: 115 },
    ],
    realTimeStats: {
      active_reports: 23,
      verified_reports: 18,
      response_teams_deployed: 7,
      citizens_tracked: 1247,
      avg_response_time: 4.2,
      system_uptime: 99.7,
    },
  })

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update with slight variations
    setAnalyticsData((prev) => ({
      ...prev,
      realTimeStats: {
        ...prev.realTimeStats,
        active_reports: prev.realTimeStats.active_reports + Math.floor(Math.random() * 5) - 2,
        citizens_tracked: prev.realTimeStats.citizens_tracked + Math.floor(Math.random() * 20) - 10,
      },
    }))
    setIsLoading(false)
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Enhanced Analytics Dashboard</h2>
          <p className="text-slate-600">Advanced data visualization and predictive insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading} className="bg-transparent">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Real-time Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Reports</p>
                <p className="text-2xl font-bold text-red-600">{analyticsData.realTimeStats.active_reports}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">+12% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Verified Reports</p>
                <p className="text-2xl font-bold text-green-600">{analyticsData.realTimeStats.verified_reports}</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">+8% accuracy</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Response Teams</p>
                <p className="text-2xl font-bold text-blue-600">
                  {analyticsData.realTimeStats.response_teams_deployed}
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-xs text-slate-500">7 of 12 deployed</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Citizens Tracked</p>
                <p className="text-2xl font-bold text-purple-600">{analyticsData.realTimeStats.citizens_tracked}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">+156 today</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Response</p>
                <p className="text-2xl font-bold text-orange-600">{analyticsData.realTimeStats.avg_response_time}m</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingDown className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">-0.3m improved</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">System Uptime</p>
                <p className="text-2xl font-bold text-emerald-600">{analyticsData.realTimeStats.system_uptime}%</p>
              </div>
              <Zap className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-xs text-emerald-600">Excellent</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Time Series Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Report Trends Over Time</CardTitle>
                <CardDescription>Hourly breakdown of reports and verification rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="reports" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="verified" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Severity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Severity Distribution</CardTitle>
                <CardDescription>Breakdown of incident severity levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.severityDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.severityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Response Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Response Team Performance</CardTitle>
              <CardDescription>Team efficiency and success rates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.responseMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="team" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="avg_response" fill="#8884d8" name="Avg Response Time (min)" />
                  <Bar yAxisId="right" dataKey="success_rate" fill="#82ca9d" name="Success Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Regional Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Report Distribution</CardTitle>
                <CardDescription>Reports by coastal region</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.geographicData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="region" type="category" />
                    <Tooltip />
                    <Bar dataKey="reports" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Severity vs Population Scatter */}
            <Card>
              <CardHeader>
                <CardTitle>Severity vs Population Density</CardTitle>
                <CardDescription>Correlation between population and incident severity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={analyticsData.geographicData}>
                    <CartesianGrid />
                    <XAxis dataKey="population" name="Population" />
                    <YAxis dataKey="severity_avg" name="Avg Severity" />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter name="Regions" dataKey="reports" fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Regional Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Region</th>
                      <th className="text-right p-2">Reports</th>
                      <th className="text-right p-2">Avg Severity</th>
                      <th className="text-right p-2">Response Time</th>
                      <th className="text-right p-2">Population</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.geographicData.map((region, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{region.region}</td>
                        <td className="p-2 text-right">{region.reports}</td>
                        <td className="p-2 text-right">{region.severity_avg.toFixed(1)}</td>
                        <td className="p-2 text-right">{region.response_time.toFixed(1)}m</td>
                        <td className="p-2 text-right">{(region.population / 1000000).toFixed(1)}M</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>System Performance Radar</CardTitle>
              <CardDescription>Multi-dimensional performance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={analyticsData.performanceMetrics}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 120]} />
                  <Radar name="Performance" dataKey="performance" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.performanceMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.metric}</span>
                      <Badge variant={metric.performance >= 100 ? "default" : "secondary"}>{metric.performance}%</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Current: {metric.value}</span>
                        <span>Target: {metric.target}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${metric.performance >= 100 ? "bg-green-500" : "bg-orange-500"}`}
                          style={{ width: `${Math.min(metric.performance, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          {/* Predictive Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Predictive Incident Forecasting</CardTitle>
              <CardDescription>AI-powered predictions for upcoming incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.predictiveData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="actual" stroke="#8884d8" strokeWidth={2} name="Actual Reports" />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#82ca9d"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    name="Predicted Reports"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Confidence Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsData.predictiveData.map((prediction, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{prediction.date}</span>
                      <Badge variant={prediction.confidence >= 80 ? "default" : "secondary"}>
                        {prediction.confidence}% confidence
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{prediction.predicted} reports</div>
                    {prediction.actual && (
                      <div className="text-sm text-slate-600">
                        Actual: {prediction.actual} (±{Math.abs(prediction.predicted - prediction.actual)})
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          {/* Real-time Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Live Activity Stream</CardTitle>
              <CardDescription>Real-time system events and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {[
                  {
                    time: "14:32",
                    event: "High severity report verified",
                    location: "Mumbai Coast",
                    type: "verification",
                  },
                  { time: "14:30", event: "Response Team Alpha deployed", location: "Sector 7", type: "deployment" },
                  { time: "14:28", event: "New citizen report received", location: "Chennai Port", type: "report" },
                  { time: "14:25", event: "Weather alert triggered", location: "Western Coast", type: "alert" },
                  { time: "14:23", event: "System backup completed", location: "Data Center", type: "system" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "verification"
                          ? "bg-green-500"
                          : activity.type === "deployment"
                            ? "bg-blue-500"
                            : activity.type === "report"
                              ? "bg-orange-500"
                              : activity.type === "alert"
                                ? "bg-red-500"
                                : "bg-slate-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{activity.event}</div>
                      <div className="text-xs text-slate-500">
                        {activity.location} • {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
