"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  AlertTriangle,
  MapPin,
  Activity,
  Settings,
  Shield,
  Radio,
  Database,
  BarChart3,
  FileText,
} from "lucide-react"
import { LiveInteractiveMap } from "@/components/maps/live-interactive-map"
import { UserManagement } from "@/components/admin/user-management"
import { SystemSettings } from "@/components/admin/system-settings"
import { AlertBroadcasting } from "@/components/admin/alert-broadcasting"
import { SystemMonitoring } from "@/components/admin/system-monitoring"
import { DataManagement } from "@/components/admin/data-management"
import { AuditLogs } from "@/components/admin/audit-logs"

export function AdminControlCenter() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [userRole] = useState<"citizen" | "admin" | "analyst">("admin")

  // Mock system metrics
  const [systemMetrics] = useState({
    activeUsers: 1247,
    pendingReports: 23,
    activeAlerts: 3,
    systemHealth: 98.5,
    responseTeams: 12,
    verifiedReports: 156,
  })

  const [recentActivity] = useState([
    { id: 1, type: "alert", message: "High tide alert issued for Mumbai Coast", time: "2 min ago", severity: "high" },
    { id: 2, type: "report", message: "Flood report verified in Kochi", time: "5 min ago", severity: "medium" },
    { id: 3, type: "team", message: "Response team dispatched to Chennai", time: "8 min ago", severity: "low" },
    { id: 4, type: "system", message: "ML model confidence updated", time: "12 min ago", severity: "low" },
  ])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Atlas Alert - Admin Control Center</h1>
            <p className="text-gray-600">Emergency Management Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              System Online
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r min-h-screen p-4">
          <nav className="space-y-2">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "map" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("map")}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Live Map
            </Button>
            <Button
              variant={activeTab === "alerts" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("alerts")}
            >
              <Radio className="h-4 w-4 mr-2" />
              Alert Broadcasting
            </Button>
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("users")}
            >
              <Users className="h-4 w-4 mr-2" />
              User Management
            </Button>
            <Button
              variant={activeTab === "monitoring" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("monitoring")}
            >
              <Activity className="h-4 w-4 mr-2" />
              System Monitoring
            </Button>
            <Button
              variant={activeTab === "data" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("data")}
            >
              <Database className="h-4 w-4 mr-2" />
              Data Management
            </Button>
            <Button
              variant={activeTab === "audit" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("audit")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Audit Logs
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* System Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemMetrics.activeUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+12% from last hour</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemMetrics.pendingReports}</div>
                    <p className="text-xs text-muted-foreground">Requires verification</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                    <Radio className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemMetrics.activeAlerts}</div>
                    <p className="text-xs text-muted-foreground">Emergency broadcasts</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">System Health</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemMetrics.systemHealth}%</div>
                    <p className="text-xs text-muted-foreground">All systems operational</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Response Teams</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemMetrics.responseTeams}</div>
                    <p className="text-xs text-muted-foreground">Teams deployed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Verified Reports</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemMetrics.verifiedReports}</div>
                    <p className="text-xs text-muted-foreground">Last 24 hours</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(activity.severity)}`} />
                        <div className="flex-1">
                          <p className="font-medium">{activity.message}</p>
                          <p className="text-sm text-gray-600">{activity.time}</p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "map" && (
            <Card>
              <CardHeader>
                <CardTitle>Live Hazard Map - Admin View</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px]">
                  <LiveInteractiveMap userRole={userRole} />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "alerts" && <AlertBroadcasting />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "monitoring" && <SystemMonitoring />}
          {activeTab === "data" && <DataManagement />}
          {activeTab === "audit" && <AuditLogs />}
          {activeTab === "settings" && <SystemSettings />}
        </div>
      </div>
    </div>
  )
}
