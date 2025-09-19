"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Users, Clock } from "lucide-react"

export function DeploymentMap() {
  const deployments = [
    {
      id: "1",
      teamName: "Coast Guard Alpha",
      location: "Mumbai Port",
      coordinates: { lat: 18.9388, lng: 72.8354 },
      status: "on-scene",
      personnel: 8,
      eta: null,
    },
    {
      id: "2",
      teamName: "Marine Response Beta",
      location: "Chennai Marina",
      coordinates: { lat: 13.0475, lng: 80.2824 },
      status: "en-route",
      personnel: 6,
      eta: "15 min",
    },
    {
      id: "3",
      teamName: "Coastal Patrol Delta",
      location: "Goa Anjuna Beach",
      coordinates: { lat: 15.5732, lng: 73.7395 },
      status: "dispatched",
      personnel: 4,
      eta: "45 min",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground">Deployment Locations</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for interactive map */}
          <div className="h-96 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Interactive deployment map will be displayed here</p>
              <p className="text-sm text-muted-foreground">Showing real-time team locations and routes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Location Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deployments.map((deployment) => (
          <Card key={deployment.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-card-foreground">{deployment.teamName}</CardTitle>
                <Badge variant={deployment.status === "on-scene" ? "default" : "secondary"}>{deployment.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-card-foreground">{deployment.location}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-chart-2" />
                <span className="text-card-foreground">{deployment.personnel} personnel</span>
              </div>

              {deployment.eta && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-chart-3" />
                  <span className="text-card-foreground">ETA: {deployment.eta}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Navigation className="h-4 w-4 mr-1" />
                  Track
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
