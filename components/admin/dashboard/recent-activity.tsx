"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertTriangle, CheckCircle, Clock, User } from "lucide-react"

interface ActivityItem {
  id: string
  type: "report" | "alert" | "verification" | "deployment"
  message: string
  timestamp: string
  severity: "low" | "medium" | "high" | "critical"
  user?: string
}

export function RecentActivity() {
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "alert",
      message: "High wave alert issued for Mumbai coastline",
      timestamp: "2 minutes ago",
      severity: "critical",
      user: "System",
    },
    {
      id: "2",
      type: "verification",
      message: "Oil spill report verified by analyst team",
      timestamp: "5 minutes ago",
      severity: "high",
      user: "Dr. Sharma",
    },
    {
      id: "3",
      type: "deployment",
      message: "Response team dispatched to Kochi port",
      timestamp: "12 minutes ago",
      severity: "medium",
      user: "Admin",
    },
    {
      id: "4",
      type: "report",
      message: "New citizen report received from Chennai",
      timestamp: "18 minutes ago",
      severity: "low",
      user: "Citizen",
    },
    {
      id: "5",
      type: "verification",
      message: "False alarm confirmed for Goa beach report",
      timestamp: "25 minutes ago",
      severity: "low",
      user: "Analyst",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "verification":
        return <CheckCircle className="h-4 w-4 text-chart-2" />
      case "deployment":
        return <User className="h-4 w-4 text-chart-3" />
      default:
        return <Activity className="h-4 w-4 text-primary" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive text-destructive-foreground"
      case "high":
        return "bg-chart-3 text-white"
      case "medium":
        return "bg-chart-4 text-white"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            {getActivityIcon(activity.type)}
            <div className="flex-1 space-y-1">
              <p className="text-sm text-card-foreground leading-relaxed">{activity.message}</p>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${getSeverityColor(activity.severity)}`}>{activity.severity}</Badge>
                <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                {activity.user && <span className="text-xs text-muted-foreground">by {activity.user}</span>}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
