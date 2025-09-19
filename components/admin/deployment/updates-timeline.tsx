"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, AlertTriangle, CheckCircle, Navigation } from "lucide-react"

interface TimelineEvent {
  id: string
  timestamp: string
  teamName: string
  event: string
  location: string
  status: "dispatched" | "en-route" | "on-scene" | "resolved"
  priority: "low" | "medium" | "high" | "critical"
  details: string
}

export function UpdatesTimeline() {
  const timelineEvents: TimelineEvent[] = [
    {
      id: "1",
      timestamp: "14:32",
      teamName: "Coast Guard Alpha",
      event: "Containment Progress Update",
      location: "Mumbai Port, Sector 7",
      status: "on-scene",
      priority: "critical",
      details: "Oil spill containment 60% complete. Boom barriers holding. Marine life evacuation in progress.",
    },
    {
      id: "2",
      timestamp: "14:28",
      teamName: "Marine Response Beta",
      event: "Route Update",
      location: "Chennai Marina Beach",
      status: "en-route",
      priority: "high",
      details: "Traffic cleared. ETA reduced to 12 minutes. All rescue equipment secured.",
    },
    {
      id: "3",
      timestamp: "14:15",
      teamName: "Emergency Team Gamma",
      event: "Incident Resolved",
      location: "Kochi Backwaters",
      status: "resolved",
      priority: "low",
      details: "False alarm confirmed. Tourist boat located safely. All personnel returning to base.",
    },
    {
      id: "4",
      timestamp: "14:08",
      teamName: "Coastal Patrol Delta",
      event: "Team Dispatched",
      location: "Goa Anjuna Beach",
      status: "dispatched",
      priority: "medium",
      details: "Responding to debris wash-up report. Pollution assessment team deployed.",
    },
    {
      id: "5",
      timestamp: "13:55",
      teamName: "Coast Guard Alpha",
      event: "Arrived On Scene",
      location: "Mumbai Port, Sector 7",
      status: "on-scene",
      priority: "critical",
      details: "Team arrived at oil spill location. Beginning containment procedures.",
    },
    {
      id: "6",
      timestamp: "13:42",
      teamName: "Marine Response Beta",
      event: "Emergency Dispatch",
      location: "Chennai Marina Beach",
      status: "dispatched",
      priority: "high",
      details: "High wave alert response initiated. Full rescue team mobilized.",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "dispatched":
        return <Navigation className="h-4 w-4 text-blue-500" />
      case "en-route":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "on-scene":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground">Deployment Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              {/* Timeline indicator */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted border-2 border-primary">
                  {getStatusIcon(event.status)}
                </div>
                {index < timelineEvents.length - 1 && <div className="w-px h-16 bg-border mt-2" />}
              </div>

              {/* Event content */}
              <div className="flex-1 pb-8">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-card-foreground">{event.teamName}</span>
                      <Badge className={getPriorityColor(event.priority)}>{event.priority}</Badge>
                    </div>
                    <h3 className="font-medium text-card-foreground">{event.event}</h3>
                  </div>
                  <span className="text-sm text-muted-foreground">{event.timestamp}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>

                <p className="text-sm text-card-foreground leading-relaxed">{event.details}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
