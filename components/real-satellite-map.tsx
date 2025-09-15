"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Layers,
  AlertTriangle,
  Shield,
  Navigation,
  Satellite,
  MapIcon,
  Radio,
  Thermometer,
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react"
import {
  mumbaiLocations,
  mumbaiHazards,
  mumbaiSafeZones,
  mumbaiBounds,
  type HazardPoint,
} from "@/lib/data/mumbai-locations"

interface RealSatelliteMapProps {
  userRole: "citizen" | "admin" | "analyst"
  showAnalytics?: boolean
}

interface MapLayer {
  id: string
  name: string
  visible: boolean
  color: string
  icon: React.ReactNode
}

export function RealSatelliteMap({ userRole, showAnalytics = false }: RealSatelliteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [mapStyle, setMapStyle] = useState<"satellite" | "street">("satellite")
  const [zoom, setZoom] = useState(11)
  const [center, setCenter] = useState(mumbaiBounds.center)
  const [selectedHazard, setSelectedHazard] = useState<HazardPoint | null>(null)
  const [realTimeData, setRealTimeData] = useState(mumbaiHazards)

  const [layers, setLayers] = useState<MapLayer[]>([
    {
      id: "hazards",
      name: "Ocean Hazards",
      visible: true,
      color: "#ef4444",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      id: "safe_zones",
      name: "Safe Zones",
      visible: true,
      color: "#16a34a",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      id: "locations",
      name: "Key Locations",
      visible: true,
      color: "#3b82f6",
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      id: "weather",
      name: "Weather Overlay",
      visible: false,
      color: "#0ea5e9",
      icon: <Thermometer className="h-4 w-4" />,
    },
    ...(userRole === "admin"
      ? [
          {
            id: "response_teams",
            name: "Response Teams",
            visible: true,
            color: "#7c3aed",
            icon: <Radio className="h-4 w-4" />,
          },
        ]
      : []),
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => {
        // Randomly update hazard severity or add new hazards
        const updated = prev.map((hazard) => ({
          ...hazard,
          timestamp: Math.random() < 0.1 ? new Date() : hazard.timestamp,
          severity:
            Math.random() < 0.05
              ? (["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high")
              : hazard.severity,
        }))

        // Occasionally add a new hazard
        if (Math.random() < 0.02) {
          const randomLocation = mumbaiLocations[Math.floor(Math.random() * mumbaiLocations.length)]
          const newHazard: HazardPoint = {
            id: `h_${Date.now()}`,
            lat: randomLocation.lat + (Math.random() - 0.5) * 0.01,
            lng: randomLocation.lng + (Math.random() - 0.5) * 0.01,
            type: ["flood", "high_waves", "debris", "pollution"][Math.floor(Math.random() * 4)] as any,
            severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as any,
            verified: Math.random() > 0.3,
            timestamp: new Date(),
            description: "Real-time hazard detected by monitoring system",
            location: `Near ${randomLocation.name}`,
          }
          return [...updated.slice(-20), newHazard] // Keep last 20 hazards
        }

        return updated
      })
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const toggleLayer = (layerId: string) => {
    setLayers((prev) => prev.map((layer) => (layer.id === layerId ? { ...layer, visible: !layer.visible } : layer)))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "#dc2626"
      case "medium":
        return "#f59e0b"
      case "low":
        return "#16a34a"
      default:
        return "#6b7280"
    }
  }

  const getHazardIcon = (type: string) => {
    switch (type) {
      case "flood":
        return "🌊"
      case "high_waves":
        return "〰️"
      case "oil_spill":
        return "🛢️"
      case "debris":
        return "🗑️"
      case "pollution":
        return "☠️"
      default:
        return "⚠️"
    }
  }

  const zoomIn = () => setZoom((prev) => Math.min(prev + 1, 18))
  const zoomOut = () => setZoom((prev) => Math.max(prev - 1, 8))
  const resetView = () => {
    setCenter(mumbaiBounds.center)
    setZoom(11)
  }

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Map Container */}
      <div className="flex-1 relative">
        <div
          ref={mapContainerRef}
          className="w-full h-64 sm:h-80 lg:h-full relative overflow-hidden"
          style={{
            backgroundImage:
              mapStyle === "satellite" ? `url('/mumbai-satellite-view-from-space-showing-coastline.jpg')` : `url('/mumbai-street-map-showing-roads-and-districts.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {layers.find((l) => l.id === "hazards")?.visible &&
            realTimeData.map((hazard) => {
              // Calculate position based on lat/lng relative to Mumbai bounds
              const x = ((hazard.lng - mumbaiBounds.west) / (mumbaiBounds.east - mumbaiBounds.west)) * 100
              const y = ((mumbaiBounds.north - hazard.lat) / (mumbaiBounds.north - mumbaiBounds.south)) * 100

              return (
                <div
                  key={hazard.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onClick={() => setSelectedHazard(hazard)}
                >
                  <div className="relative group">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-sm animate-pulse"
                      style={{ backgroundColor: getSeverityColor(hazard.severity) }}
                    >
                      {getHazardIcon(hazard.type)}
                    </div>
                    {hazard.verified && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
                    )}

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 max-w-48">
                      <div className="font-semibold">{hazard.location}</div>
                      <div>
                        {hazard.type.replace("_", " ")} - {hazard.severity} risk
                      </div>
                      <div className="text-gray-300">{hazard.description}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-2 border-r-2 border-t-2 border-transparent border-t-black" />
                    </div>
                  </div>
                </div>
              )
            })}

          {layers.find((l) => l.id === "locations")?.visible &&
            mumbaiLocations.map((location) => {
              const x = ((location.lng - mumbaiBounds.west) / (mumbaiBounds.east - mumbaiBounds.west)) * 100
              const y = ((mumbaiBounds.north - location.lat) / (mumbaiBounds.north - mumbaiBounds.south)) * 100

              return (
                <div
                  key={location.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div className="relative group">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                      <div className="font-semibold">{location.name}</div>
                      <div className="text-gray-300">{location.description}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-2 border-r-2 border-t-2 border-transparent border-t-black" />
                    </div>
                  </div>
                </div>
              )
            })}

          {layers.find((l) => l.id === "safe_zones")?.visible &&
            mumbaiSafeZones.map((zone) => {
              const x = ((zone.lng - mumbaiBounds.west) / (mumbaiBounds.east - mumbaiBounds.west)) * 100
              const y = ((mumbaiBounds.north - zone.lat) / (mumbaiBounds.north - mumbaiBounds.south)) * 100

              return (
                <div
                  key={zone.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div className="relative group">
                    <div className="w-8 h-8 bg-green-500 bg-opacity-20 border-2 border-green-500 rounded-lg flex items-center justify-center">
                      <Shield className="h-4 w-4 text-green-700" />
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 max-w-48">
                      <div className="font-semibold">{zone.name}</div>
                      <div>
                        Capacity: {zone.currentOccupancy}/{zone.capacity}
                      </div>
                      <div className="text-gray-300">Facilities: {zone.facilities.join(", ")}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-2 border-r-2 border-t-2 border-transparent border-t-black" />
                    </div>
                  </div>
                </div>
              )
            })}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-40">
            <Button size="sm" variant="outline" className="bg-white h-9 w-9 p-0" onClick={zoomIn}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="bg-white h-9 w-9 p-0" onClick={zoomOut}>
              <Minus className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="bg-white h-9 w-9 p-0" onClick={resetView}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Map Style Toggle */}
          <div className="absolute top-4 left-4 z-40">
            <div className="flex gap-1 bg-white rounded-lg p-1 shadow-lg">
              <Button
                size="sm"
                variant={mapStyle === "satellite" ? "default" : "ghost"}
                onClick={() => setMapStyle("satellite")}
                className="h-8 px-3"
              >
                <Satellite className="h-4 w-4 mr-1" />
                Satellite
              </Button>
              <Button
                size="sm"
                variant={mapStyle === "street" ? "default" : "ghost"}
                onClick={() => setMapStyle("street")}
                className="h-8 px-3"
              >
                <MapIcon className="h-4 w-4 mr-1" />
                Street
              </Button>
            </div>
          </div>

          {/* Zoom Level Indicator */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs z-40">
            Zoom: {zoom}
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l lg:overflow-y-auto">
        <div className="p-4 space-y-4 max-h-96 lg:max-h-none overflow-y-auto">
          <Tabs defaultValue="layers" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="layers">Layers</TabsTrigger>
              <TabsTrigger value="hazards">Hazards</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="layers" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Map Layers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {layers.map((layer) => (
                    <div key={layer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }} />
                        <span className="text-sm">{layer.name}</span>
                      </div>
                      <Switch checked={layer.visible} onCheckedChange={() => toggleLayer(layer.id)} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Live Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Hazards:</span>
                    <Badge variant="destructive" className="text-xs">
                      {realTimeData.filter((h) => h.severity === "high").length}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Verified Reports:</span>
                    <Badge variant="secondary" className="text-xs">
                      {realTimeData.filter((h) => h.verified).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Safe Zones:</span>
                    <Badge variant="secondary" className="text-xs">
                      {mumbaiSafeZones.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Key Locations:</span>
                    <Badge variant="secondary" className="text-xs">
                      {mumbaiLocations.length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hazards" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Recent Hazards
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                  {realTimeData
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                    .slice(0, 10)
                    .map((hazard) => (
                      <div
                        key={hazard.id}
                        className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedHazard(hazard)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">{hazard.location}</span>
                          <Badge
                            variant={
                              hazard.severity === "high"
                                ? "destructive"
                                : hazard.severity === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {hazard.severity}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 mb-1">
                          {hazard.type.replace("_", " ")} • {hazard.verified ? "✓ Verified" : "Unverified"}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{hazard.description}</div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              {showAnalytics && (
                <>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Hazard Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {["flood", "high_waves", "oil_spill", "debris", "pollution"].map((type) => {
                        const count = realTimeData.filter((h) => h.type === type).length
                        const percentage = (count / realTimeData.length) * 100
                        return (
                          <div key={type} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="capitalize">{type.replace("_", " ")}</span>
                              <span>{count}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Risk Assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-xs">
                        <div className="flex justify-between mb-1">
                          <span>Overall Risk Level:</span>
                          <Badge variant="destructive" className="text-xs">
                            HIGH
                          </Badge>
                        </div>
                        <div className="text-gray-600">
                          {realTimeData.filter((h) => h.severity === "high").length} high-severity hazards detected
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Selected Hazard Modal */}
      {selectedHazard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Hazard Details
                <Button variant="ghost" size="sm" onClick={() => setSelectedHazard(null)} className="h-8 w-8 p-0">
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium">{selectedHazard.location}</div>
                <div className="text-xs text-gray-600">
                  {selectedHazard.lat.toFixed(4)}, {selectedHazard.lng.toFixed(4)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    selectedHazard.severity === "high"
                      ? "destructive"
                      : selectedHazard.severity === "medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {selectedHazard.severity.toUpperCase()} RISK
                </Badge>
                {selectedHazard.verified && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    ✓ VERIFIED
                  </Badge>
                )}
              </div>

              <div>
                <div className="text-sm font-medium mb-1">Type: {selectedHazard.type.replace("_", " ")}</div>
                <div className="text-sm text-gray-600">{selectedHazard.description}</div>
              </div>

              <div className="text-xs text-gray-500">Reported: {selectedHazard.timestamp.toLocaleString()}</div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  <Navigation className="h-4 w-4 mr-1" />
                  Navigate
                </Button>
                {userRole === "admin" && (
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Deploy Team
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
