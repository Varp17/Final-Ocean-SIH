"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Activity,
  Server,
  Database,
  Wifi,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Cpu,
  HardDrive,
  MemoryStick,
} from "lucide-react"

interface SystemMetric {
  name: string
  value: number
  unit: string
  status: "healthy" | "warning" | "critical"
  trend: "up" | "down" | "stable"
}

interface ServiceStatus {
  name: string
  status: "online" | "offline" | "degraded"
  uptime: string
  lastCheck: string
}

export function SystemMonitoring() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { name: "CPU Usage", value: 45, unit: "%", status: "healthy", trend: "stable" },
    { name: "Memory Usage", value: 67, unit: "%", status: "warning", trend: "up" },
    { name: "Disk Usage", value: 23, unit: "%", status: "healthy", trend: "stable" },
    { name: "Network I/O", value: 156, unit: "MB/s", status: "healthy", trend: "up" },
    { name: "Database Connections", value: 89, unit: "active", status: "healthy", trend: "stable" },
    { name: "API Response Time", value: 145, unit: "ms", status: "healthy", trend: "down" },
  ])

  const [services, setServices] = useState<ServiceStatus[]>([
    { name: "Web Server", status: "online", uptime: "99.9%", lastCheck: "30s ago" },
    { name: "Database", status: "online", uptime: "99.8%", lastCheck: "30s ago" },
    { name: "ML Pipeline", status: "online", uptime: "98.5%", lastCheck: "45s ago" },
    { name: "WebSocket Server", status: "online", uptime: "99.7%", lastCheck: "30s ago" },
    { name: "Background Jobs", status: "degraded", uptime: "95.2%", lastCheck: "2m ago" },
    { name: "External APIs", status: "online", uptime: "97.8%", lastCheck: "1m ago" },
  ])

  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshMetrics = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update metrics with random variations
    setMetrics((prev) =>
      prev.map((metric) => ({
        ...metric,
        value: Math.max(0, metric.value + (Math.random() - 0.5) * 10),
      })),
    )

    setIsRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "online":
        return "text-green-600 bg-green-100"
      case "warning":
      case "degraded":
        return "text-yellow-600 bg-yellow-100"
      case "critical":
      case "offline":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "online":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
      case "degraded":
        return <AlertCircle className="h-4 w-4" />
      case "critical":
      case "offline":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getMetricIcon = (name: string) => {
    if (name.includes("CPU")) return <Cpu className="h-4 w-4" />
    if (name.includes("Memory")) return <MemoryStick className="h-4 w-4" />
    if (name.includes("Disk")) return <HardDrive className="h-4 w-4" />
    if (name.includes("Network")) return <Wifi className="h-4 w-4" />
    if (name.includes("Database")) return <Database className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Health Overview</h2>
          <p className="text-gray-600">Real-time monitoring of system components</p>
        </div>
        <Button onClick={refreshMetrics} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                {getMetricIcon(metric.name)}
                <span>{metric.name}</span>
              </CardTitle>
              <Badge className={getStatusColor(metric.status)}>{getStatusIcon(metric.status)}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.value.toFixed(metric.unit === "%" ? 0 : 1)} {metric.unit}
              </div>
              {metric.unit === "%" && (
                <Progress
                  value={metric.value}
                  className="mt-2"
                  // @ts-ignore
                  indicatorClassName={
                    metric.status === "critical"
                      ? "bg-red-500"
                      : metric.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }
                />
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Trend: {metric.trend === "up" ? "↗" : metric.trend === "down" ? "↘" : "→"} {metric.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="h-5 w-5" />
            <span>Service Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getStatusColor(service.status)}`}>
                    {getStatusIcon(service.status)}
                  </div>
                  <div>
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-sm text-gray-600">Uptime: {service.uptime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                  <p className="text-xs text-gray-500 mt-1">{service.lastCheck}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>System Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium text-yellow-800">High Memory Usage Detected</p>
                <p className="text-sm text-yellow-700">Memory usage is above 65%. Consider scaling resources.</p>
              </div>
              <span className="text-xs text-yellow-600">5 min ago</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-blue-800">System Backup Completed</p>
                <p className="text-sm text-blue-700">Daily backup completed successfully at 02:00 AM.</p>
              </div>
              <span className="text-xs text-blue-600">2 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
