"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react"

interface ReplayEvent {
  id: string
  timestamp: string
  type: "report_received" | "verification" | "alert_sent" | "team_deployed" | "incident_resolved"
  description: string
  location?: { lat: number; lng: number; name: string }
  actor: string
  severity?: "low" | "medium" | "high" | "critical"
  details: any
}

interface IncidentReplay {
  id: string
  title: string
  startTime: string
  endTime: string
  duration: string
  totalEvents: number
  outcome: "resolved" | "ongoing" | "escalated"
  events: ReplayEvent[]
}

export function IncidentReplay() {
  const [selectedIncident, setSelectedIncident] = useState<IncidentReplay | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState([0])
  const [playbackSpeed, setPlaybackSpeed] = useState(1)

  // Mock incident data
  const incidents: IncidentReplay[] = [
    {
      id: "inc-2025-001",
      title: "High Waves at Juhu Beach",
      startTime: "2025-01-19T14:30:00Z",
      endTime: "2025-01-19T18:45:00Z",
      duration: "4h 15m",
      totalEvents: 12,
      outcome: "resolved",
      events: [
        {
          id: "evt-001",
          timestamp: "2025-01-19T14:30:00Z",
          type: "report_received",
          description: "Initial report of high waves received via WhatsApp",
          location: { lat: 19.1075, lng: 72.8263, name: "Juhu Beach" },
          actor: "Citizen Reporter",
          severity: "medium",
          details: { source: "whatsapp", confidence: 0.7 },
        },
        {
          id: "evt-002",
          timestamp: "2025-01-19T14:35:00Z",
          type: "verification",
          description: "AI analysis confirms high wave activity",
          actor: "AI System",
          severity: "high",
          details: { confidence: 0.85, wave_height: "4-5m" },
        },
        {
          id: "evt-003",
          timestamp: "2025-01-19T14:42:00Z",
          type: "verification",
          description: "Volunteer verification with photos",
          location: { lat: 19.1075, lng: 72.8263, name: "Juhu Beach" },
          actor: "Volunteer #47",
          severity: "high",
          details: { photos: 3, trust_score: 4.2 },
        },
        {
          id: "evt-004",
          timestamp: "2025-01-19T14:50:00Z",
          type: "alert_sent",
          description: "Level 2 alert issued to authorities and public",
          actor: "Alert System",
          details: { alert_level: "Level 2", recipients: 1250 },
        },
        {
          id: "evt-005",
          timestamp: "2025-01-19T15:05:00Z",
          type: "team_deployed",
          description: "Emergency response team deployed to location",
          location: { lat: 19.1075, lng: 72.8263, name: "Juhu Beach" },
          actor: "Emergency Coordinator",
          details: { team_id: "alpha-rescue", members: 4 },
        },
        {
          id: "evt-006",
          timestamp: "2025-01-19T18:45:00Z",
          type: "incident_resolved",
          description: "Wave conditions normalized, area declared safe",
          actor: "Emergency Coordinator",
          details: { final_status: "resolved", casualties: 0 },
        },
      ],
    },
  ]

  const getEventIcon = (type: string) => {
    switch (type) {
      case "report_received":
        return <AlertTriangle className="h-4 w-4 text-blue-600" />
      case "verification":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "alert_sent":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "team_deployed":
        return <Users className="h-4 w-4 text-purple-600" />
      case "incident_resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    // In a real implementation, this would control the timeline animation
  }

  const handleReset = () => {
    setCurrentTime([0])
    setIsPlaying(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Incident Replay Mode</h1>
          <p className="text-gray-600">Replay and analyze past incident timelines</p>
        </div>
      </div>

      {/* Incident Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Incident to Replay</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedIncident?.id === incident.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedIncident(incident)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{incident.title}</h3>
                  <Badge
                    className={`${
                      incident.outcome === "resolved"
                        ? "bg-green-100 text-green-800"
                        : incident.outcome === "escalated"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {incident.outcome}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {incident.duration}
                  </p>
                  <p className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    {incident.totalEvents} events
                  </p>
                  <p>
                    {formatTime(incident.startTime)} - {formatTime(incident.endTime)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Replay Controls */}
      {selectedIncident && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Replay Controls - {selectedIncident.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Timeline Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{formatTime(selectedIncident.startTime)}</span>
                  <span>
                    Current:{" "}
                    {formatTime(
                      selectedIncident.events[Math.floor((currentTime[0] * selectedIncident.events.length) / 100)]
                        ?.timestamp || selectedIncident.startTime,
                    )}
                  </span>
                  <span>{formatTime(selectedIncident.endTime)}</span>
                </div>
                <Slider value={currentTime} onValueChange={setCurrentTime} max={100} step={1} className="w-full" />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={handlePlayPause}>
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <FastForward className="h-4 w-4 mr-2" />
                  {playbackSpeed}x Speed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Timeline */}
      {selectedIncident && (
        <Card>
          <CardHeader>
            <CardTitle>Event Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedIncident.events.map((event, index) => {
                const isActive = index <= Math.floor((currentTime[0] * selectedIncident.events.length) / 100)
                return (
                  <div
                    key={event.id}
                    className={`flex items-start gap-4 p-4 rounded-lg transition-all ${
                      isActive ? "bg-blue-50 border border-blue-200" : "bg-gray-50 opacity-50"
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">{getEventIcon(event.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{formatTime(event.timestamp)}</span>
                        <Badge variant="outline" className="text-xs">
                          {event.type.replace("_", " ")}
                        </Badge>
                        {event.severity && (
                          <Badge className={`${getSeverityColor(event.severity)} border text-xs`}>
                            {event.severity}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-1">{event.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Actor: {event.actor}</span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location.name}
                          </span>
                        )}
                      </div>
                      {event.details && (
                        <div className="mt-2 p-2 bg-white rounded text-xs">
                          <pre className="text-gray-600">{JSON.stringify(event.details, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
