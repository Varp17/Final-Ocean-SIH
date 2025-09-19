"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Phone, MessageSquare, Camera, Send } from "lucide-react"
import { useState } from "react"

interface DeploymentUpdate {
  id: string
  teamName: string
  incidentId: string
  status: "dispatched" | "en-route" | "on-scene" | "resolved"
  location: string
  message: string
  timestamp: string
  priority: "low" | "medium" | "high" | "critical"
  attachments?: string[]
  coordinates?: { lat: number; lng: number }
}

export function DeploymentUpdatesCenter() {
  const [updates, setUpdates] = useState<DeploymentUpdate[]>([
    {
      id: "1",
      teamName: "Coast Guard Alpha",
      incidentId: "INC-2025-001",
      status: "on-scene",
      location: "Mumbai Port, Sector 7",
      message: "Oil spill containment in progress. Deployed boom barriers. Estimated cleanup time: 4 hours.",
      timestamp: "2 minutes ago",
      priority: "critical",
      attachments: ["oil-spill-photo.jpg"],
      coordinates: { lat: 18.9388, lng: 72.8354 },
    },
    {
      id: "2",
      teamName: "Marine Response Beta",
      incidentId: "INC-2025-002",
      status: "en-route",
      location: "Chennai Marina Beach",
      message: "High wave alert response. ETA 15 minutes. Equipment: rescue boats, life jackets.",
      timestamp: "8 minutes ago",
      priority: "high",
      coordinates: { lat: 13.0475, lng: 80.2824 },
    },
    {
      id: "3",
      teamName: "Emergency Team Gamma",
      incidentId: "INC-2025-003",
      status: "resolved",
      location: "Kochi Backwaters",
      message:
        "False alarm confirmed. Tourist boat reported as missing was found safely anchored. Team returning to base.",
      timestamp: "25 minutes ago",
      priority: "low",
      coordinates: { lat: 9.9312, lng: 76.2673 },
    },
    {
      id: "4",
      teamName: "Coastal Patrol Delta",
      incidentId: "INC-2025-004",
      status: "dispatched",
      location: "Goa Anjuna Beach",
      message: "Responding to debris wash-up report. Investigating potential pollution source.",
      timestamp: "35 minutes ago",
      priority: "medium",
      coordinates: { lat: 15.5732, lng: 73.7395 },
    },
  ])

  const [newUpdate, setNewUpdate] = useState({
    teamName: "",
    incidentId: "",
    status: "dispatched" as const,
    location: "",
    message: "",
    priority: "medium" as const,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "dispatched":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "en-route":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "on-scene":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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

  const handleSubmitUpdate = () => {
    const update: DeploymentUpdate = {
      id: Date.now().toString(),
      ...newUpdate,
      timestamp: "Just now",
    }
    setUpdates([update, ...updates])
    setNewUpdate({
      teamName: "",
      incidentId: "",
      status: "dispatched",
      location: "",
      message: "",
      priority: "medium",
    })
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  New Update
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Submit Deployment Update</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Team Name</label>
                      <Input
                        value={newUpdate.teamName}
                        onChange={(e) => setNewUpdate({ ...newUpdate, teamName: e.target.value })}
                        placeholder="e.g., Coast Guard Alpha"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Incident ID</label>
                      <Input
                        value={newUpdate.incidentId}
                        onChange={(e) => setNewUpdate({ ...newUpdate, incidentId: e.target.value })}
                        placeholder="e.g., INC-2025-005"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Select
                        value={newUpdate.status}
                        onValueChange={(value: any) => setNewUpdate({ ...newUpdate, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dispatched">Dispatched</SelectItem>
                          <SelectItem value="en-route">En Route</SelectItem>
                          <SelectItem value="on-scene">On Scene</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <Select
                        value={newUpdate.priority}
                        onValueChange={(value: any) => setNewUpdate({ ...newUpdate, priority: value })}
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
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      value={newUpdate.location}
                      onChange={(e) => setNewUpdate({ ...newUpdate, location: e.target.value })}
                      placeholder="e.g., Mumbai Port, Sector 7"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Update Message</label>
                    <Textarea
                      value={newUpdate.message}
                      onChange={(e) => setNewUpdate({ ...newUpdate, message: e.target.value })}
                      placeholder="Describe the current situation and actions taken..."
                      rows={3}
                    />
                  </div>

                  <Button onClick={handleSubmitUpdate} className="w-full">
                    Submit Update
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Active Deployments */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Active Deployments</h2>

        {updates.map((update) => (
          <Card key={update.id} className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-card-foreground">{update.teamName}</h3>
                    <Badge className={getStatusColor(update.status)}>{update.status.replace("-", " ")}</Badge>
                    <Badge className={getPriorityColor(update.priority)}>{update.priority}</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{update.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{update.timestamp}</span>
                    </div>
                    <span className="text-primary">#{update.incidentId}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-card-foreground leading-relaxed">{update.message}</p>

              {update.attachments && (
                <div className="flex items-center gap-2 mt-3">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{update.attachments.length} attachment(s)</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
