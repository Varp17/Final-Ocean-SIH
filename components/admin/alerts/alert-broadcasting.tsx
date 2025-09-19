"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Clock, Users, MapPin, Megaphone } from "lucide-react"

interface Alert {
  id: string
  title: string
  message: string
  severity: "low" | "medium" | "high" | "critical"
  zones: string[]
  timestamp: string
  status: "sent" | "pending" | "failed"
  recipients: number
}

export function AlertBroadcasting() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      title: "High Tide Warning",
      message: "Dangerous high tide conditions expected in coastal areas. Avoid beach activities.",
      severity: "high",
      zones: ["Zone A", "Zone B"],
      timestamp: "2024-01-15 14:30",
      status: "sent",
      recipients: 1247,
    },
    {
      id: "2",
      title: "Storm Surge Alert",
      message: "Severe storm surge detected. Immediate evacuation recommended for low-lying areas.",
      severity: "critical",
      zones: ["Zone C"],
      timestamp: "2024-01-15 13:15",
      status: "sent",
      recipients: 892,
    },
  ])

  const [newAlert, setNewAlert] = useState({
    title: "",
    message: "",
    severity: "medium" as const,
    zones: [] as string[],
  })

  const handleSendAlert = () => {
    const alert: Alert = {
      id: Date.now().toString(),
      ...newAlert,
      timestamp: new Date().toLocaleString(),
      status: "sent",
      recipients: Math.floor(Math.random() * 2000) + 500,
    }

    setAlerts([alert, ...alerts])
    setNewAlert({
      title: "",
      message: "",
      severity: "medium",
      zones: [],
    })
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

  return (
    <div className="space-y-6">
      {/* Alert Composition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Megaphone className="h-5 w-5" />
            <span>Compose New Alert</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Alert Title</label>
              <Input
                placeholder="Enter alert title..."
                value={newAlert.title}
                onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Severity Level</label>
              <Select
                value={newAlert.severity}
                onValueChange={(value: any) => setNewAlert({ ...newAlert, severity: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Alert Message</label>
            <Textarea
              placeholder="Enter detailed alert message..."
              value={newAlert.message}
              onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Target Zones</label>
            <Select onValueChange={(value) => setNewAlert({ ...newAlert, zones: [...newAlert.zones, value] })}>
              <SelectTrigger>
                <SelectValue placeholder="Select zones to alert..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Zone A">Zone A - North Coast</SelectItem>
                <SelectItem value="Zone B">Zone B - Central Coast</SelectItem>
                <SelectItem value="Zone C">Zone C - South Coast</SelectItem>
                <SelectItem value="Zone D">Zone D - Inland Areas</SelectItem>
              </SelectContent>
            </Select>
            {newAlert.zones.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newAlert.zones.map((zone, index) => (
                  <Badge key={index} variant="secondary">
                    {zone}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button onClick={handleSendAlert} className="w-full" disabled={!newAlert.title || !newAlert.message}>
            <Send className="h-4 w-4 mr-2" />
            Send Alert
          </Button>
        </CardContent>
      </Card>

      {/* Alert History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{alert.title}</h3>
                      <Badge className={getSeverityColor(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
                      <Badge variant={alert.status === "sent" ? "default" : "secondary"}>{alert.status}</Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{alert.message}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {alert.timestamp}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {alert.recipients} recipients
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {alert.zones.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
