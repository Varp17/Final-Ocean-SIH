"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function AnalyticsCharts() {
  // Mock data for charts
  const weeklyData = [
    { day: "Mon", reports: 12, verified: 8, social: 45 },
    { day: "Tue", reports: 19, verified: 15, social: 67 },
    { day: "Wed", reports: 8, verified: 6, social: 23 },
    { day: "Thu", reports: 25, verified: 18, social: 89 },
    { day: "Fri", reports: 34, verified: 28, social: 156 },
    { day: "Sat", reports: 41, verified: 32, social: 203 },
    { day: "Sun", reports: 28, verified: 22, social: 134 },
  ]

  const hazardTypes = [
    { name: "High Waves", value: 35, color: "#3b82f6" },
    { name: "Storm Surge", value: 25, color: "#ef4444" },
    { name: "Cyclone", value: 20, color: "#f59e0b" },
    { name: "Coastal Erosion", value: 12, color: "#10b981" },
    { name: "Marine Pollution", value: 8, color: "#8b5cf6" },
  ]

  const accuracyData = [
    { hour: "00:00", accuracy: 92 },
    { hour: "04:00", accuracy: 89 },
    { hour: "08:00", accuracy: 95 },
    { hour: "12:00", accuracy: 97 },
    { hour: "16:00", accuracy: 94 },
    { hour: "20:00", accuracy: 91 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Report Trends</CardTitle>
            <CardDescription>Reports received vs verified over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reports" fill="#3b82f6" name="Total Reports" />
                <Bar dataKey="verified" fill="#10b981" name="Verified" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hazard Type Distribution</CardTitle>
            <CardDescription>Breakdown of reported hazard categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={hazardTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {hazardTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Social Media Activity</CardTitle>
            <CardDescription>Social media mentions and engagement over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="social" stroke="#f59e0b" strokeWidth={2} name="Social Mentions" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ML Model Accuracy</CardTitle>
            <CardDescription>Real-time accuracy of hazard classification models</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} name="Accuracy %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Key performance indicators for the Atlas-Alert system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">94.5%</div>
              <div className="text-sm text-blue-700">Classification Accuracy</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">2.3s</div>
              <div className="text-sm text-emerald-700">Avg Response Time</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">87%</div>
              <div className="text-sm text-amber-700">Report Verification Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">156</div>
              <div className="text-sm text-purple-700">Active Monitoring Sources</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
