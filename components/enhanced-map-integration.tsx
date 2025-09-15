"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Navigation,
  Search,
  Route,
  Clock,
  Ruler,
  AlertTriangle,
  Shield,
  Crosshair,
  Loader2,
} from "lucide-react"
import {
  type MapAPIService,
  createMapService,
  defaultMapService,
  type GeocodeResult,
  type DirectionsResult,
  type MapProvider,
} from "@/lib/services/map-api"
import type { Zone } from "@/lib/utils/zone-detection"

interface EnhancedMapIntegrationProps {
  userLocation: { lat: number; lng: number } | null
  dangerZones: Zone[]
  safeZones: Zone[]
  onLocationSelect?: (location: { lat: number; lng: number }) => void
  mapProvider?: MapProvider
}

export function EnhancedMapIntegration({
  userLocation,
  dangerZones,
  safeZones,
  onLocationSelect,
  mapProvider,
}: EnhancedMapIntegrationProps) {
  const [mapService, setMapService] = useState<MapAPIService>(defaultMapService)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([])
  const [selectedDestination, setSelectedDestination] = useState<{ lat: number; lng: number } | null>(null)
  const [directions, setDirections] = useState<DirectionsResult | null>(null)
  const [currentAddress, setCurrentAddress] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [travelMode, setTravelMode] = useState<"driving" | "walking" | "cycling">("walking")

  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Initialize map service when provider changes
  useEffect(() => {
    if (mapProvider) {
      const service = createMapService(mapProvider)
      setMapService(service)
    }
  }, [mapProvider])

  // Reverse geocode user location
  useEffect(() => {
    if (userLocation && mapService) {
      mapService
        .reverseGeocode(userLocation.lat, userLocation.lng)
        .then((result) => setCurrentAddress(result.address))
        .catch((error) => console.error("[v0] Reverse geocoding failed:", error))
    }
  }, [userLocation, mapService])

  const handleSearch = async () => {
    if (!searchQuery.trim() || !mapService) return

    setIsLoading(true)
    try {
      const results = await mapService.geocode(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error("[v0] Search failed:", error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const selectSearchResult = (result: GeocodeResult) => {
    const location = { lat: result.lat, lng: result.lng }
    setSelectedDestination(location)
    onLocationSelect?.(location)
    setSearchResults([])
    setSearchQuery(result.address)
  }

  const getDirections = async () => {
    if (!userLocation || !selectedDestination || !mapService) return

    setIsLoading(true)
    try {
      const result = await mapService.getDirections(userLocation, selectedDestination, travelMode)
      setDirections(result)
    } catch (error) {
      console.error("[v0] Directions failed:", error)
      setDirections(null)
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToNearestSafeZone = async () => {
    if (!userLocation || safeZones.length === 0) return

    // Find nearest safe zone
    let nearestZone = safeZones[0]
    let minDistance = mapService.calculateDistance(userLocation, { lat: nearestZone.lat, lng: nearestZone.lng })

    for (const zone of safeZones.slice(1)) {
      const distance = mapService.calculateDistance(userLocation, { lat: zone.lat, lng: zone.lng })
      if (distance < minDistance) {
        minDistance = distance
        nearestZone = zone
      }
    }

    setSelectedDestination({ lat: nearestZone.lat, lng: nearestZone.lng })
    setSearchQuery(nearestZone.name || "Safe Zone")

    // Get directions automatically
    setIsLoading(true)
    try {
      const result = await mapService.getDirections(
        userLocation,
        { lat: nearestZone.lat, lng: nearestZone.lng },
        travelMode,
      )
      setDirections(result)
    } catch (error) {
      console.error("[v0] Navigation to safe zone failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`
    }
    return `${(meters / 1000).toFixed(1)}km`
  }

  const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60)
    if (minutes < 60) {
      return `${minutes}min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}min`
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
            Enhanced Map Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="search" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search" className="text-xs sm:text-sm">
                Search & Navigate
              </TabsTrigger>
              <TabsTrigger value="directions" className="text-xs sm:text-sm">
                Directions
              </TabsTrigger>
              <TabsTrigger value="emergency" className="text-xs sm:text-sm">
                Emergency Routes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4">
              {/* Current Location */}
              {userLocation && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Crosshair className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Current Location</span>
                  </div>
                  <div className="text-xs text-blue-700">
                    {currentAddress || `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`}
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search for places, addresses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="text-sm"
                  />
                  <Button onClick={handleSearch} disabled={isLoading || !searchQuery.trim()} size="sm">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-1 max-h-40 overflow-y-auto border rounded-lg">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => selectSearchResult(result)}
                        className="w-full text-left p-2 hover:bg-slate-50 border-b last:border-b-0 text-sm"
                      >
                        <div className="font-medium truncate">{result.address}</div>
                        {result.city && (
                          <div className="text-xs text-slate-500">
                            {result.city}, {result.country}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Travel Mode Selection */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Travel Mode</div>
                <div className="flex gap-2">
                  {(["walking", "cycling", "driving"] as const).map((mode) => (
                    <Button
                      key={mode}
                      variant={travelMode === mode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTravelMode(mode)}
                      className="text-xs capitalize"
                    >
                      {mode}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Get Directions Button */}
              {selectedDestination && userLocation && (
                <Button onClick={getDirections} disabled={isLoading} className="w-full" size="sm">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Route className="h-4 w-4 mr-2" />}
                  Get Directions
                </Button>
              )}
            </TabsContent>

            <TabsContent value="directions" className="space-y-4">
              {directions ? (
                <div className="space-y-3">
                  {/* Route Summary */}
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-900">Route Summary</span>
                      <Badge variant="secondary" className="text-xs">
                        {travelMode}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-green-600" />
                        <span className="text-green-700">{formatDistance(directions.routes[0].distance)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="text-green-700">{formatDuration(directions.routes[0].duration)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Turn-by-turn Directions */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Turn-by-turn Directions</div>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {directions.routes[0].steps.map((step, index) => (
                        <div key={index} className="flex gap-3 p-2 border rounded text-sm">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-700 flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{step.instruction}</div>
                            <div className="text-xs text-slate-500">
                              {formatDistance(step.distance)} • {formatDuration(step.duration)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Route className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <div className="text-sm">No directions available</div>
                  <div className="text-xs">Search for a destination and get directions</div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="emergency" className="space-y-4">
              {/* Emergency Navigation */}
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-900">Emergency Navigation</span>
                  </div>
                  <div className="text-xs text-red-700 mb-3">
                    Quick navigation to the nearest safe zone in case of emergency
                  </div>
                  <Button
                    onClick={navigateToNearestSafeZone}
                    disabled={!userLocation || safeZones.length === 0 || isLoading}
                    variant="destructive"
                    size="sm"
                    className="w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Navigation className="h-4 w-4 mr-2" />
                    )}
                    Navigate to Nearest Safe Zone
                  </Button>
                </div>

                {/* Safe Zones List */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Available Safe Zones</div>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {safeZones.map((zone) => {
                      const distance = userLocation
                        ? mapService.calculateDistance(userLocation, { lat: zone.lat, lng: zone.lng })
                        : 0

                      return (
                        <div key={zone.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium truncate">{zone.name}</div>
                              {userLocation && (
                                <div className="text-xs text-slate-500">{formatDistance(distance)} away</div>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedDestination({ lat: zone.lat, lng: zone.lng })
                              setSearchQuery(zone.name || "Safe Zone")
                            }}
                            className="text-xs"
                          >
                            Select
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Danger Zones Warning */}
                {dangerZones.length > 0 && (
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-900">Active Danger Zones</span>
                    </div>
                    <div className="text-xs text-orange-700 mb-2">
                      {dangerZones.length} danger zone(s) detected. Avoid these areas:
                    </div>
                    <div className="space-y-1">
                      {dangerZones.slice(0, 3).map((zone) => (
                        <div key={zone.id} className="text-xs text-orange-800">
                          • {zone.name} ({zone.severity} risk)
                        </div>
                      ))}
                      {dangerZones.length > 3 && (
                        <div className="text-xs text-orange-600">+{dangerZones.length - 3} more zones</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
