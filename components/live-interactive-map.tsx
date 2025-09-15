"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Users,
  AlertTriangle,
  Navigation,
  Crosshair,
  Wifi,
  WifiOff,
  Shield,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Cloud,
  Sun,
  CloudRain,
  Wind,
} from "lucide-react"
import { useWebSocket } from "@/lib/hooks/use-websocket"
import { ZoneAlertSystem } from "@/components/zone-alert-system"
import { EnhancedMapIntegration } from "@/components/enhanced-map-integration"
import { generateZoneAlert, isInsideZone, calculateDistance, type Zone as ZoneType } from "@/lib/utils/zone-detection"

interface CitizenLocation {
  id: string
  lat: number
  lng: number
  status: "safe" | "danger" | "unknown"
  lastSeen: string
  reportCount: number
  name?: string
  isLive: boolean
}

interface DangerZone {
  id: string
  lat: number
  lng: number
  radius: number
  severity: "low" | "medium" | "high" | "critical"
  type: string
  reports: number
  lastUpdate: string
  createdBy: "auto" | "admin"
  isActive: boolean
}

interface SafeZone {
  id: string
  lat: number
  lng: number
  radius: number
  name: string
  type: "shelter" | "hospital" | "school" | "police" | "fire_station"
  capacity: number
  isActive: boolean
}

interface ReportPoint {
  id: string
  lat: number
  lng: number
  severity: "low" | "medium" | "high" | "critical"
  type: string
  description: string
  timestamp: string
  citizenId: string
  verified: boolean
}

interface TeamLocation {
  id: string
  lat: number
  lng: number
  teamType: "rescue" | "medical" | "police" | "fire"
  status: "available" | "responding" | "busy"
  destination?: { lat: number; lng: number }
  eta?: string
}

interface WeatherData {
  temperature: number
  condition: "sunny" | "cloudy" | "rainy" | "stormy"
  windSpeed: number
  humidity: number
  visibility: number
}

