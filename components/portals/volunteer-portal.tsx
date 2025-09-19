"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  MapPin,
  Clock,
  CheckCircle,
  Camera,
  Upload,
  Star,
  Award,
  Navigation,
  Phone,
  MessageSquare,
  Shield,
  Activity,
  Target,
} from "lucide-react"

interface VolunteerIncident {
  id: string
  type: string
  location: string
  coordinates: { lat: number; lng: number }
  priority: "low" | "medium" | "high" | "critical"
  status: "assigned" | "in_progress" | "completed" | "verified"
  description: string
  assignedAt: string
  distance: number
  estimatedTime: string
  requiredSkills: string[]
  contactPerson?: {
    name: string
    phone: string
    role: string
  }
}

interface VolunteerProfile {
  id: string
  name: string
  email: string
  phone: string
  skills: string[]
  trustScore: number
  completedMissions: number
  verificationRate: number
  location: { lat: number; lng: number; address: string }
  availability: "available" | "busy" | "offline"
  certifications: string[]
  joinedDate: string
}

export function VolunteerPortal() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedIncident, setSelectedIncident] = useState<VolunteerIncident | null>(null)
  const [verificationDialog, setVerificationDialog] = useState(false)
  const [verificationData, setVerificationData] = useState({
    photos: [] as File[],
    description: "",
    location: "",
    status: "completed",
  })

  // Mock volunteer profile
  const [volunteerProfile] = useState<VolunteerProfile>({
    id: "vol-001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91-9876543210",
    skills: ["First Aid", "Swimming", "Local Knowledge", "Photography"],
    trustScore: 4.7,
    completedMissions: 23,
    verificationRate: 91,
    location: { lat: 19.076, lng: 72.8777, address: "Mumbai, Maharashtra" },
    availability: "available",
    certifications: ["CPR Certified", "Disaster Response Training"],
    joinedDate: "2024-03-15",
  })

  // Mock assigned incidents
  const [assignedIncidents, setAssignedIncidents] = useState<VolunteerIncident[]>([
    {
      id: "inc-001",
      type: "High Waves Verification",
      location: "Juhu Beach, Mumbai",
      coordinates: { lat: 19.1075, lng: 72.8263 },
      priority: "high",
      status: "assigned",
      description: "Multiple reports of unusually high waves at Juhu Beach. Need on-ground verification and photos.",
      assignedAt: "2025-01-19T14:30:00Z",
      distance: 2.3,
      estimatedTime: "15 mins",
      requiredSkills: ["Photography", "Local Knowledge"],
      contactPerson: {
        name: "Dr. Priya Sharma",
        phone: "+91-9876543211",
        role: "Marine Analyst",
      },
    },
    {
      id: "inc-002",
      type: "Coastal Erosion Assessment",
      location: "Versova Beach, Mumbai",
      coordinates: { lat: 19.1317, lng: 72.8142 },
      priority: "medium",
      status: "in_progress",
      description: "Assess coastal erosion damage after recent storms. Document changes in shoreline.",
      assignedAt: "2025-01-19T12:00:00Z",
      distance: 4.1,
      estimatedTime: "25 mins",
      requiredSkills: ["Photography", "Environmental Assessment"],
    },
    {
      id: "inc-003",
      type: "Oil Spill Monitoring",
      location: "Mahim Bay, Mumbai",
      coordinates: { lat: 19.0412, lng: 72.8397 },
      priority: "critical",
      status: "completed",
      description: "Monitor oil spill cleanup progress and document environmental impact.",
      assignedAt: "2025-01-19T09:00:00Z",
      distance: 1.8,
      estimatedTime: "12 mins",
      requiredSkills: ["Environmental Assessment", "Photography"],
    },
  ])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in_progress":
        return "bg-blue-500"
      case "assigned":
        return "bg-yellow-500"
      case "verified":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleAcceptIncident = (incidentId: string) => {
    setAssignedIncidents((prev) =>
      prev.map((inc) => (inc.id === incidentId ? { ...inc, status: "in_progress" as const } : inc)),
    )
  }

  const handleCompleteIncident = (incident: VolunteerIncident) => {
    setSelectedIncident(incident)
    setVerificationDialog(true)
  }

  const submitVerification = () => {
    if (selectedIncident) {
      setAssignedIncidents((prev) =>
        prev.map((inc) => (inc.id === selectedIncident.id ? { ...inc, status: "completed" as const } : inc)),
      )
      setVerificationDialog(false)
      setSelectedIncident(null)
      setVerificationData({ photos: [], description: "", location: "", status: "completed" })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Volunteer Portal</h1>
                <p className="text-sm text-gray-600">Ocean Disaster Response Network</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={`${getStatusColor(volunteerProfile.availability)} text-white`}>
                {volunteerProfile.availability}
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium">{volunteerProfile.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-600">{volunteerProfile.trustScore}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="incidents">My Incidents</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Trust Score</p>
                      <p className="text-2xl font-bold text-blue-600">{volunteerProfile.trustScore}</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{volunteerProfile.completedMissions}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Verification Rate</p>
                      <p className="text-2xl font-bold text-purple-600">{volunteerProfile.verificationRate}%</p>
                    </div>
                    <Award className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Incidents</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {
                          assignedIncidents.filter((inc) => inc.status === "assigned" || inc.status === "in_progress")
                            .length
                        }
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Nearby Incidents Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Nearby Incidents
                </CardTitle>
                <CardDescription>Incidents within 5km of your location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive map showing nearby incidents</p>
                    <p className="text-sm text-gray-500">Integration with mapping service required</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Completed oil spill monitoring at Mahim Bay</p>
                      <p className="text-xs text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Started coastal erosion assessment at Versova Beach</p>
                      <p className="text-xs text-gray-600">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Target className="h-5 w-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Assigned to high waves verification at Juhu Beach</p>
                      <p className="text-xs text-gray-600">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Incidents Tab */}
          <TabsContent value="incidents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {assignedIncidents.map((incident) => (
                <Card key={incident.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{incident.type}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {incident.location}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`${getPriorityColor(incident.priority)} border`}>{incident.priority}</Badge>
                        <Badge className={`${getStatusColor(incident.status)} text-white`}>{incident.status}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-700">{incident.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Navigation className="h-4 w-4 text-gray-400" />
                        <span>{incident.distance}km away</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{incident.estimatedTime}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Required Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {incident.requiredSkills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {incident.contactPerson && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium">Contact Person</p>
                        <p className="text-sm">{incident.contactPerson.name}</p>
                        <p className="text-xs text-gray-600">{incident.contactPerson.role}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      {incident.status === "assigned" && (
                        <Button size="sm" className="flex-1" onClick={() => handleAcceptIncident(incident.id)}>
                          Accept Mission
                        </Button>
                      )}
                      {incident.status === "in_progress" && (
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleCompleteIncident(incident)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete & Verify
                        </Button>
                      )}
                      {incident.status === "completed" && (
                        <Badge className="flex-1 justify-center bg-green-100 text-green-800">Completed</Badge>
                      )}
                      <Button size="sm" variant="outline">
                        <Navigation className="h-4 w-4 mr-1" />
                        Navigate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input value={volunteerProfile.name} readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input value={volunteerProfile.email} readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input value={volunteerProfile.phone} readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input value={volunteerProfile.location.address} readOnly />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills & Certifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {volunteerProfile.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Certifications</label>
                    <div className="flex flex-wrap gap-2">
                      {volunteerProfile.certifications.map((cert) => (
                        <Badge key={cert} className="bg-green-100 text-green-800">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Availability Status</label>
                    <Select defaultValue={volunteerProfile.availability}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="busy">Busy</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{volunteerProfile.trustScore}</div>
                    <p className="text-sm text-gray-600">Trust Score</p>
                    <div className="flex justify-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= Math.floor(volunteerProfile.trustScore) ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{volunteerProfile.completedMissions}</div>
                    <p className="text-sm text-gray-600">Missions Completed</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{volunteerProfile.verificationRate}%</div>
                    <p className="text-sm text-gray-600">Verification Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Training Programs</CardTitle>
                <CardDescription>Enhance your skills with specialized training</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Advanced First Aid</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Learn advanced first aid techniques for emergency situations
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="outline">4 hours</Badge>
                      <Button size="sm">Enroll</Button>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Marine Safety</h4>
                    <p className="text-sm text-gray-600 mt-1">Water rescue and marine safety protocols</p>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="outline">6 hours</Badge>
                      <Button size="sm">Enroll</Button>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Disaster Communication</h4>
                    <p className="text-sm text-gray-600 mt-1">Effective communication during disaster response</p>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="outline">3 hours</Badge>
                      <Button size="sm">Enroll</Button>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Environmental Assessment</h4>
                    <p className="text-sm text-gray-600 mt-1">Assess environmental damage and document findings</p>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="outline">5 hours</Badge>
                      <Button size="sm">Enroll</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Verification Dialog */}
      <Dialog open={verificationDialog} onOpenChange={setVerificationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complete Mission Verification</DialogTitle>
            <DialogDescription>Provide verification details for: {selectedIncident?.type}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Upload Photos</label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload photos or drag and drop</p>
                <Input type="file" multiple accept="image/*" className="mt-2" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe what you observed and any actions taken..."
                value={verificationData.description}
                onChange={(e) => setVerificationData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Location Confirmation</label>
              <Input
                placeholder="Confirm exact location"
                value={verificationData.location}
                onChange={(e) => setVerificationData((prev) => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Status Update</label>
              <Select
                value={verificationData.status}
                onValueChange={(value) => setVerificationData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Task Completed</SelectItem>
                  <SelectItem value="partial">Partially Completed</SelectItem>
                  <SelectItem value="unable">Unable to Complete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setVerificationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={submitVerification}>
              <Upload className="h-4 w-4 mr-2" />
              Submit Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
