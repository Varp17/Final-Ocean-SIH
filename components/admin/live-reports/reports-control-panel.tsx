"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  MapPin,
  TrendingUp,
  TrendingDown,
  Settings,
  Bell,
  Shield,
} from "lucide-react"

export function ReportsControlPanel() {
  const systemMetrics = {
    totalReports: 156,
    pendingReports: 23,
    verifiedReports: 89,
    falseAlarms: 44,
    averageResponseTime: "3.2 minutes",
    systemUptime: "99.8%",
    activeAnalysts: 12,
    deployedTeams: 8,
  }

  const recentActivity = [
    {
      id: "1",
      action: "Report Verified",
      details: "Oil spill at Mumbai Port confirmed by Coast Guard Alpha",
      timestamp: "2 minutes ago",
      severity: "critical",
    },
    {
      id: "2",
      action: "Team Deployed",
      details: "Marine Response Beta dispatched to Chennai Marina Beach",
      timestamp: "5 minutes ago",
      severity: "high",
    },
    {
      id: "3",
      action: "False Alarm",
      details: "Debris report at Goa beach marked as false alarm",
      timestamp: "8 minutes ago",
      severity: "low",
    },
    {
      id: "4",
      action: "New Report",
      details: "Chemical pollution detected at Visakhapatnam Port",
      timestamp: "12 minutes ago",
      severity: "high",
    },
  ]

  const performanceData = [
    { category: "Oil Spills", reports: 23, verified: 19, accuracy: 83 },
    { category: "High Waves", reports: 45, verified: 38, accuracy: 84 },
    { category: "Debris", reports: 34, verified: 22, accuracy: 65 },
    { category: "Pollution", reports: 28, verified: 24, accuracy: 86 },
    { category: "Storm Surge", reports: 26, verified: 23, accuracy: 88 },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600"
      case "high":
        return "text-orange-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{systemMetrics.totalReports}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{systemMetrics.pendingReports}</div>
            <p className="text-xs text-muted-foreground">Awaiting analyst review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Reports</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{systemMetrics.verifiedReports}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              85% accuracy rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{systemMetrics.averageResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -15% improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Control Tabs */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="teams">Team Status</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground">Recent System Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(activity.severity)}`} />
                  <div className="flex-1">
                    <div className="font-medium text-card-foreground">{activity.action}</div>
                    <div className="text-sm text-muted-foreground">{activity.details}</div>
                    <div className="text-xs text-muted-foreground mt-1">{activity.timestamp}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground">Report Category Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {performanceData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-card-foreground">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {item.verified}/{item.reports} verified
                      </span>
                      <Badge variant="secondary">{item.accuracy}%</Badge>
                    </div>
                  </div>
                  <Progress value={item.accuracy} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-card-foreground">
                  <Users className="h-4 w-4" />
                  Active Analysts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground mb-2">{systemMetrics.activeAnalysts}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Available:</span>
                    <span className="text-green-600">8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Busy:</span>
                    <span className="text-yellow-600">4</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-card-foreground">
                  <Shield className="h-4 w-4" />
                  Response Teams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground mb-2">{systemMetrics.deployedTeams}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Deployed:</span>
                    <span className="text-orange-600">5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Standby:</span>
                    <span className="text-green-600">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground">System Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Auto-verification Threshold</label>
                  <div className="flex items-center gap-2">
                    <Progress value={85} className="flex-1" />
                    <span className="text-sm">85%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Alert Notification Level</label>
                  <div className="flex items-center gap-2">
                    <Progress value={70} className="flex-1" />
                    <span className="text-sm">High</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button size="sm" className="flex items-center gap-1">
                  <Settings className="h-4 w-4" />
                  Configure Alerts
                </Button>
                <Button size="sm" variant="outline" className="flex items-center gap-1 bg-transparent">
                  <Bell className="h-4 w-4" />
                  Notification Settings
                </Button>
                <Button size="sm" variant="outline" className="flex items-center gap-1 bg-transparent">
                  <MapPin className="h-4 w-4" />
                  Map Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
