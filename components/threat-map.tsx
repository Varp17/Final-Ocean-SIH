"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, AlertTriangle, Activity, ExternalLink } from "lucide-react"
import Link from "next/link"

export function ThreatMap() {
  // Mock threat data
  const threats = [
    {
      id: 1,
      location: "Mumbai Coast",
      coordinates: { lat: 19.076, lng: 72.8777 },
      type: "High Waves",
      severity: "high",
      reports: 12,
      lastUpdate: "5 minutes ago",
    },
    {
      id: 2,
      location: "Chennai Port",
      coordinates: { lat: 13.0827, lng: 80.2707 },
      type: "Storm Surge",
      severity: "medium",
      reports: 8,
      lastUpdate: "15 minutes ago",
    },
    {
      id: 3,
      location: "Kochi Harbor",
      coordinates: { lat: 9.9312, lng: 76.2673 },
      type: "Unusual Marine Activity",
      severity: "medium",
      reports: 5,
      lastUpdate: "1 hour ago",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600"
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-amber-500"
      case "low":
        return "bg-yellow-500"
      default:
        return "bg-slate-500"
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg">Interactive Threat Map</CardTitle>
              <CardDescription className="text-sm">
                Real-time visualization of ocean hazards and incident clustering
              </CardDescription>
            </div>
            <Link href="/live-map">
              <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm bg-transparent">
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                View Live Map
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {/* Placeholder for actual map integration */}
          <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg h-64 sm:h-80 lg:h-96 flex items-center justify-center">
            <div className="text-center space-y-2 p-4">
              <MapPin className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600 mx-auto" />
              <p className="text-sm sm:text-base text-slate-600">Interactive Map Component</p>
              <p className="text-xs sm:text-sm text-slate-500">
                Integration with mapping service (Google Maps, Mapbox, etc.)
              </p>
              <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-white/80 rounded-lg">
                <p className="text-xs text-slate-600">
                  <strong>Live Features Available:</strong> Real-time citizen locations, resizable danger zones,
                  interactive location pinning
                </p>
              </div>
            </div>

            {/* Mock threat markers */}
            {threats.map((threat, index) => (
              <div
                key={threat.id}
                className="absolute"
                style={{
                  left: `${20 + index * 25}%`,
                  top: `${30 + index * 15}%`,
                }}
              >
                <div
                  className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${getSeverityColor(threat.severity)} animate-pulse`}
                ></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Active Threat Zones</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Current hazard locations and severity levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {threats.map((threat) => (
                <div
                  key={threat.id}
                  className="flex items-start sm:items-center justify-between p-2 sm:p-3 border rounded-lg gap-3"
                >
                  <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <div
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-1 sm:mt-0 flex-shrink-0 ${getSeverityColor(threat.severity)}`}
                    ></div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-xs sm:text-sm text-slate-900 truncate">{threat.location}</div>
                      <div className="text-xs text-slate-600">{threat.type}</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge variant={threat.severity === "high" ? "destructive" : "default"} className="text-xs">
                      {threat.severity.toUpperCase()}
                    </Badge>
                    <div className="text-xs text-slate-500 mt-1">{threat.reports} reports</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Hotspot Analysis</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              AI-powered clustering and pattern detection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start sm:items-center justify-between p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg gap-3">
                <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-xs sm:text-sm text-red-900">Western Coast Cluster</div>
                    <div className="text-xs text-red-700">Mumbai to Goa region</div>
                  </div>
                </div>
                <Badge variant="destructive" className="text-xs flex-shrink-0">
                  HIGH RISK
                </Badge>
              </div>

              <div className="flex items-start sm:items-center justify-between p-2 sm:p-3 bg-amber-50 border border-amber-200 rounded-lg gap-3">
                <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-xs sm:text-sm text-amber-900">Eastern Coast Activity</div>
                    <div className="text-xs text-amber-700">Chennai to Visakhapatnam</div>
                  </div>
                </div>
                <Badge variant="default" className="text-xs flex-shrink-0">
                  MODERATE
                </Badge>
              </div>

              <div className="p-2 sm:p-3 bg-slate-50 border rounded-lg">
                <div className="text-xs sm:text-sm text-slate-600">
                  <strong>Pattern Analysis:</strong> Increased activity along western coastline correlates with monsoon
                  patterns. Recommend enhanced monitoring for next 48 hours.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
