"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, AlertTriangle, Activity, Database, TrendingUp, Shield, Clock, MapPin } from "lucide-react"

export function AdminControlCenter() {
  const [systemStats, setSystemStats] = useState({
    totalUsers: 1247,
    activeAlerts: 8,
    systemHealth: 98.5,
    dataProcessed: 15420,
    responseTime: 145,
    uptime: 99.9,
  })

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: "alert", message: "High tide warning issued for Zone A", time: "2 min ago", severity: "high" },
    { id: 2, type: "user", message: "New analyst registered: Sarah Chen", time: "5 min ago", severity: "info" },
    { id: 3, type: "system", message: "ML model updated successfully", time: "12 min ago", severity: "success" },
    { id: 4, type: "alert", message: "Storm surge detected in Zone C", time: "18 min ago", severity: "critical" },
  ])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* System Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{systemStats.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">3 critical, 5 moderate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{systemStats.systemHealth}%</div>
            <p className="text-xs text-muted-foreground">
              <Shield className="inline h-3 w-3 mr-1 text-green-500" />
              All systems operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Processed</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{systemStats.dataProcessed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Reports processed today</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start sm:items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 sm:mt-0 flex-shrink-0 ${
                      activity.severity === "critical"
                        ? "bg-red-500"
                        : activity.severity === "high"
                          ? "bg-orange-500"
                          : activity.severity === "success"
                            ? "bg-green-500"
                            : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-tight">{activity.message}</p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </p>
                  </div>
                  <Badge
                    variant={
                      activity.severity === "critical"
                        ? "destructive"
                        : activity.severity === "high"
                          ? "secondary"
                          : "default"
                    }
                    className="text-xs flex-shrink-0"
                  >
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Button className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
                <span>Broadcast Alert</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 bg-transparent text-xs sm:text-sm"
              >
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                <span>Manage Users</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 bg-transparent text-xs sm:text-sm"
              >
                <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
                <span>System Status</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 bg-transparent text-xs sm:text-sm"
              >
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                <span>View Map</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">System Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">{systemStats.uptime}%</div>
              <p className="text-sm text-gray-600 mt-1">Uptime</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">{systemStats.responseTime}ms</div>
              <p className="text-sm text-gray-600 mt-1">Avg Response Time</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg sm:col-span-1 col-span-1">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600">24/7</div>
              <p className="text-sm text-gray-600 mt-1">Monitoring</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
