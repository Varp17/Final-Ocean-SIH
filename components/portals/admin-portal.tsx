"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Shield, AlertTriangle, MapPin, BarChart3, Radio, Settings, TrendingUp } from "lucide-react"
import { usePortalStore } from "@/lib/store/portal-store"
import { LiveInteractiveMap } from "@/components/maps/live-interactive-map"

export function AdminPortal() {
  const { currentUser, users, reports, zones, setCurrentUser } = usePortalStore()
  const [searchTerm, setSearchTerm] = useState("")

  // Mock admin user
  useEffect(() => {
    if (!currentUser) {
      setCurrentUser({
        id: "2",
        name: "Admin User",
        email: "admin@atlas-alert.com",
        role: "admin",
        isActive: true,
      })
    }
  }, [currentUser, setCurrentUser])

  const activeReports = reports.filter((r) => r.status === "pending")
  const verifiedReports = reports.filter((r) => r.status === "verified")
  const activeCitizens = users.filter((u) => u.role === "citizen" && u.isActive)
  const responseTeams = [
    { id: "1", name: "Team Alpha", status: "deployed", members: 6, location: "Marine Drive" },
    { id: "2", name: "Team Beta", status: "available", members: 4, location: "Base Station" },
    { id: "3", name: "Team Gamma", status: "busy", members: 8, location: "Juhu Beach" },
  ]

  const filteredReports = reports.filter(
    (report) =>
      report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Atlas-Alert Admin</h1>
                <p className="text-sm text-gray-600">Command & Control Center</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                System Online
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="map">Live Map</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{activeReports.length}</div>
                  <p className="text-xs text-gray-500">Pending verification</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Live Citizens</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{activeCitizens.length}</div>
                  <p className="text-xs text-gray-500">Currently tracking</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Response Teams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{responseTeams.length}</div>
                  <p className="text-xs text-gray-500">Teams deployed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Danger Zones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {zones.filter((z) => z.type === "danger").length}
                  </div>
                  <p className="text-xs text-gray-500">Active zones</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button className="h-16 flex flex-col gap-1">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="text-sm">Issue Emergency Alert</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col gap-1 bg-transparent">
                    <Radio className="h-5 w-5" />
                    <span className="text-sm">Deploy Response Team</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col gap-1 bg-transparent">
                    <BarChart3 className="h-5 w-5" />
                    <span className="text-sm">Generate Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeReports.slice(0, 5).map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              report.severity === "high"
                                ? "bg-red-500"
                                : report.severity === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                          />
                          <div>
                            <div className="font-medium text-sm">{report.type.replace("_", " ")}</div>
                            <div className="text-xs text-gray-600">{report.description.slice(0, 50)}...</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Verify
                          </Button>
                          <Button size="sm">Deploy</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Response Teams Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {responseTeams.map((team) => (
                      <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              team.status === "available"
                                ? "bg-green-500"
                                : team.status === "deployed"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          />
                          <div>
                            <div className="font-medium text-sm">{team.name}</div>
                            <div className="text-xs text-gray-600">
                              {team.members} members • {team.location}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="capitalize">
                          {team.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Live Map Tab */}
          <TabsContent value="map">
            <Card className="h-[700px]">
              <CardContent className="p-0 h-full">
                <LiveInteractiveMap userRole="admin" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Management Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Reports Management</CardTitle>
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={report.severity === "high" ? "destructive" : "secondary"}>
                              {report.type.replace("_", " ")}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {report.status}
                            </Badge>
                            <span className="text-xs text-gray-500">{new Date(report.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{report.description}</p>
                          <div className="text-xs text-gray-500">
                            📍 {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            Verify
                          </Button>
                          <Button size="sm">Deploy Team</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams">
            <Card>
              <CardHeader>
                <CardTitle>Response Teams Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {responseTeams.map((team) => (
                    <Card key={team.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between">
                          {team.name}
                          <Badge variant="secondary" className="capitalize">
                            {team.status}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-gray-600">Members:</span> {team.members}
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Location:</span> {team.location}
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                              <MapPin className="h-4 w-4 mr-1" />
                              Track
                            </Button>
                            <Button size="sm" className="flex-1">
                              <Radio className="h-4 w-4 mr-1" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Alert Broadcasting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Create Emergency Alert</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Broadcast emergency alerts to citizens in affected areas
                    </p>
                    <Button>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Create Alert
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  System Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Report Statistics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Reports:</span>
                        <Badge variant="secondary">{reports.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Verified:</span>
                        <Badge variant="secondary">{verifiedReports.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Pending:</span>
                        <Badge variant="secondary">{activeReports.length}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">System Health</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">API Status:</span>
                        <Badge className="bg-green-100 text-green-700">Online</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Database:</span>
                        <Badge className="bg-green-100 text-green-700">Connected</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">ML Services:</span>
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
