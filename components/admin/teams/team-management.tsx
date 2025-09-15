"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Plus, Edit, Trash2, Phone, Mail, MapPin, Clock, UserPlus, Settings, Award } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  phone: string
  status: "active" | "inactive" | "on-leave"
  certifications: string[]
  joinDate: string
  lastActive: string
}

interface Team {
  id: string
  name: string
  type: "rescue" | "medical" | "fire" | "police" | "hazmat"
  description: string
  status: "active" | "inactive" | "training"
  members: TeamMember[]
  equipment: string[]
  baseLocation: string
  createdDate: string
  lastDeployment?: string
}

const mockTeams: Team[] = [
  {
    id: "team-001",
    name: "Alpha Rescue Unit",
    type: "rescue",
    description: "Primary ocean rescue and water emergency response team",
    status: "active",
    baseLocation: "Manhattan Harbor Station",
    createdDate: "2023-01-15",
    lastDeployment: "2024-01-10",
    equipment: ["Rescue Boat", "Diving Gear", "Medical Kit", "Communication Radio"],
    members: [
      {
        id: "m1",
        name: "John Smith",
        role: "Team Leader",
        email: "john.smith@emergency.gov",
        phone: "+1-555-0101",
        status: "active",
        certifications: ["Advanced Water Rescue", "CPR", "First Aid", "Team Leadership"],
        joinDate: "2023-01-15",
        lastActive: "2024-01-10 14:30",
      },
      {
        id: "m2",
        name: "Sarah Johnson",
        role: "Medic",
        email: "sarah.johnson@emergency.gov",
        phone: "+1-555-0102",
        status: "active",
        certifications: ["EMT-P", "Advanced Cardiac Life Support", "Trauma Care"],
        joinDate: "2023-02-01",
        lastActive: "2024-01-10 14:25",
      },
    ],
  },
]

export function TeamManagement() {
  const [teams, setTeams] = useState<Team[]>(mockTeams)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const [newTeam, setNewTeam] = useState({
    name: "",
    type: "rescue" as Team["type"],
    description: "",
    baseLocation: "",
  })

  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    certifications: "",
  })

  const createTeam = () => {
    const team: Team = {
      id: `team-${Date.now()}`,
      ...newTeam,
      status: "active",
      members: [],
      equipment: [],
      createdDate: new Date().toISOString().split("T")[0],
    }
    setTeams((prev) => [...prev, team])
    setNewTeam({ name: "", type: "rescue", description: "", baseLocation: "" })
    setIsCreateTeamOpen(false)
  }

  const addMember = () => {
    if (!selectedTeam) return

    const member: TeamMember = {
      id: `m-${Date.now()}`,
      ...newMember,
      status: "active",
      certifications: newMember.certifications.split(",").map((c) => c.trim()),
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString(),
    }

    setTeams((prev) =>
      prev.map((team) => (team.id === selectedTeam.id ? { ...team, members: [...team.members, member] } : team)),
    )

    setNewMember({ name: "", role: "", email: "", phone: "", certifications: "" })
    setIsAddMemberOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-red-500"
      case "training":
        return "bg-yellow-500"
      case "on-leave":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>Set up a new emergency response team with basic information.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter team name"
                />
              </div>
              <div>
                <Label htmlFor="team-type">Team Type</Label>
                <Select
                  value={newTeam.type}
                  onValueChange={(value: Team["type"]) => setNewTeam((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rescue">Rescue</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="fire">Fire</SelectItem>
                    <SelectItem value="police">Police</SelectItem>
                    <SelectItem value="hazmat">Hazmat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="team-description">Description</Label>
                <Textarea
                  id="team-description"
                  value={newTeam.description}
                  onChange={(e) => setNewTeam((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the team's role and responsibilities"
                />
              </div>
              <div>
                <Label htmlFor="base-location">Base Location</Label>
                <Input
                  id="base-location"
                  value={newTeam.baseLocation}
                  onChange={(e) => setNewTeam((prev) => ({ ...prev, baseLocation: e.target.value }))}
                  placeholder="Enter base location"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateTeamOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createTeam}>Create Team</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teams List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold">Teams ({filteredTeams.length})</h3>
          <div className="space-y-2">
            {filteredTeams.map((team) => (
              <Card
                key={team.id}
                className={`cursor-pointer transition-colors ${
                  selectedTeam?.id === team.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedTeam(team)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{team.name}</h4>
                    <Badge className={`${getStatusColor(team.status)} text-white`}>{team.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{team.type}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {team.members.length} members
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {team.baseLocation}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Details */}
        <div className="lg:col-span-2">
          {selectedTeam ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {selectedTeam.name}
                    </CardTitle>
                    <CardDescription>{selectedTeam.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(selectedTeam.status)} text-white`}>{selectedTeam.status}</Badge>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="members" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="members">Members</TabsTrigger>
                    <TabsTrigger value="equipment">Equipment</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="members" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Team Members ({selectedTeam.members.length})</h4>
                      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Member
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Team Member</DialogTitle>
                            <DialogDescription>Add a new member to {selectedTeam.name}.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="member-name">Full Name</Label>
                              <Input
                                id="member-name"
                                value={newMember.name}
                                onChange={(e) => setNewMember((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter full name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="member-role">Role</Label>
                              <Input
                                id="member-role"
                                value={newMember.role}
                                onChange={(e) => setNewMember((prev) => ({ ...prev, role: e.target.value }))}
                                placeholder="e.g., Team Leader, Medic, Specialist"
                              />
                            </div>
                            <div>
                              <Label htmlFor="member-email">Email</Label>
                              <Input
                                id="member-email"
                                type="email"
                                value={newMember.email}
                                onChange={(e) => setNewMember((prev) => ({ ...prev, email: e.target.value }))}
                                placeholder="Enter email address"
                              />
                            </div>
                            <div>
                              <Label htmlFor="member-phone">Phone</Label>
                              <Input
                                id="member-phone"
                                value={newMember.phone}
                                onChange={(e) => setNewMember((prev) => ({ ...prev, phone: e.target.value }))}
                                placeholder="Enter phone number"
                              />
                            </div>
                            <div>
                              <Label htmlFor="member-certifications">Certifications</Label>
                              <Input
                                id="member-certifications"
                                value={newMember.certifications}
                                onChange={(e) => setNewMember((prev) => ({ ...prev, certifications: e.target.value }))}
                                placeholder="Enter certifications (comma separated)"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={addMember}>Add Member</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-3">
                      {selectedTeam.members.map((member) => (
                        <Card key={member.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-medium">{member.name}</h5>
                                  <Badge variant="outline">{member.role}</Badge>
                                  <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`} />
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {member.email}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {member.phone}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  {member.certifications.slice(0, 3).map((cert, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      <Award className="h-3 w-3 mr-1" />
                                      {cert}
                                    </Badge>
                                  ))}
                                  {member.certifications.length > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{member.certifications.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Phone className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="equipment" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Equipment & Resources</h4>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Equipment
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedTeam.equipment.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{item}</span>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-4">
                    <h4 className="font-medium">Deployment History</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-3 border rounded">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Ocean Rescue Operation</p>
                          <p className="text-xs text-muted-foreground">January 10, 2024 - 2 hours</p>
                        </div>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      <div className="flex items-center gap-2 p-3 border rounded">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Emergency Medical Response</p>
                          <p className="text-xs text-muted-foreground">January 8, 2024 - 1.5 hours</p>
                        </div>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Team</h3>
                  <p className="text-muted-foreground">Choose a team from the list to view and manage its details.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
