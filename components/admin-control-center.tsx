"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Users,
  Shield,
  Activity,
  Database,
  Bell,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
} from "lucide-react"
import { UserManagement } from "@/components/admin/user-management"
import { SystemSettings } from "@/components/admin/system-settings"
import { AlertBroadcasting } from "@/components/admin/alert-broadcasting"
import { SystemMonitoring } from "@/components/admin/system-monitoring"
import { DataManagement } from "@/components/admin/data-management"
import { AuditLogs } from "@/components/admin/audit-logs"

export function AdminControlCenter() {
  const [activeTab, setActiveTab] = useState("overview")
  const [systemStatus, setSystemStatus] = useState({
    overall: "operational",
    database: "operational",
    mlPipeline: "operational",
    notifications: "warning",
    socialMedia: "operational",
    webSockets: "operational",
  })

  // Mock system metrics
  const [systemMetrics, setSystemMetrics] = useState({
    totalUsers: 15847,
    activeReports: 234,
    processedToday: 1456,
    systemUptime: "99.8%",
    responseTime: "1.2s",
    errorRate: "0.02%",
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-emerald-600"
      case "warning":
        return "text-amber-600"
      case "error":
        return "text-red-600"
      default:
        return "text-slate-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-slate-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Control Center</h1>
            <p className="text-slate-600 mt-1">Atlas-Alert System Administration & Management</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-slate-600">System Online</span>
            </div>
          </div>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">{systemMetrics.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Reports</p>
                  <p className="text-2xl font-bold text-slate-900">{systemMetrics.activeReports}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Processed Today</p>
                  <p className="text-2xl font-bold text-slate-900">{systemMetrics.processedToday.toLocaleString()}</p>
                </div>
                <Activity className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">System Uptime</p>
                  <p className="text-2xl font-bold text-slate-900">{systemMetrics.systemUptime}</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Response Time</p>
                  <p className="text-2xl font-bold text-slate-900">{systemMetrics.responseTime}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Error Rate</p>
                  <p className="text-2xl font-bold text-slate-900">{systemMetrics.errorRate}</p>
                </div>
                <Database className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Health Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Health Status</CardTitle>
            <CardDescription>Real-time monitoring of all Atlas-Alert components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(systemStatus).map(([component, status]) => (
                <div key={component} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status)}
                    <span className="font-medium capitalize">{component.replace(/([A-Z])/g, " $1").trim()}</span>
                  </div>
                  <Badge
                    variant={status === "operational" ? "default" : status === "warning" ? "secondary" : "destructive"}
                  >
                    {status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Admin Actions</CardTitle>
                  <CardDescription>Latest administrative activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <AuditLogs limit={5} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    Send Emergency Broadcast
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Manage User Roles
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Database Backup
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    System Configuration
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertBroadcasting />
          </TabsContent>

          <TabsContent value="monitoring">
            <SystemMonitoring />
          </TabsContent>

          <TabsContent value="data">
            <DataManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
