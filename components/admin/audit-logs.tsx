"use client"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, User, Settings, Shield, Database, Bell } from "lucide-react"

interface AuditLogProps {
  limit?: number
}

export function AuditLogs({ limit = 10 }: AuditLogProps) {
  // Mock audit logs
  const auditLogs = [
    {
      id: 1,
      action: "Emergency Alert Sent",
      user: "Dr. Rajesh Kumar",
      role: "admin",
      timestamp: "2 minutes ago",
      details: "High wave warning broadcast to Mumbai region",
      category: "alert",
      severity: "high",
    },
    {
      id: 2,
      action: "User Role Updated",
      user: "Priya Sharma",
      role: "admin",
      timestamp: "15 minutes ago",
      details: "Changed user role from citizen to analyst",
      category: "user",
      severity: "medium",
    },
    {
      id: 3,
      action: "System Settings Modified",
      user: "System Admin",
      role: "admin",
      timestamp: "1 hour ago",
      details: "ML confidence threshold updated to 0.85",
      category: "system",
      severity: "medium",
    },
    {
      id: 4,
      action: "Database Backup Created",
      user: "Automated System",
      role: "system",
      timestamp: "3 hours ago",
      details: "Scheduled backup completed successfully (2.4 GB)",
      category: "database",
      severity: "low",
    },
    {
      id: 5,
      action: "Report Verification",
      user: "Mumbai Port Authority",
      role: "authority",
      timestamp: "4 hours ago",
      details: "Verified storm surge report RPT-2024-001234",
      category: "verification",
      severity: "medium",
    },
    {
      id: 6,
      action: "User Account Suspended",
      user: "Dr. Rajesh Kumar",
      role: "admin",
      timestamp: "6 hours ago",
      details: "Suspended user account due to suspicious activity",
      category: "security",
      severity: "high",
    },
  ]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "alert":
        return <Bell className="h-4 w-4 text-red-500" />
      case "user":
        return <User className="h-4 w-4 text-blue-500" />
      case "system":
        return <Settings className="h-4 w-4 text-purple-500" />
      case "database":
        return <Database className="h-4 w-4 text-emerald-500" />
      case "security":
        return <Shield className="h-4 w-4 text-amber-500" />
      case "verification":
        return <Shield className="h-4 w-4 text-indigo-500" />
      default:
        return <Clock className="h-4 w-4 text-slate-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const displayLogs = auditLogs.slice(0, limit)

  return (
    <div className="space-y-4">
      {displayLogs.map((log) => (
        <div
          key={log.id}
          className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {log.user
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex items-center space-x-2">
              {getCategoryIcon(log.category)}
              <span className="font-medium text-slate-900">{log.action}</span>
              <Badge className={getSeverityColor(log.severity)}>{log.severity.toUpperCase()}</Badge>
            </div>

            <p className="text-sm text-slate-600">{log.details}</p>

            <div className="flex items-center space-x-4 text-xs text-slate-500">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{log.user}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{log.timestamp}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