export function LiveInteractiveMap({ userRole = "citizen" }: { userRole?: "citizen" | "admin" | "analyst" }) {
  const [citizenLocations, setCitizenLocations] = useState<CitizenLocation[]>([])
  const [dangerZones, setDangerZones] = useState<DangerZone[]>([])
  const [safeZones, setSafeZones] = useState<SafeZone[]>([])
  const [reportPoints, setReportPoints] = useState<ReportPoint[]>([])
  const [teamLocations, setTeamLocations] = useState<TeamLocation[]>([])
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 28,
    condition: "cloudy",
    windSpeed: 15,
    humidity: 75,
    visibility: 8,
  })

  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [isCreatingZone, setIsCreatingZone] = useState<"danger" | "safe" | null>(null)
  const [newZoneRadius, setNewZoneRadius] = useState(1000)
  const [newZoneName, setNewZoneName] = useState("")
  const [newZoneType, setNewZoneType] = useState("")

  const [visibleLayers, setVisibleLayers] = useState({
    citizens: true,
    dangerZones: true,
    safeZones: true,
    reports: true,
    teams: userRole === "admin",
    weather: true,
  })

  const mapRef = useRef<HTMLDivElement>(null)
  const { isConnected, connectionError, messages, sendMessage } = useWebSocket()

  const [zoneAlerts, setZoneAlerts] = useState<{
    type: "danger" | "safe" | "warning" | "clear"
    message: string
    nearestSafeZone?: { zone: ZoneType; distance: number }
  } | null>(null)

  const convertedDangerZones: ZoneType[] = dangerZones.map((zone) => ({
    id: zone.id,
    lat: zone.lat,
    lng: zone.lng,
    radius: zone.radius,
    type: "danger" as const,
    severity: zone.severity,
    name: zone.type,
  }))

  const convertedSafeZones: ZoneType[] = safeZones.map((zone) => ({
    id: zone.id,
    lat: zone.lat,
    lng: zone.lng,
    radius: zone.radius,
    type: "safe" as const,
    name: zone.name,
  }))

  useEffect(() => {
    messages.forEach((message) => {
      if (message.type === "location_update") {
        const locationData = message.data
        setCitizenLocations((prev) => [
          ...prev.slice(-50), // Keep last 50 locations
          {
            id: locationData.citizenId || `citizen-${Date.now()}`,
            lat: locationData.lat,
            lng: locationData.lng,
            status: locationData.status || "safe",
            lastSeen: message.timestamp,
            reportCount: Math.floor(Math.random() * 5),
            name: locationData.name,
            isLive: true,
          },
        ])
      }
    })
  }, [messages])

  useEffect(() => {
    const interval = setInterval(() => {
      setDangerZones([
        {
          id: "zone-1",
          lat: 19.076,
          lng: 72.8777,
          radius: 2000 + Math.sin(Date.now() / 1000) * 500,
          severity: "high",
          type: "High Waves",
          reports: 15 + Math.floor(Math.random() * 10),
          lastUpdate: new Date().toISOString(),
          createdBy: "auto",
          isActive: true,
        },
        {
          id: "zone-2",
          lat: 13.0827,
          lng: 80.2707,
          radius: 1500 + Math.cos(Date.now() / 1000) * 300,
          severity: "medium",
          type: "Storm Surge",
          reports: 8 + Math.floor(Math.random() * 5),
          lastUpdate: new Date().toISOString(),
          createdBy: "auto",
          isActive: true,
        },
      ])

      setSafeZones([
        {
          id: "safe-1",
          lat: 19.08,
          lng: 72.88,
          radius: 500,
          name: "Mumbai Central Hospital",
          type: "hospital",
          capacity: 200,
          isActive: true,
        },
        {
          id: "safe-2",
          lat: 13.085,
          lng: 80.275,
          radius: 300,
          name: "Chennai Relief Center",
          type: "shelter",
          capacity: 150,
          isActive: true,
        },
      ])

      if (userRole === "admin") {
        setTeamLocations([
          {
            id: "team-1",
            lat: 19.078,
            lng: 72.879,
            teamType: "rescue",
            status: "responding",
            destination: { lat: 19.076, lng: 72.8777 },
            eta: "5 mins",
          },
          {
            id: "team-2",
            lat: 13.084,
            lng: 80.273,
            teamType: "medical",
            status: "available",
          },
        ])
      }

      setReportPoints((prev) => [
        ...prev.slice(-20),
        {
          id: `report-${Date.now()}`,
          lat: 19.076 + (Math.random() - 0.5) * 0.02,
          lng: 72.8777 + (Math.random() - 0.5) * 0.02,
          severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as any,
          type: ["High Waves", "Flooding", "Strong Current"][Math.floor(Math.random() * 3)],
          description: "Citizen reported hazard",
          timestamp: new Date().toISOString(),
          citizenId: `citizen-${Math.floor(Math.random() * 100)}`,
          verified: Math.random() > 0.3,
        },
      ])

      setWeatherData((prev) => ({
        ...prev,
        temperature: 25 + Math.sin(Date.now() / 10000) * 5,
        windSpeed: 10 + Math.cos(Date.now() / 8000) * 8,
        humidity: 70 + Math.sin(Date.now() / 12000) * 15,
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [userRole])

  useEffect(() => {
    if (userLocation) {
      const alert = generateZoneAlert(userLocation, convertedDangerZones, convertedSafeZones)
      setZoneAlerts(alert)

      // Update citizen locations with zone-based status
      setCitizenLocations((prev) =>
        prev.map((citizen) => {
          const citizenCoords = { lat: citizen.lat, lng: citizen.lng }
          const isInDanger = convertedDangerZones.some((zone) => isInsideZone(citizenCoords, zone))
          const isInSafe = convertedSafeZones.some((zone) => isInsideZone(citizenCoords, zone))

          return {
            ...citizen,
            status: isInDanger ? "danger" : isInSafe ? "safe" : "unknown",
          }
        }),
      )
    }
  }, [userLocation, dangerZones, safeZones])

  const createZone = () => {
    if (!selectedLocation || !isCreatingZone || userRole !== "admin") return

    if (isCreatingZone === "danger") {
      const newZone: DangerZone = {
        id: `danger-${Date.now()}`,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        radius: newZoneRadius,
        severity: "high",
        type: newZoneType || "Manual Alert",
        reports: 0,
        lastUpdate: new Date().toISOString(),
        createdBy: "admin",
        isActive: true,
      }
      setDangerZones((prev) => [...prev, newZone])
    } else {
      const newZone: SafeZone = {
        id: `safe-${Date.now()}`,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        radius: newZoneRadius,
        name: newZoneName || "Safe Zone",
        type: "shelter",
        capacity: 100,
        isActive: true,
      }
      setSafeZones((prev) => [...prev, newZone])
    }

    setIsCreatingZone(null)
    setSelectedLocation(null)
    setNewZoneName("")
    setNewZoneType("")
  }

  const toggleLayer = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers((prev) => ({ ...prev, [layer]: !prev[layer] }))
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setIsTracking(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          setIsTracking(false)

          if (isConnected) {
            sendMessage({
              type: "location_update",
              data: { ...location, timestamp: new Date().toISOString() },
            })
          }
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsTracking(false)
        },
      )
    }
  }

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const lat = 19.076 + ((y - rect.height / 2) / rect.height) * 0.2
    const lng = 72.8777 + ((x - rect.width / 2) / rect.width) * 0.2

    setSelectedLocation({ lat, lng })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-700 border-red-800"
      case "high":
        return "bg-red-500 border-red-600"
      case "medium":
        return "bg-amber-500 border-amber-600"
      case "low":
        return "bg-yellow-500 border-yellow-600"
      default:
        return "bg-slate-500 border-slate-600"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "bg-emerald-500"
      case "danger":
        return "bg-red-500"
      default:
        return "bg-slate-400"
    }
  }

  const getWeatherIcon = () => {
    switch (weatherData.condition) {
      case "sunny":
        return <Sun className="h-4 w-4 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-4 w-4 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-4 w-4 text-blue-500" />
      case "stormy":
        return <Wind className="h-4 w-4 text-purple-500" />
      default:
        return <Cloud className="h-4 w-4" />
    }
  }

  const navigateToSafeZone = (zone: ZoneType) => {
    if (userLocation) {
      const distance = calculateDistance(userLocation, { lat: zone.lat, lng: zone.lng })
      console.log(`[v0] Navigating to ${zone.name}, ${Math.round(distance)}m away`)

      // In a real implementation, this would integrate with a navigation service
      alert(`Navigation to ${zone.name} would start here. Distance: ${Math.round(distance)}m`)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {userRole === "citizen" && (
        <>
          <ZoneAlertSystem
            userLocation={userLocation}
            dangerZones={convertedDangerZones}
            safeZones={convertedSafeZones}
            onNavigateToSafeZone={navigateToSafeZone}
          />

          <EnhancedMapIntegration
            userLocation={userLocation}
            dangerZones={convertedDangerZones}
            safeZones={convertedSafeZones}
            onLocationSelect={setSelectedLocation}
          />
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">
                Live Interactive Map - {userRole.charAt(0).toUpperCase() + userRole.slice(1)} View
              </span>
            </div>
            {isConnected ? (
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 text-xs w-fit">
                <Wifi className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-slate-50 text-slate-700 text-xs w-fit">
                <WifiOff className="h-3 w-3 mr-1" />
                Mock Mode
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Real-time citizen locations, danger zones, safe zones, and weather conditions
            {connectionError && (
              <div className="text-amber-600 text-xs sm:text-sm mt-1">Note: Using mock data for development</div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="map" className="space-y-3 sm:space-y-4">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 h-auto">
              <TabsTrigger value="map" className="text-xs sm:text-sm py-2">
                Live Map
              </TabsTrigger>
              <TabsTrigger value="layers" className="text-xs sm:text-sm py-2">
                Layer Controls
              </TabsTrigger>
              {userRole === "admin" && (
                <TabsTrigger value="zones" className="text-xs sm:text-sm py-2">
                  Zone Management
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="map" className="space-y-3 sm:space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={getUserLocation}
                  disabled={isTracking}
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm bg-transparent"
                >
                  <Navigation className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  {isTracking ? "Getting Location..." : "Get My Location"}
                </Button>

                {userLocation && (
                  <Badge variant="secondary" className="text-xs">
                    📍 {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </Badge>
                )}

                {selectedLocation && (
                  <Badge variant="outline" className="text-xs">
                    <Crosshair className="h-3 w-3 mr-1" />
                    Selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                  </Badge>
                )}

                {visibleLayers.weather && (
                  <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 border">
                    {getWeatherIcon()}
                    <span className="text-xs sm:text-sm">{Math.round(weatherData.temperature)}°C</span>
                    <span className="text-xs text-slate-500">Wind: {Math.round(weatherData.windSpeed)}km/h</span>
                  </div>
                )}
              </div>

              <div
                ref={mapRef}
                className="relative bg-gradient-to-br from-blue-100 via-blue-50 to-emerald-50 rounded-lg h-64 sm:h-80 lg:h-96 border-2 border-dashed border-slate-300 cursor-crosshair overflow-hidden"
                onClick={handleMapClick}
              >
                {visibleLayers.safeZones &&
                  safeZones.map((zone, index) => (
                    <div
                      key={zone.id}
                      className="absolute rounded-full border-2 bg-emerald-200/40 border-emerald-500"
                      style={{
                        left: `${20 + index * 30}%`,
                        top: `${30 + index * 25}%`,
                        width: `${Math.max(50, zone.radius / 40)}px`,
                        height: `${Math.max(50, zone.radius / 40)}px`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-emerald-100 px-2 py-1 rounded shadow border border-emerald-300">
                        {zone.name}
                      </div>
                    </div>
                  ))}

                {visibleLayers.dangerZones &&
                  dangerZones.map((zone, index) => (
                    <div
                      key={zone.id}
                      className={`absolute rounded-full border-2 opacity-60 ${getSeverityColor(zone.severity)} animate-pulse`}
                      style={{
                        left: `${30 + index * 25}%`,
                        top: `${25 + index * 20}%`,
                        width: `${Math.max(40, zone.radius / 50)}px`,
                        height: `${Math.max(40, zone.radius / 50)}px`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-white" />
                      </div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-white px-2 py-1 rounded shadow">
                        {zone.type}
                      </div>
                    </div>
                  ))}

                {visibleLayers.reports &&
                  reportPoints.map((report, index) => (
                    <div
                      key={report.id}
                      className={`absolute w-3 h-3 rounded-full border-2 border-white shadow-md ${getSeverityColor(report.severity).split(" ")[0]} ${report.verified ? "" : "opacity-60"}`}
                      style={{
                        left: `${Math.random() * 80 + 10}%`,
                        top: `${Math.random() * 70 + 15}%`,
                      }}
                      title={`${report.type} - ${report.verified ? "Verified" : "Unverified"}`}
                    />
                  ))}

                {visibleLayers.teams &&
                  userRole === "admin" &&
                  teamLocations.map((team, index) => (
                    <div
                      key={team.id}
                      className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                        team.teamType === "rescue"
                          ? "bg-orange-500"
                          : team.teamType === "medical"
                            ? "bg-red-500"
                            : team.teamType === "police"
                              ? "bg-blue-500"
                              : "bg-purple-500"
                      }`}
                      style={{
                        left: `${40 + index * 20}%`,
                        top: `${60 + index * 15}%`,
                      }}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold bg-black text-white px-1 rounded">
                        {team.teamType.charAt(0).toUpperCase()}
                      </div>
                      {team.destination && (
                        <div className="absolute top-4 left-4 w-8 h-0.5 bg-yellow-400 transform rotate-45"></div>
                      )}
                    </div>
                  ))}

                {visibleLayers.citizens &&
                  citizenLocations.slice(-20).map((citizen, index) => (
                    <div
                      key={citizen.id}
                      className={`absolute w-2 h-2 rounded-full ${getStatusColor(citizen.status)} border border-white shadow-sm ${citizen.isLive ? "animate-pulse" : ""}`}
                      style={{
                        left: `${Math.random() * 80 + 10}%`,
                        top: `${Math.random() * 70 + 15}%`,
                        animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s both`,
                      }}
                      title={`Citizen ${citizen.id} - ${citizen.status} ${citizen.isLive ? "(Live)" : ""}`}
                    />
                  ))}

                {userLocation && (
                  <div
                    className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-bounce"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded">
                      You
                    </div>
                  </div>
                )}

                {selectedLocation && (
                  <div
                    className="absolute w-6 h-6 text-red-600 animate-pulse"
                    style={{
                      left: "60%",
                      top: "40%",
                      transform: "translate(-50%, -100%)",
                    }}
                  >
                    <MapPin className="h-6 w-6" />
                  </div>
                )}

                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white/95 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-xs space-y-1 sm:space-y-2 max-w-40 sm:max-w-48">
                  <div className="font-semibold text-xs sm:text-sm">Legend</div>
                  {visibleLayers.citizens && (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-xs">Safe Citizens</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs">Citizens in Danger</span>
                      </div>
                    </>
                  )}
                  {visibleLayers.dangerZones && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500/60 rounded-full border border-red-600"></div>
                      <span className="text-xs">Danger Zones</span>
                    </div>
                  )}
                  {visibleLayers.safeZones && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-emerald-200 rounded-full border border-emerald-500"></div>
                      <span className="text-xs">Safe Zones</span>
                    </div>
                  )}
                  {visibleLayers.reports && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full border border-white"></div>
                      <span className="text-xs">Report Points</span>
                    </div>
                  )}
                  {visibleLayers.teams && userRole === "admin" && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full border border-white"></div>
                      <span className="text-xs">Response Teams</span>
                    </div>
                  )}
                </div>

                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/95 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-xs space-y-1">
                  <div className="font-semibold text-xs sm:text-sm">Live Stats</div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    <span className="text-xs">{citizenLocations.length} Active Citizens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-xs">{dangerZones.length} Danger Zones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3 text-emerald-500" />
                    <span className="text-xs">{safeZones.length} Safe Zones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-orange-500" />
                    <span className="text-xs">{reportPoints.length} Reports</span>
                  </div>
                  {userRole === "admin" && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-xs">{teamLocations.length} Teams</span>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="layers" className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                {Object.entries(visibleLayers).map(([layer, visible]) => (
                  <Button
                    key={layer}
                    variant={visible ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLayer(layer as keyof typeof visibleLayers)}
                    className="justify-start text-xs sm:text-sm h-8"
                  >
                    {visible ? (
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    ) : (
                      <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    )}
                    <span className="truncate">{layer.charAt(0).toUpperCase() + layer.slice(1)}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>

            {userRole === "admin" && (
              <TabsContent value="zones" className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  <Card>
                    <CardHeader className="pb-2 sm:pb-3">
                      <CardTitle className="text-xs sm:text-sm">Create New Zone</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 sm:space-y-3">
                      <div className="flex gap-2">
                        <Button
                          variant={isCreatingZone === "danger" ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => setIsCreatingZone(isCreatingZone === "danger" ? null : "danger")}
                          className="flex-1 text-xs h-8"
                        >
                          <AlertTriangle className="h-3 w-3 mr-2" />
                          Danger Zone
                        </Button>
                        <Button
                          variant={isCreatingZone === "safe" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setIsCreatingZone(isCreatingZone === "safe" ? null : "safe")}
                          className="flex-1 text-xs h-8"
                        >
                          <Shield className="h-3 w-3 mr-2" />
                          Safe Zone
                        </Button>
                      </div>

                      {isCreatingZone && (
                        <div className="space-y-2">
                          <Input
                            placeholder={isCreatingZone === "danger" ? "Zone type (e.g., High Waves)" : "Zone name"}
                            value={isCreatingZone === "danger" ? newZoneType : newZoneName}
                            onChange={(e) =>
                              isCreatingZone === "danger"
                                ? setNewZoneType(e.target.value)
                                : setNewZoneName(e.target.value)
                            }
                            className="text-xs sm:text-sm h-8"
                          />
                          <Input
                            type="number"
                            placeholder="Radius (meters)"
                            value={newZoneRadius}
                            onChange={(e) => setNewZoneRadius(Number(e.target.value))}
                            className="text-xs sm:text-sm h-8"
                          />
                          <Button
                            onClick={createZone}
                            disabled={!selectedLocation}
                            size="sm"
                            className="w-full text-xs h-8"
                          >
                            <Plus className="h-3 w-3 mr-2" />
                            Create Zone at Selected Location
                          </Button>
                          {!selectedLocation && (
                            <p className="text-xs text-slate-500">Click on the map to select a location first</p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2 sm:pb-3">
                      <CardTitle className="text-xs sm:text-sm">Zone Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
                        {[...dangerZones, ...safeZones].map((zone) => (
                          <div key={zone.id} className="flex items-center justify-between p-2 border rounded text-xs">
                            <div className="flex items-center justify-between gap-2 flex-1 min-w-0">
                              <div
                                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-1 sm:mt-0 flex-shrink-0 ${getSeverityColor(zone.severity).split(" ")[0]}`}
                              ></div>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium truncate">{"severity" in zone ? zone.type : zone.name}</div>
                                <div className="text-xs text-slate-500">
                                  Radius: {Math.round(zone.radius)}m • {zone.createdBy}
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm">Active Danger Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3 max-h-40 sm:max-h-48 overflow-y-auto">
              {dangerZones.map((zone) => (
                <div
                  key={zone.id}
                  className="flex items-start sm:items-center justify-between p-2 border rounded gap-2"
                >
                  <div className="flex items-start sm:items-center gap-2 flex-1 min-w-0">
                    <div
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-1 sm:mt-0 flex-shrink-0 ${getSeverityColor(zone.severity).split(" ")[0]}`}
                    ></div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-xs sm:text-sm truncate">{zone.type}</div>
                      <div className="text-xs text-slate-500">
                        Radius: {Math.round(zone.radius)}m • {zone.createdBy}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={zone.severity === "high" ? "destructive" : "secondary"}
                    className="text-xs flex-shrink-0"
                  >
                    {zone.reports} reports
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm">Safe Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3 max-h-40 sm:max-h-48 overflow-y-auto">
              {safeZones.map((zone) => (
                <div
                  key={zone.id}
                  className="flex items-start sm:items-center justify-between p-2 border rounded gap-2"
                >
                  <div className="flex items-start sm:items-center gap-2 flex-1 min-w-0">
                    <Shield className="h-3 w-3 text-emerald-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-xs sm:text-sm truncate">{zone.name}</div>
                      <div className="text-xs text-slate-500">
                        {zone.type} • Capacity: {zone.capacity}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-700 flex-shrink-0">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm">Live Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 sm:space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Safe Citizens:</span>
                <span className="font-medium text-emerald-600">
                  {citizenLocations.filter((c) => c.status === "safe").length}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Citizens in Danger:</span>
                <span className="font-medium text-red-600">
                  {citizenLocations.filter((c) => c.status === "danger").length}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Verified Reports:</span>
                <span className="font-medium text-blue-600">{reportPoints.filter((r) => r.verified).length}</span>
              </div>
              {userRole === "admin" && (
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Active Teams:</span>
                  <span className="font-medium text-purple-600">
                    {teamLocations.filter((t) => t.status !== "busy").length}
                  </span>
                </div>
              )}
              <div className="mt-2 sm:mt-3 p-2 bg-slate-50 rounded text-xs">
                <strong>Weather:</strong> {Math.round(weatherData.temperature)}°C, {weatherData.condition}, Wind:{" "}
                {Math.round(weatherData.windSpeed)}km/h, Visibility: {weatherData.visibility}km
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
