"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, BarChart3, Download, MapPin, Users, AlertTriangle, CheckCircle, Clock, Star } from "lucide-react"

interface AnalyticsData {
  sentimentOverTime: Array<{ time: string; fear: number; neutral: number; panic: number }>
  trustScoreDistribution: Array<{ range: string; count: number; percentage: number }>
  hazardTrends: Array<{ month: string; tsunami: number; cyclone: number; oil_spill: number; flooding: number }>
  verificationStats: Array<{ source: string; verified: number; unverified: number; accuracy: number }>
  geographicHeatmap: Array<{ location: string; reports: number; severity: number; lat: number; lng: number }>
  responseTimeAnalysis: Array<{ timeRange: string; count: number; avgResponse: number }>
}

export function AdvancedAnalyticsHub() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("all")

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    sentimentOverTime: [
      { time: "00:00", fear: 25, neutral: 60, panic: 15 },
      { time: "04:00", fear: 30, neutral: 55, panic: 15 },
      { time: "08:00", fear: 45, neutral: 40, panic: 15 },
      { time: "12:00", fear: 55, neutral: 30, panic: 15 },
      { time: "16:00", fear: 60, neutral: 25, panic: 15 },
      { time: "20:00", fear: 40, neutral: 45, panic: 15 },
    ],
    trustScoreDistribution: [
      { range: "4.5-5.0", count: 45, percentage: 18 },
      { range: "4.0-4.5", count: 78, percentage: 31 },
      { range: "3.5-4.0", count: 65, percentage: 26 },
      { range: "3.0-3.5", count: 42, percentage: 17 },
      { range: "2.5-3.0", count: 15, percentage: 6 },
      { range: "0-2.5", count: 5, percentage: 2 },
    ],
    hazardTrends: [
      { month: "Jan", tsunami: 5, cyclone: 12, oil_spill: 8, flooding: 15 },
      { month: "Feb", tsunami: 3, cyclone: 8, oil_spill: 12, flooding: 18 },
      { month: "Mar", tsunami: 7, cyclone: 15, oil_spill: 6, flooding: 22 },
      { month: "Apr", tsunami: 4, cyclone: 20, oil_spill: 9, flooding: 25 },
      { month: "May", tsunami: 8, cyclone: 25, oil_spill: 11, flooding: 20 },
      { month: "Jun", tsunami: 12, cyclone: 30, oil_spill: 7, flooding: 28 },
    ],
    verificationStats: [
      { source: "AI Analysis", verified: 1250, unverified: 180, accuracy: 87.4 },
      { source: "Analyst Review", verified: 890, unverified: 45, accuracy: 95.2 },
      { source: "Volunteer Check", verified: 650, unverified: 85, accuracy: 88.4 },
      { source: "Citizen Report", verified: 420, unverified: 120, accuracy: 77.8 },
    ],
    geographicHeatmap: [
      { location: "Mumbai Coast", reports: 145, severity: 3.2, lat: 19.076, lng: 72.8777 },
      { location: "Kochi Port", reports: 89, severity: 2.8, lat: 9.9312, lng: 76.2673 },
      { location: "Chennai Marina", reports: 67, severity: 2.1, lat: 13.0827, lng: 80.2707 },
      { location: "Vizag Beach", reports: 112, severity: 3.8, lat: 17.6868, lng: 83.2185 },
      { location: "Goa Beaches", reports: 78, severity: 2.5, lat: 15.2993, lng: 74.124 },
    ],
    responseTimeAnalysis: [
      { timeRange: "0-1h", count: 145, avgResponse: 0.5 },
      { timeRange: "1-6h", count: 234, avgResponse: 3.2 },
      { timeRange: "6-24h", count: 189, avgResponse: 12.5 },
      { timeRange: "1-3d", count: 67, avgResponse: 48.0 },
      { timeRange: "3d+", count: 23, avgResponse: 96.0 },
    ],
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics Hub</h1>
          <p className="text-gray-600">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-blue-600">3,247</p>
                <p className="text-xs text-green-600">↑ 12% vs last month</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verification Rate</p>
                <p className="text-2xl font-bold text-green-600">89.2%</p>
                <p className="text-xs text-green-600">↑ 3% vs last month</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-orange-600">4.2h</p>
                <p className="text-xs text-red-600">↑ 0.5h vs last month</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Volunteers</p>
                <p className="text-2xl font-bold text-purple-600">156</p>
                <p className="text-xs text-green-600">↑ 8 new this month</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Trust Score</p>
                <p className="text-2xl font-bold text-yellow-600">4.1</p>
                <p className="text-xs text-green-600">↑ 0.2 vs last month</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sentiment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="trust">Trust Scores</TabsTrigger>
          <TabsTrigger value="hazards">Hazard Trends</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>

        {/* Sentiment Analysis Tab */}
        <TabsContent value="sentiment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sentiment Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.sentimentOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="fear" stackId="1" stroke="#ef4444" fill="#ef4444" />
                    <Area type="monotone" dataKey="panic" stackId="1" stroke="#f97316" fill="#f97316" />
                    <Area type="monotone" dataKey="neutral" stackId="1" stroke="#10b981" fill="#10b981" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sentiment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Fear</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">45%</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Neutral</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">40%</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "40%" }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Panic</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">15%</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Key Insights</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Fear sentiment peaks during afternoon hours</li>
                    <li>• Neutral sentiment highest during night hours</li>
                    <li>• Panic levels remain consistently low (good sign)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trust Scores Tab */}
        <TabsContent value="trust" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Trust Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.trustScoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trust Score Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.trustScoreDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.range}</p>
                        <p className="text-sm text-gray-600">{item.count} users</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{item.percentage}%</p>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Performance Summary</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• 49% of users have high trust scores (4.0+)</li>
                    <li>• Only 8% have concerning scores (below 3.0)</li>
                    <li>• Average trust score: 4.1/5.0</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Hazard Trends Tab */}
        <TabsContent value="hazards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Hazard Type Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analyticsData.hazardTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="tsunami" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="cyclone" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="oil_spill" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="flooding" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Tsunami</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Cyclone</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Oil Spill</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Flooding</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Verification by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.verificationStats.map((stat, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{stat.source}</h4>
                        <Badge className="bg-green-100 text-green-800">{stat.accuracy}% accuracy</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Verified</p>
                          <p className="text-lg font-bold text-green-600">{stat.verified}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Unverified</p>
                          <p className="text-lg font-bold text-orange-600">{stat.unverified}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.responseTimeAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timeRange" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Geographic Heatmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-4">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive heatmap visualization</p>
                    <p className="text-sm text-gray-500">Showing report density by location</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {analyticsData.geographicHeatmap.map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{location.location}</p>
                        <p className="text-sm text-gray-600">{location.reports} reports</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={`${
                            location.severity >= 3.5
                              ? "bg-red-100 text-red-800"
                              : location.severity >= 2.5
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          Severity: {location.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-900 mb-2">High Risk Areas</h4>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>• Vizag Beach: 112 reports, severity 3.8</li>
                      <li>• Mumbai Coast: 145 reports, severity 3.2</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Medium Risk Areas</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Kochi Port: 89 reports, severity 2.8</li>
                      <li>• Goa Beaches: 78 reports, severity 2.5</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Low Risk Areas</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Chennai Marina: 67 reports, severity 2.1</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
