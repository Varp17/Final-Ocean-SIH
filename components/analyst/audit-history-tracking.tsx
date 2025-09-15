"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  History,
  Search,
  Filter,
  User,
  Clock,
  FileText,
  Edit,
  CheckCircle,
  XCircle,
  Send,
  AlertTriangle,
  Eye,
  CalendarIcon,
  Download,
  RefreshCw,
} from "lucide-react"

interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: "create" | "edit" | "approve" | "reject" | "send" | "verify" | "delete" | "export"
  entityType: "report" | "incident" | "user" | "system" | "alert"
  entityId: string
  description: string
  details: {
    before?: any
    after?: any
    metadata?: any
  }
  ipAddress: string
  userAgent: string
  severity: "low" | "medium" | "high" | "critical"
  formattedTimestamp?: string
  formattedTimestampFull?: string
}

interface SystemEvent {
  id: string
  timestamp: string
  eventType: "model_update" | "system_restart" | "backup" | "maintenance" | "alert_sent" | "integration_sync"
  status: "success" | "warning" | "error"
  description: string
  duration?: number
  affectedComponents: string[]
  details: any
}

interface UserActivity {
  userId: string
  userName: string
  role: string
  lastLogin: string
  totalActions: number
  recentActions: AuditLog[]
  loginHistory: Array<{
    timestamp: string
    ipAddress: string
    success: boolean
  }>
}

