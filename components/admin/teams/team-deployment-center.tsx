"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  RotateCcw,
  Phone,
  Navigation,
  Zap,
} from "lucide-react"

interface Team {
  id: string
  name: string
  type: "rescue" | "medical" | "fire" | "police" | "hazmat"
  status: "available" | "deployed" | "busy" | "offline"
  location: { lat: number; lng: number; address: string }
  members: Array<{
    id: string
    name: string
    role: string
    contact: string
    status: "active" | "unavailable"
  }>
  equipment: string[]
  lastUpdate: string
  currentMission?: {
    id: string
    type: string
    priority: "low" | "medium" | "high" | "critical"
    location: string
    startTime: string
  }
}

const mockTeams: Team[] = [
  {
    id: "team-001",
    name: "Alpha Rescue Unit",
    type: "rescue",
    status: "available",
    location: { lat: 40.7128, lng: -74.006, address: "Manhattan Harbor Station" },
    members: [
      { id: "m1", name: "John Smith", role: "Team Leader", contact: "+1-555-0101", status: "active" },
      { id: "m2", name: "Sarah Johnson", role: "Medic", contact: "+1-555-0102", status: "active" },
      { id: "m3", name: "Mike Chen", role: "Diver", contact: "+1-555-0103", status: "active" },
      { id: "m4", name: "Lisa Rodriguez", role: "Navigator", contact: "+1-555-0104", status: "active" },
    ],
    equipment: ["Rescue Boat", "Diving Gear", "Medical Kit", "Communication Radio"],
    lastUpdate: "2 minutes ago",
  },
  {
    id: "team-002",
    name: "Bravo Medical Response",
    type: "medical",
    status: "deployed",
    location: { lat: 40.7589, lng: -73.9851, address: "Central Park Emergency Zone" },
    members: [
      { id: "m5", name: "Dr. Emily Watson", role: "Lead Physician", contact: "+1-555-0201", status: "active" },
      { id: "m6", name: "James Wilson", role: "Paramedic", contact: "+1-555-0202", status: "active" },
      { id: "m7", name: "Anna Kim", role: "Nurse", contact: "+1-555-0203", status: "active" },
    ],
    equipment: ["Ambulance", "Advanced Life Support", "Trauma Kit", "Defibrillator"],
    lastUpdate: "1 minute ago",
    currentMission: {
      id: "mission-001",
      type: "Medical Emergency",
      priority: "high",
      location: "Central Park Lake",
      startTime: "14:30",
    },
  },
  {
    id: "team-003",
    name: "Charlie Fire & Rescue",
    type: "fire",
    status: "busy",
    location: { lat: 40.7505, lng: -73.9934, address: "Times Square Fire Station" },
    members: [
      { id: "m8", name: "Captain Robert Brown", role: "Fire Captain", contact: "+1-555-0301", status: "active" },
      { id: "m9", name: "Tom Anderson", role: "Firefighter", contact: "+1-555-0302", status: "active" },
      { id: "m10", name: "Maria Garcia", role: "Rescue Specialist", contact: "+1-555-0303", status: "unavailable" },
    ],
    equipment: ["Fire Engine", "Ladder Truck", "Hazmat Suits", "Thermal Camera"],
    lastUpdate: "5 minutes ago",
  },
]

