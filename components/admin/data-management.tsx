"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Database, Download, Upload, Trash2, RefreshCw, Search, Filter } from "lucide-react"

export function DataManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data
  const dataStats = {
    totalReports: 45678,
    verifiedReports: 38945,
    pendingReports: 4567,
    rejectedReports: 2166,
    totalUsers: 15847,
    activeUsers: 12456,
    storageUsed: 2.4,
    storageLimit: 10,
  }

  const recentReports = [
    {
      id: "RPT-2024-001234",
      type: "High Waves",
      location: "Mumbai Coast",
      reporter: "Coastal Guard Mumbai",
      timestamp: "2024-01-15 14:30:00",
      status: "verified",
      severity: "high",
    },
    {
      id: "RPT-2024-001235",
      type: "Oil Spill",
      location: "Goa Harbor",
      reporter: "Environmental Watch",
      timestamp: "2024-01-15 13:45:00",
      status: "pending",
      severity: "medium",
    },
    {
      id: "RPT-2024-001236",
      type: "Storm Surge",
      location: "Chennai Port",
      reporter: "Port Authority",
      timestamp: "2024-01-15 12:15:00",
      status: "verified",
      severity: "critical",
    },
    {
      id: "RPT-2024-001237",
      type: "Marine Debris",
      location: "Kochi Beach",
      reporter: "Local Fisherman",
      timestamp: "2024-01-15 11:30:00",
      status: "investigating",
      severity: "low",
    },
  ]

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "verified":
        return "default"
      case "pending":
        return "secondary"
      case "investigating":
        return "outline"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600"
      case "high":
        return "text-orange-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-blue-600"
      default:
        return "text-slate-600"
    }
  }

  const filteredReports = recentReports.filter((report) => {
    const matchesSearch =
      searchQuery === "" ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || report.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Data Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Reports</p>
                <p className="text-2xl font-bold text-slate-900">{dataStats.totalReports.toLocaleString()}</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Verified Reports</p>
                <p className="text-2xl font-bold text-emerald-600">{dataStats.verifiedReports.toLocaleString()}</p>
              </div>
              <div className="text-sm text-slate-500">
                {Math.round((dataStats.verifiedReports / dataStats.totalReports) * 100)}% verified
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Users</p>
                <p className="text-2xl font-bold text-purple-600">{dataStats.activeUsers.toLocaleString()}</p>
              </div>
              <div className="text-sm text-slate-500">of {dataStats.totalUsers.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-slate-600">Storage Usage</p>
              <p className="text-2xl font-bold text-slate-900">
                {dataStats.storageUsed} GB / {dataStats.storageLimit} GB
              </p>
              <Progress value={(dataStats.storageUsed / dataStats.storageLimit) * 100} className="mt-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management Actions</CardTitle>
          <CardDescription>Backup, export, and maintenance operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="flex items-center gap-2 h-auto p-4 flex-col">
              <Download className="h-6 w-6" />
              <span>Export Reports</span>
              <span className="text-xs text-slate-500">CSV, JSON, Excel</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4 flex-col bg-transparent">
              <Upload className="h-6 w-6" />
              <span>Import Data</span>
              <span className="text-xs text-slate-500">Bulk import reports</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4 flex-col bg-transparent">
              <Database className="h-6 w-6" />
              <span>Create Backup</span>
              <span className="text-xs text-slate-500">Full system backup</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 h-auto p-4 flex-col text-red-600 hover:text-red-700 bg-transparent"
            >
              <Trash2 className="h-6 w-6" />
              <span>Cleanup Data</span>
              <span className="text-xs text-slate-500">Remove old records</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports Management */}
      <Card>
        <CardHeader>
          <CardTitle>Reports Management</CardTitle>
          <CardDescription>View, verify, and manage hazard reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search reports by ID, type, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="font-medium text-slate-900">{report.id}</div>
                    <div className="text-sm text-slate-600">
                      {report.type} • {report.location}
                    </div>
                    <div className="text-xs text-slate-500">
                      {report.reporter} • {report.timestamp}
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusVariant(report.status)}>{report.status.toUpperCase()}</Badge>
                    <span className={`text-sm font-medium ${getSeverityColor(report.severity)}`}>
                      {report.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Quality Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Data Quality Metrics</CardTitle>
          <CardDescription>Analysis of data integrity and quality indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">94.2%</div>
              <div className="text-sm text-emerald-700">Data Accuracy</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">98.7%</div>
              <div className="text-sm text-blue-700">Data Completeness</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">2.3%</div>
              <div className="text-sm text-purple-700">Duplicate Rate</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">1.8s</div>
              <div className="text-sm text-amber-700">Avg Processing Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