export function AuditHistoryTracking() {
  // ✅ Initial audit logs with formatted timestamps
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    [
      {
        id: "AUD-001",
        timestamp: "2025-09-15T14:32:15Z",
        userId: "analyst_kumar",
        userName: "Rajesh Kumar",
        action: "approve",
        entityType: "report",
        entityId: "FR-2025-001",
        description: "Approved final report for Vizag high waves incident",
        details: {
          before: { status: "pending_review" },
          after: { status: "approved" },
          metadata: { confidence: 89, verifiedReports: 32 },
        },
        ipAddress: "192.168.1.45",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        severity: "medium",
      },
      {
        id: "AUD-002",
        timestamp: "2025-09-15T14:28:42Z",
        userId: "analyst_sharma",
        userName: "Priya Sharma",
        action: "edit",
        entityType: "report",
        entityId: "FR-2025-002",
        description: "Modified recommendations for Mumbai flood report",
        details: {
          before: { recommendations: ["Issue Level 2 alert"] },
          after: { recommendations: ["Issue Level 1 advisory", "Monitor drainage systems"] },
          metadata: { changeReason: "Severity reassessment" },
        },
        ipAddress: "192.168.1.67",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        severity: "low",
      },
      {
        id: "AUD-003",
        timestamp: "2025-09-15T14:15:23Z",
        userId: "system",
        userName: "System",
        action: "create",
        entityType: "alert",
        entityId: "ALT-2025-045",
        description: "Auto-generated Level 3 alert for oil spill detection",
        details: {
          after: { alertLevel: "Level 3", location: "Kochi Port", confidence: 94 },
          metadata: { triggerSource: "ML_MODEL", modelVersion: "v2.3.1" },
        },
        ipAddress: "127.0.0.1",
        userAgent: "System/Internal",
        severity: "high",
      },
      {
        id: "AUD-004",
        timestamp: "2025-09-15T13:45:18Z",
        userId: "analyst_nair",
        userName: "Arun Nair",
        action: "verify",
        entityType: "report",
        entityId: "RPT-2025-008",
        description: "Manually verified social media report from Twitter",
        details: {
          before: { status: "pending_analyst", aiConfidence: 76 },
          after: { status: "verified", analystConfidence: 85 },
          metadata: { verificationMethod: "cross_reference", sources: 3 },
        },
        ipAddress: "192.168.1.89",
        userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
        severity: "medium",
      },
      {
        id: "AUD-005",
        timestamp: "2025-09-15T13:22:07Z",
        userId: "admin_singh",
        userName: "Vikram Singh",
        action: "send",
        entityType: "report",
        entityId: "FR-2025-001",
        description: "Sent approved report to emergency response team",
        details: {
          metadata: {
            recipients: ["emergency@gov.in", "coastal@ndma.gov.in"],
            alertLevel: "Level 2",
            urgency: "high",
          },
        },
        ipAddress: "192.168.1.12",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        severity: "high",
      },
    ].map(log => ({
      ...log,
      formattedTimestamp: format(new Date(log.timestamp), "MMM dd, yyyy HH:mm"),
      formattedTimestampFull: format(new Date(log.timestamp), "PPP pp"),
    }))
  )

  // System events
  const [systemEvents] = useState<SystemEvent[]>([
    {
      id: "SYS-001",
      timestamp: "2025-09-15T14:00:00Z",
      eventType: "model_update",
      status: "success",
      description: "Updated sentiment analysis model to v2.4.0",
      duration: 45,
      affectedComponents: ["Sentiment Analysis", "Text Classification"],
      details: {
        version: "v2.4.0",
        improvements: ["Better emotion detection", "Reduced false positives"],
        accuracy: 87.3,
      },
    },
    {
      id: "SYS-002",
      timestamp: "2025-09-15T12:30:00Z",
      eventType: "backup",
      status: "success",
      description: "Automated daily backup completed",
      duration: 120,
      affectedComponents: ["Database", "File Storage", "Configuration"],
      details: {
        backupSize: "2.3 GB",
        location: "backup-server-01",
        retention: "30 days",
      },
    },
    {
      id: "SYS-003",
      timestamp: "2025-09-15T11:45:00Z",
      eventType: "alert_sent",
      status: "success",
      description: "Emergency alert broadcast to 15,000 subscribers",
      affectedComponents: ["SMS Gateway", "Email Service", "Push Notifications"],
      details: {
        alertType: "Level 2 Coastal Warning",
        location: "Vizag District",
        recipients: 15000,
        deliveryRate: 98.7,
      },
    },
    {
      id: "SYS-004",
      timestamp: "2025-09-15T10:15:00Z",
      eventType: "integration_sync",
      status: "warning",
      description: "Social media API rate limit reached",
      affectedComponents: ["Twitter API", "Social Media Monitor"],
      details: {
        apiEndpoint: "Twitter Search API",
        rateLimitReset: "2025-09-15T11:00:00Z",
        missedRequests: 23,
      },
    },
  ])

  // User activities
  const [userActivities, setUserActivities] = useState<UserActivity[]>([
    {
      userId: "analyst_kumar",
      userName: "Rajesh Kumar",
      role: "Senior Analyst",
      lastLogin: "2025-09-15T14:30:00Z",
      totalActions: 156,
      recentActions: auditLogs.filter(log => log.userId === "analyst_kumar").slice(0, 5),
      loginHistory: [
        { timestamp: "2025-09-15T14:30:00Z", ipAddress: "192.168.1.45", success: true },
        { timestamp: "2025-09-15T09:15:00Z", ipAddress: "192.168.1.45", success: true },
        { timestamp: "2025-09-14T16:45:00Z", ipAddress: "192.168.1.45", success: true },
      ],
    },
    {
      userId: "analyst_sharma",
      userName: "Priya Sharma",
      role: "Analyst",
      lastLogin: "2025-09-15T14:25:00Z",
      totalActions: 89,
      recentActions: auditLogs.filter(log => log.userId === "analyst_sharma").slice(0, 5),
      loginHistory: [
        { timestamp: "2025-09-15T14:25:00Z", ipAddress: "192.168.1.67", success: true },
        { timestamp: "2025-09-15T08:30:00Z", ipAddress: "192.168.1.67", success: true },
        { timestamp: "2025-09-14T15:20:00Z", ipAddress: "192.168.1.67", success: true },
      ],
    },
  ])

  // Filters
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>(auditLogs)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [entityFilter, setEntityFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  // Apply filters
  const applyFilters = () => {
    let filtered = [...auditLogs]

    if (searchQuery) {
      filtered = filtered.filter(
        log =>
          log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.userName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (actionFilter !== "all") filtered = filtered.filter(log => log.action === actionFilter)
    if (entityFilter !== "all") filtered = filtered.filter(log => log.entityType === entityFilter)
    if (userFilter !== "all") filtered = filtered.filter(log => log.userId === userFilter)
    if (dateRange.from) filtered = filtered.filter(log => new Date(log.timestamp) >= dateRange.from!)
    if (dateRange.to) filtered = filtered.filter(log => new Date(log.timestamp) <= dateRange.to!)

    setFilteredLogs(filtered)
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <FileText className="h-4 w-4" />
      case "edit":
        return <Edit className="h-4 w-4" />
      case "approve":
      case "verify":
        return <CheckCircle className="h-4 w-4" />
      case "reject":
      case "delete":
        return <XCircle className="h-4 w-4" />
      case "send":
        return <Send className="h-4 w-4" />
      case "export":
        return <Download className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "bg-blue-100 text-blue-800"
      case "edit":
        return "bg-yellow-100 text-yellow-800"
      case "approve":
        return "bg-green-100 text-green-800"
      case "reject":
        return "bg-red-100 text-red-800"
      case "send":
        return "bg-purple-100 text-purple-800"
      case "verify":
        return "bg-emerald-100 text-emerald-800"
      case "delete":
        return "bg-red-100 text-red-800"
      case "export":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSystemEventStatus = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Audit & History Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Total Actions</p>
                  <p className="text-2xl font-bold text-blue-800">{auditLogs.length}</p>
                </div>
                <History className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Active Users</p>
                  <p className="text-2xl font-bold text-green-800">{userActivities.length}</p>
                </div>
                <User className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">System Events</p>
                  <p className="text-2xl font-bold text-purple-800">{systemEvents.length}</p>
                </div>
                <RefreshCw className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600">High Severity</p>
                  <p className="text-2xl font-bold text-orange-800">
                    {auditLogs.filter(log => log.severity === "high" || log.severity === "critical").length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="system">System Events</TabsTrigger>
          <TabsTrigger value="users">User Activity</TabsTrigger>
        </TabsList>

        {/* Audit Logs Tab */}
        <TabsContent value="audit">
          <div className="flex gap-2 mb-4 flex-wrap">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select onValueChange={setActionFilter} value={actionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="edit">Edit</SelectItem>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
                <SelectItem value="send">Send</SelectItem>
                <SelectItem value="verify">Verify</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="export">Export</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setEntityFilter} value={entityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="incident">Incident</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>

          <ScrollArea className="h-[400px] rounded-md border">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Time</th>
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Action</th>
                  <th className="p-2 text-left">Entity</th>
                  <th className="p-2 text-left">Severity</th>
                  <th className="p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <td className="p-2">{log.formattedTimestamp}</td>
                    <td className="p-2">{log.userName}</td>
                    <td className="p-2">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded ${getActionColor(log.action)}`}>
                        {getActionIcon(log.action)}
                        <span className="text-xs capitalize">{log.action}</span>
                      </div>
                    </td>
                    <td className="p-2">{log.entityType}</td>
                    <td className="p-2">
                      <span className={`inline-block w-3 h-3 rounded-full ${getSeverityColor(log.severity)}`}></span>
                    </td>
                    <td className="p-2">{log.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>

          {/* Dialog for selected log */}
          {selectedLog && (
            <Dialog open={!!selectedLog} onOpenChange={open => !open && setSelectedLog(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Audit Log Details</DialogTitle>
                  <DialogDescription>
                    Detailed information for audit log <strong>{selectedLog.id}</strong>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 mt-2">
                  <p>
                    <strong>Timestamp:</strong> {selectedLog.formattedTimestampFull}
                  </p>
                  <p>
                    <strong>User:</strong> {selectedLog.userName} ({selectedLog.userId})
                  </p>
                  <p>
                    <strong>Action:</strong> {selectedLog.action}
                  </p>
                  <p>
                    <strong>Entity:</strong> {selectedLog.entityType} ({selectedLog.entityId})
                  </p>
                  <p>
                    <strong>Severity:</strong> {selectedLog.severity}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedLog.description}
                  </p>
                  <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                  <Button onClick={() => setSelectedLog(null)}>Close</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        {/* System Events Tab */}
        <TabsContent value="system">
          <ScrollArea className="h-[400px] rounded-md border">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Time</th>
                  <th className="p-2 text-left">Event</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {systemEvents.map(event => (
                  <tr key={event.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="p-2">{format(new Date(event.timestamp), "MMM dd, yyyy HH:mm")}</td>
                    <td className="p-2">{event.eventType}</td>
                    <td className="p-2">{getSystemEventStatus(event.status)}</td>
                    <td className="p-2">{event.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </TabsContent>

        {/* User Activity Tab */}
        <TabsContent value="users">
          <ScrollArea className="h-[400px] rounded-md border">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Role</th>
                  <th className="p-2 text-left">Last Login</th>
                  <th className="p-2 text-left">Total Actions</th>
                </tr>
              </thead>
              <tbody>
                {userActivities.map(user => (
                  <tr key={user.userId} className="hover:bg-gray-50 cursor-pointer">
                    <td className="p-2">{user.userName}</td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2">{format(new Date(user.lastLogin), "MMM dd, yyyy HH:mm")}</td>
                    <td className="p-2">{user.totalActions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
