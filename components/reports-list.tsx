"use client"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Clock, User } from "lucide-react"

interface ReportsListProps {
  limit?: number
}

export function ReportsList({ limit = 10 }: ReportsListProps) {
  // Mock reports data
  const reports = [
    {
      id: 1,
      type: "High Waves",
      severity: "high",
      location: "Juhu Beach, Mumbai",
      reporter: "Coastal Guard",
      timestamp: "2 minutes ago",
      status: "verified",
      description: "Waves reaching 4-5 meters, dangerous for swimmers",
    },
    {
      id: 2,
      type: "Storm Surge",
      severity: "medium",
      location: "Marina Beach, Chennai",
      reporter: "Local Authority",
      timestamp: "15 minutes ago",
      status: "investigating",
      description: "Unusual water level rise observed",
    },
    {
      id: 3,
      type: "Marine Pollution",
      severity: "medium",
      location: "Mandovi River, Goa",
      reporter: "Environmental Group",
      timestamp: "1 hour ago",
      status: "verified",
      description: "Oil spill reported near fishing area",
    },
    {
      id: 4,
      type: "Rip Current",
      severity: "high",
      location: "Kovalam Beach, Kerala",
      reporter: "Lifeguard Station",
      timestamp: "2 hours ago",
      status: "verified",
      description: "Strong rip current detected, beach access restricted",
    },
    {
      id: 5,
      type: "Cyclone Activity",
      severity: "critical",
      location: "Bay of Bengal",
      reporter: "Weather Service",
      timestamp: "3 hours ago",
      status: "verified",
      description: "Cyclone formation detected, coastal areas on alert",
    },
  ]

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-emerald-600"
      case "investigating":
        return "text-amber-600"
      case "pending":
        return "text-slate-600"
      default:
        return "text-slate-600"
    }
  }

  const displayReports = reports.slice(0, limit)

  return (
    <div className="space-y-4">
      {displayReports.map((report) => (
        <div
          key={report.id}
          className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-slate-900">{report.type}</span>
                <Badge variant={getSeverityVariant(report.severity)}>{report.severity.toUpperCase()}</Badge>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(report.status)}`}>
                {report.status.toUpperCase()}
              </span>
            </div>

            <p className="text-sm text-slate-600">{report.description}</p>

            <div className="flex items-center space-x-4 text-xs text-slate-500">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{report.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{report.reporter}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{report.timestamp}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
