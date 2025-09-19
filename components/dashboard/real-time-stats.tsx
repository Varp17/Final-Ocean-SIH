"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertTriangle, Users, Database, Clock, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"

interface DashboardStats {
  reportsLast24h: number
  activeAlerts: number
  onlineUsers: number
  dataProcessed: string
  systemUptime: string
  verifiedReports: number
}

export function RealTimeStats() {
  const [stats, setStats] = useState<DashboardStats>({
    reportsLast24h: 45,
    activeAlerts: 3,
    onlineUsers: 1247,
    dataProcessed: "2.4TB",
    systemUptime: "99.9%",
    verifiedReports: 38,
  })

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      // Simulate real-time updates
      setStats((prev) => ({
        ...prev,
        reportsLast24h: prev.reportsLast24h + Math.floor(Math.random() * 2),
        onlineUsers: prev.onlineUsers + Math.floor(Math.random() * 10 - 5),
      }))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(timer)
  }, [])

  const statCards = [
    {
      title: "Reports (24h)",
      value: stats.reportsLast24h,
      icon: Activity,
      trend: "+12%",
      color: "text-chart-1",
    },
    {
      title: "Active Alerts",
      value: stats.activeAlerts,
      icon: AlertTriangle,
      trend: "-2",
      color: "text-destructive",
    },
    {
      title: "Online Users",
      value: stats.onlineUsers.toLocaleString(),
      icon: Users,
      trend: "+5.2%",
      color: "text-chart-2",
    },
    {
      title: "Data Processed",
      value: stats.dataProcessed,
      icon: Database,
      trend: "Today",
      color: "text-chart-3",
    },
    {
      title: "System Uptime",
      value: stats.systemUptime,
      icon: Clock,
      trend: "30 days",
      color: "text-chart-4",
    },
    {
      title: "Verified Reports",
      value: stats.verifiedReports,
      icon: CheckCircle,
      trend: "84% rate",
      color: "text-chart-2",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">System Overview</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Last updated: {currentTime.toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
              <Badge variant="secondary" className="text-xs mt-1">
                {stat.trend}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