export function TeamDeploymentCenter() {
  const [teams, setTeams] = useState<Team[]>(mockTeams)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")

  const getStatusColor = (status: Team["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "deployed":
        return "bg-blue-500"
      case "busy":
        return "bg-yellow-500"
      case "offline":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeIcon = (type: Team["type"]) => {
    switch (type) {
      case "rescue":
        return <Users className="h-4 w-4" />
      case "medical":
        return <AlertTriangle className="h-4 w-4" />
      case "fire":
        return <Zap className="h-4 w-4" />
      case "police":
        return <CheckCircle className="h-4 w-4" />
      case "hazmat":
        return <XCircle className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const deployTeam = (teamId: string, missionType: string) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? {
              ...team,
              status: "deployed" as const,
              currentMission: {
                id: `mission-${Date.now()}`,
                type: missionType,
                priority: "high" as const,
                location: "Emergency Zone Alpha",
                startTime: new Date().toLocaleTimeString(),
              },
            }
          : team,
      ),
    )
  }

  const recallTeam = (teamId: string) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId ? { ...team, status: "available" as const, currentMission: undefined } : team,
      ),
    )
  }

  const filteredTeams = teams.filter((team) => {
    if (filterStatus !== "all" && team.status !== filterStatus) return false
    if (filterType !== "all" && team.type !== filterType) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Quick Deployment Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Deployment
          </CardTitle>
          <CardDescription>Rapid response deployment for emergency situations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              className="h-20 flex flex-col gap-2 bg-transparent"
              variant="outline"
              onClick={() => {
                const availableTeam = teams.find((t) => t.status === "available" && t.type === "rescue")
                if (availableTeam) deployTeam(availableTeam.id, "Ocean Rescue")
              }}
            >
              <Users className="h-6 w-6" />
              <span>Deploy Rescue</span>
            </Button>
            <Button
              className="h-20 flex flex-col gap-2 bg-transparent"
              variant="outline"
              onClick={() => {
                const availableTeam = teams.find((t) => t.status === "available" && t.type === "medical")
                if (availableTeam) deployTeam(availableTeam.id, "Medical Emergency")
              }}
            >
              <AlertTriangle className="h-6 w-6" />
              <span>Deploy Medical</span>
            </Button>
            <Button
              className="h-20 flex flex-col gap-2 bg-transparent"
              variant="outline"
              onClick={() => {
                const availableTeam = teams.find((t) => t.status === "available" && t.type === "fire")
                if (availableTeam) deployTeam(availableTeam.id, "Fire Response")
              }}
            >
              <Zap className="h-6 w-6" />
              <span>Deploy Fire</span>
            </Button>
            <Button
              className="h-20 flex flex-col gap-2 bg-transparent"
              variant="outline"
              onClick={() => {
                // Deploy all available teams
                teams
                  .filter((t) => t.status === "available")
                  .forEach((team) => {
                    deployTeam(team.id, "Mass Emergency Response")
                  })
              }}
            >
              <Play className="h-6 w-6" />
              <span>Deploy All</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="deployed">Deployed</SelectItem>
            <SelectItem value="busy">Busy</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="rescue">Rescue</SelectItem>
            <SelectItem value="medical">Medical</SelectItem>
            <SelectItem value="fire">Fire</SelectItem>
            <SelectItem value="police">Police</SelectItem>
            <SelectItem value="hazmat">Hazmat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(team.type)}
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                </div>
                <Badge className={`${getStatusColor(team.status)} text-white`}>{team.status}</Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {team.location.address}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Current Mission */}
              {team.currentMission && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-900">Current Mission</span>
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      {team.currentMission.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-800">{team.currentMission.type}</p>
                  <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    Started at {team.currentMission.startTime}
                  </p>
                </div>
              )}

              {/* Team Members */}
              <div>
                <h4 className="font-medium mb-2">Team Members ({team.members.length})</h4>
                <div className="space-y-1">
                  {team.members.slice(0, 3).map((member) => (
                    <div key={member.id} className="flex items-center justify-between text-sm">
                      <span>{member.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {member.role}
                        </Badge>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            member.status === "active" ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                  {team.members.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{team.members.length - 3} more members</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {team.status === "available" && (
                  <Button size="sm" onClick={() => deployTeam(team.id, "Emergency Response")} className="flex-1">
                    <Play className="h-3 w-3 mr-1" />
                    Deploy
                  </Button>
                )}
                {team.status === "deployed" && (
                  <Button size="sm" variant="outline" onClick={() => recallTeam(team.id)} className="flex-1">
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Recall
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  <Phone className="h-3 w-3 mr-1" />
                  Contact
                </Button>
                <Button size="sm" variant="outline">
                  <Navigation className="h-3 w-3 mr-1" />
                  Track
                </Button>
              </div>

              {/* Last Update */}
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last update: {team.lastUpdate}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
