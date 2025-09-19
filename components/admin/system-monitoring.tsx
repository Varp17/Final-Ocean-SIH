"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Activity, Database, Cpu, HardDrive, Wifi, AlertTriangle } from "lucide-react"

export function SystemMonitoring() {
  // Mock monitoring data
  const performanceData = [
    { time: "00:00", cpu: 45, memory: 62, requests: 120 },
    { time: "04:00", cpu: 38, memory: 58, requests: 89 },
    { time: "08:00", cpu: 72, memory: 71, requests: 245 },
    { time: "12:00", cpu: 85, memory: 78, requests: 356 },
    { time: "16:00", cpu: 68, memory: 65, requests: 298 },
    { time: "20:00", cpu: 52, memory: 61, requests: 187 },
  ]

  const errorData = [
    { hour: "00", errors: 2, warnings: 5 },
    { hour: "04", errors: 1, warnings: 3 },
    { hour: "08", errors: 4, warnings: 8 },
    { hour: "12", errors: 3, warnings: 12 },
    { hour: "16", errors: 2, warnings: 6 },
    { hour: "20", errors: 1, warnings: 4 },
  ]

  const systemHealth = [
    { component: "Web Server", status: "healthy", uptime: "99.9%", responseTime: "120ms" },
    { component: "Database", status: "healthy", uptime: "99.8%", responseTime: "45ms" },
    { component: "ML Pipeline", status: "warning", uptime: "98.5%", responseTime: "2.3s" },
    { component: "Notification Service", status: "healthy", uptime: "99.7%", responseTime: "340ms" },
    { component: "Social Media API", status: "healthy", uptime: "99.2%", responseTime: "890ms" },
    { component: "WebSocket Server", status: "healthy", uptime: "99.6%", responseTime: "25ms" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-emerald-600"
      case "warning":
        return "text-amber-600"
      case "error":
        return "text-red-600"
      default:
        return "text-slate-600"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-emerald-100 text-emerald-800">HEALTHY</Badge>
      case "warning":
        return <Badge className="bg-amber-100 text-amber-800">WARNING</Badge>
      case "error":
        return <Badge variant="destructive">ERROR</Badge>
      default:
        return <Badge variant="secondary">UNKNOWN</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">CPU Usage</p>
                <p className="text-2xl font-bold text-slate-900">68%</p>
              </div>
              <Cpu className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={68} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Memory Usage</p>
                <p className="text-2xl font-bold text-slate-900">65%</p>
              </div>
              <HardDrive className="h-8 w-8 text-emerald-600" />
            </div>
            <Progress value={65} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Connections</p>
                <p className="text-2xl font-bold text-slate-900">1,247</p>
              </div>
              <Wifi className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Database Size</p>
                <p className="text-2xl font-bold text-slate-900">2.4 GB</p>
              </div>
              <Database className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>CPU, Memory, and Request metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} name="CPU %" />
                <Line type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2} name="Memory %" />
                <Line type="monotone" dataKey="requests" stroke="#f59e0b" strokeWidth={2} name="Requests/min" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error & Warning Trends</CardTitle>
            <CardDescription>System errors and warnings over the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={errorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="errors" fill="#ef4444" name="Errors" />
                <Bar dataKey="warnings" fill="#f59e0b" name="Warnings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Component Health */}
      <Card>
        <CardHeader>
          <CardTitle>Component Health Status</CardTitle>
          <CardDescription>Real-time status of all system components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemHealth.map((component, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Activity className={`h-5 w-5 ${getStatusColor(component.status)}`} />
                  <div>
                    <div className="font-medium text-slate-900">{component.component}</div>
                    <div className="text-sm text-slate-600">Uptime: {component.uptime}</div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  {getStatusBadge(component.status)}
                  <div className="text-sm text-slate-600">Response: {component.responseTime}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>Recent system alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div className="flex-1">
                <div className="font-medium text-amber-900">ML Pipeline Performance Degradation</div>
                <div className="text-sm text-amber-700">Response time increased to 2.3s (threshold: 2.0s)</div>
              </div>
              <div className="text-xs text-amber-600">5 minutes ago</div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <div className="font-medium text-blue-900">High Traffic Detected</div>
                <div className="text-sm text-blue-700">Request volume increased by 45% in the last hour</div>
              </div>
              <div className="text-xs text-blue-600">1 hour ago</div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <Database className="h-5 w-5 text-emerald-600" />
              <div className="flex-1">
                <div className="font-medium text-emerald-900">Database Backup Completed</div>
                <div className="text-sm text-emerald-700">Scheduled backup completed successfully (2.4 GB)</div>
              </div>
              <div className="text-xs text-emerald-600">3 hours ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
