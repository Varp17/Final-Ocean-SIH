"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, MapPin, Clock, AlertTriangle, Shield, Ambulance, Flame, Waves } from "lucide-react"

interface EmergencyContact {
  id: string
  name: string
  number: string
  type: "emergency" | "medical" | "fire" | "police" | "coast-guard" | "utility" | "local"
  description: string
  available24h: boolean
  icon: any
  priority: number
}

export default function EmergencyNumbers() {
  const [selectedType, setSelectedType] = useState<string>("all")

  const emergencyContacts: EmergencyContact[] = [
    {
      id: "1",
      name: "Emergency Services",
      number: "911",
      type: "emergency",
      description: "All emergencies - Police, Fire, Medical",
      available24h: true,
      icon: AlertTriangle,
      priority: 1,
    },
    {
      id: "2",
      name: "Coast Guard Emergency",
      number: "(555) 123-4567",
      type: "coast-guard",
      description: "Marine emergencies, water rescues, ocean hazards",
      available24h: true,
      icon: Waves,
      priority: 2,
    },
    {
      id: "3",
      name: "Fire Department",
      number: "(555) 234-5678",
      type: "fire",
      description: "Fire emergencies, hazmat incidents",
      available24h: true,
      icon: Flame,
      priority: 2,
    },
    {
      id: "4",
      name: "Emergency Medical Services",
      number: "(555) 345-6789",
      type: "medical",
      description: "Medical emergencies, ambulance services",
      available24h: true,
      icon: Ambulance,
      priority: 2,
    },
    {
      id: "5",
      name: "Police Department",
      number: "(555) 456-7890",
      type: "police",
      description: "Law enforcement, security emergencies",
      available24h: true,
      icon: Shield,
      priority: 2,
    },
    {
      id: "6",
      name: "Ocean Safety Hotline",
      number: "(555) 567-8901",
      type: "local",
      description: "Report ocean hazards, beach safety concerns",
      available24h: true,
      icon: Waves,
      priority: 3,
    },
    {
      id: "7",
      name: "Utility Emergency",
      number: "(555) 678-9012",
      type: "utility",
      description: "Power outages, gas leaks, water issues",
      available24h: true,
      icon: AlertTriangle,
      priority: 4,
    },
    {
      id: "8",
      name: "Non-Emergency Police",
      number: "(555) 789-0123",
      type: "police",
      description: "Non-urgent police matters",
      available24h: false,
      icon: Shield,
      priority: 5,
    },
  ]

  const contactTypes = [
    { value: "all", label: "All Services", count: emergencyContacts.length },
    { value: "emergency", label: "Emergency", count: emergencyContacts.filter((c) => c.type === "emergency").length },
    {
      value: "coast-guard",
      label: "Coast Guard",
      count: emergencyContacts.filter((c) => c.type === "coast-guard").length,
    },
    { value: "medical", label: "Medical", count: emergencyContacts.filter((c) => c.type === "medical").length },
    { value: "fire", label: "Fire", count: emergencyContacts.filter((c) => c.type === "fire").length },
    { value: "police", label: "Police", count: emergencyContacts.filter((c) => c.type === "police").length },
    { value: "local", label: "Local Services", count: emergencyContacts.filter((c) => c.type === "local").length },
  ]

  const filteredContacts =
    selectedType === "all"
      ? emergencyContacts.sort((a, b) => a.priority - b.priority)
      : emergencyContacts.filter((contact) => contact.type === selectedType).sort((a, b) => a.priority - b.priority)

  const handleCall = (number: string, name: string) => {
    // In a real app, this would initiate a call
    console.log(`[v0] Calling ${name} at ${number}`)

    // For demo purposes, show an alert
    if (number === "911") {
      alert(
        `🚨 EMERGENCY CALL\n\nCalling ${name}\nNumber: ${number}\n\nThis would dial emergency services in a real app.`,
      )
    } else {
      alert(`📞 Calling ${name}\nNumber: ${number}`)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div>
              <h2 className="text-2xl font-bold text-red-900">Emergency Contacts</h2>
              <p className="text-red-700">Quick access to emergency services and local authorities</p>
            </div>
          </div>

          <div className="bg-red-100 rounded-lg p-4 border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-red-900">For immediate emergencies, call 911</span>
            </div>
            <p className="text-sm text-red-700">
              If you are in immediate danger or witnessing a life-threatening emergency, call 911 immediately. For
              non-emergency hazard reporting, use the chatbot or contact local services below.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {contactTypes.map((type) => (
              <Button
                key={type.value}
                variant={selectedType === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type.value)}
                className="flex items-center gap-2"
              >
                {type.label}
                <Badge variant="secondary" className="text-xs">
                  {type.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredContacts.map((contact) => {
          const IconComponent = contact.icon
          return (
            <Card
              key={contact.id}
              className={`transition-all hover:shadow-lg ${
                contact.priority === 1
                  ? "border-red-300 bg-red-50"
                  : contact.priority === 2
                    ? "border-orange-300 bg-orange-50"
                    : "border-gray-200"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        contact.priority === 1 ? "bg-red-100" : contact.priority === 2 ? "bg-orange-100" : "bg-blue-100"
                      }`}
                    >
                      <IconComponent
                        className={`h-6 w-6 ${
                          contact.priority === 1
                            ? "text-red-600"
                            : contact.priority === 2
                              ? "text-orange-600"
                              : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{contact.name}</h3>
                      <p className="text-sm text-gray-600">{contact.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {contact.available24h && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        24/7
                      </Badge>
                    )}
                    {contact.priority === 1 && (
                      <Badge variant="destructive" className="text-xs">
                        EMERGENCY
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-mono font-bold text-gray-900">{contact.number}</span>
                  </div>

                  <Button
                    onClick={() => handleCall(contact.number, contact.name)}
                    className={`w-full ${
                      contact.priority === 1
                        ? "bg-red-600 hover:bg-red-700"
                        : contact.priority === 2
                          ? "bg-orange-600 hover:bg-orange-700"
                          : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call {contact.name}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location-Based Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">When to Call Emergency Services:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Life-threatening emergencies</li>
                <li>• Immediate danger to people or property</li>
                <li>• Crimes in progress</li>
                <li>• Severe weather emergencies</li>
                <li>• Major infrastructure failures</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">For Non-Emergency Reporting:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use the Atlas chatbot for hazard reporting</li>
                <li>• Contact local services for minor issues</li>
                <li>• Report infrastructure problems to utilities</li>
                <li>• Use online reporting systems when available</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
