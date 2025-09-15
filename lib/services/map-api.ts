export interface MapboxConfig {
  accessToken: string
  style: string
}

export interface GoogleMapsConfig {
  apiKey: string
  mapId?: string
}

export interface MapProvider {
  type: "mapbox" | "google" | "leaflet"
  config?: MapboxConfig | GoogleMapsConfig
}

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface GeocodeResult {
  lat: number
  lng: number
  address: string
  city?: string
  country?: string
}

export interface DirectionsResult {
  routes: Array<{
    distance: number
    duration: number
    steps: Array<{
      instruction: string
      distance: number
      duration: number
      coordinates: Array<[number, number]>
    }>
    coordinates: Array<[number, number]>
  }>
}

/**
 * Map API service for handling different map providers
 */
export class MapAPIService {
  private provider: MapProvider
  private initialized = false

  constructor(provider: MapProvider) {
    this.provider = provider
  }

  /**
   * Initialize the map API
   */
  async initialize(): Promise<void> {
    if (this.initialized) return

    switch (this.provider.type) {
      case "mapbox":
        await this.initializeMapbox()
        break
      case "google":
        await this.initializeGoogleMaps()
        break
      case "leaflet":
        await this.initializeLeaflet()
        break
      default:
        throw new Error(`Unsupported map provider: ${this.provider.type}`)
    }

    this.initialized = true
  }

  /**
   * Geocode an address to coordinates
   */
  async geocode(address: string): Promise<GeocodeResult[]> {
    await this.initialize()

    switch (this.provider.type) {
      case "mapbox":
        return this.geocodeMapbox(address)
      case "google":
        return this.geocodeGoogle(address)
      case "leaflet":
        return this.geocodeNominatim(address)
      default:
        throw new Error(`Geocoding not supported for ${this.provider.type}`)
    }
  }

  /**
   * Reverse geocode coordinates to address
   */
  async reverseGeocode(lat: number, lng: number): Promise<GeocodeResult> {
    await this.initialize()

    switch (this.provider.type) {
      case "mapbox":
        return this.reverseGeocodeMapbox(lat, lng)
      case "google":
        return this.reverseGeocodeGoogle(lat, lng)
      case "leaflet":
        return this.reverseGeocodeNominatim(lat, lng)
      default:
        throw new Error(`Reverse geocoding not supported for ${this.provider.type}`)
    }
  }

  /**
   * Get directions between two points
   */
  async getDirections(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    mode: "driving" | "walking" | "cycling" = "driving",
  ): Promise<DirectionsResult> {
    await this.initialize()

    switch (this.provider.type) {
      case "mapbox":
        return this.getDirectionsMapbox(origin, destination, mode)
      case "google":
        return this.getDirectionsGoogle(origin, destination, mode)
      case "leaflet":
        return this.getDirectionsOSRM(origin, destination, mode)
      default:
        throw new Error(`Directions not supported for ${this.provider.type}`)
    }
  }

  /**
   * Calculate distance between two points
   */
  calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
    const R = 6371000 // Earth's radius in meters
    const φ1 = (point1.lat * Math.PI) / 180
    const φ2 = (point2.lat * Math.PI) / 180
    const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180
    const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  // Private methods for different providers

  private async initializeMapbox(): Promise<void> {
    const config = this.provider.config as MapboxConfig
    if (!config?.accessToken) {
      throw new Error("Mapbox access token is required")
    }
    // In a real implementation, load Mapbox GL JS
    console.log("[v0] Mapbox initialized with token:", config.accessToken.substring(0, 10) + "...")
  }

  private async initializeGoogleMaps(): Promise<void> {
    const config = this.provider.config as GoogleMapsConfig
    if (!config?.apiKey) {
      throw new Error("Google Maps API key is required")
    }
    // In a real implementation, load Google Maps JavaScript API
    console.log("[v0] Google Maps initialized with key:", config.apiKey.substring(0, 10) + "...")
  }

  private async initializeLeaflet(): Promise<void> {
    // Leaflet doesn't require API keys for basic functionality
    console.log("[v0] Leaflet initialized (using OpenStreetMap)")
  }

  private async geocodeMapbox(address: string): Promise<GeocodeResult[]> {
    const config = this.provider.config as MapboxConfig
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${config.accessToken}`

    try {
      const response = await fetch(url)
      const data = await response.json()

      return data.features.map((feature: any) => ({
        lat: feature.center[1],
        lng: feature.center[0],
        address: feature.place_name,
        city: feature.context?.find((c: any) => c.id.startsWith("place"))?.text,
        country: feature.context?.find((c: any) => c.id.startsWith("country"))?.text,
      }))
    } catch (error) {
      console.error("[v0] Mapbox geocoding error:", error)
      return []
    }
  }

  private async geocodeGoogle(address: string): Promise<GeocodeResult[]> {
    const config = this.provider.config as GoogleMapsConfig
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${config.apiKey}`

    try {
      const response = await fetch(url)
      const data = await response.json()

      return data.results.map((result: any) => ({
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        address: result.formatted_address,
        city: result.address_components.find((c: any) => c.types.includes("locality"))?.long_name,
        country: result.address_components.find((c: any) => c.types.includes("country"))?.long_name,
      }))
    } catch (error) {
      console.error("[v0] Google Maps geocoding error:", error)
      return []
    }
  }

  private async geocodeNominatim(address: string): Promise<GeocodeResult[]> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5`

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Atlas-Alert Emergency Response System",
        },
      })
      const data = await response.json()

      return data.map((result: any) => ({
        lat: Number.parseFloat(result.lat),
        lng: Number.parseFloat(result.lon),
        address: result.display_name,
        city: result.address?.city || result.address?.town,
        country: result.address?.country,
      }))
    } catch (error) {
      console.error("[v0] Nominatim geocoding error:", error)
      return []
    }
  }

  private async reverseGeocodeMapbox(lat: number, lng: number): Promise<GeocodeResult> {
    const config = this.provider.config as MapboxConfig
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${config.accessToken}`

    try {
      const response = await fetch(url)
      const data = await response.json()
      const feature = data.features[0]

      return {
        lat,
        lng,
        address: feature.place_name,
        city: feature.context?.find((c: any) => c.id.startsWith("place"))?.text,
        country: feature.context?.find((c: any) => c.id.startsWith("country"))?.text,
      }
    } catch (error) {
      console.error("[v0] Mapbox reverse geocoding error:", error)
      return { lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` }
    }
  }

  private async reverseGeocodeGoogle(lat: number, lng: number): Promise<GeocodeResult> {
    const config = this.provider.config as GoogleMapsConfig
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${config.apiKey}`

    try {
      const response = await fetch(url)
      const data = await response.json()
      const result = data.results[0]

      return {
        lat,
        lng,
        address: result.formatted_address,
        city: result.address_components.find((c: any) => c.types.includes("locality"))?.long_name,
        country: result.address_components.find((c: any) => c.types.includes("country"))?.long_name,
      }
    } catch (error) {
      console.error("[v0] Google Maps reverse geocoding error:", error)
      return { lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` }
    }
  }

  private async reverseGeocodeNominatim(lat: number, lng: number): Promise<GeocodeResult> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Atlas-Alert Emergency Response System",
        },
      })
      const data = await response.json()

      return {
        lat,
        lng,
        address: data.display_name,
        city: data.address?.city || data.address?.town,
        country: data.address?.country,
      }
    } catch (error) {
      console.error("[v0] Nominatim reverse geocoding error:", error)
      return { lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` }
    }
  }

  private async getDirectionsMapbox(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    mode: string,
  ): Promise<DirectionsResult> {
    const config = this.provider.config as MapboxConfig
    const profile = mode === "walking" ? "walking" : mode === "cycling" ? "cycling" : "driving"
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?steps=true&geometries=geojson&access_token=${config.accessToken}`

    try {
      const response = await fetch(url)
      const data = await response.json()
      const route = data.routes[0]

      return {
        routes: [
          {
            distance: route.distance,
            duration: route.duration,
            steps: route.legs[0].steps.map((step: any) => ({
              instruction: step.maneuver.instruction,
              distance: step.distance,
              duration: step.duration,
              coordinates: step.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]),
            })),
            coordinates: route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]),
          },
        ],
      }
    } catch (error) {
      console.error("[v0] Mapbox directions error:", error)
      throw new Error("Failed to get directions from Mapbox")
    }
  }

  private async getDirectionsGoogle(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    mode: string,
  ): Promise<DirectionsResult> {
    const config = this.provider.config as GoogleMapsConfig
    const travelMode = mode.toUpperCase()
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=${travelMode}&key=${config.apiKey}`

    try {
      const response = await fetch(url)
      const data = await response.json()
      const route = data.routes[0]
      const leg = route.legs[0]

      return {
        routes: [
          {
            distance: leg.distance.value,
            duration: leg.duration.value,
            steps: leg.steps.map((step: any) => ({
              instruction: step.html_instructions.replace(/<[^>]*>/g, ""),
              distance: step.distance.value,
              duration: step.duration.value,
              coordinates: this.decodePolyline(step.polyline.points),
            })),
            coordinates: this.decodePolyline(route.overview_polyline.points),
          },
        ],
      }
    } catch (error) {
      console.error("[v0] Google Maps directions error:", error)
      throw new Error("Failed to get directions from Google Maps")
    }
  }

  private async getDirectionsOSRM(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    mode: string,
  ): Promise<DirectionsResult> {
    const profile = mode === "walking" ? "foot" : mode === "cycling" ? "bike" : "car"
    const url = `https://router.project-osrm.org/route/v1/${profile}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?steps=true&geometries=geojson`

    try {
      const response = await fetch(url)
      const data = await response.json()
      const route = data.routes[0]

      return {
        routes: [
          {
            distance: route.distance,
            duration: route.duration,
            steps: route.legs[0].steps.map((step: any) => ({
              instruction: step.maneuver.instruction || "Continue",
              distance: step.distance,
              duration: step.duration,
              coordinates: step.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]),
            })),
            coordinates: route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]),
          },
        ],
      }
    } catch (error) {
      console.error("[v0] OSRM directions error:", error)
      throw new Error("Failed to get directions from OSRM")
    }
  }

  private decodePolyline(encoded: string): Array<[number, number]> {
    const points: Array<[number, number]> = []
    let index = 0
    let lat = 0
    let lng = 0

    while (index < encoded.length) {
      let b: number
      let shift = 0
      let result = 0
      do {
        b = encoded.charCodeAt(index++) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
      lat += dlat

      shift = 0
      result = 0
      do {
        b = encoded.charCodeAt(index++) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
      lng += dlng

      points.push([lat / 1e5, lng / 1e5])
    }

    return points
  }
}

/**
 * Create a map API service instance
 */
export function createMapService(provider: MapProvider): MapAPIService {
  return new MapAPIService(provider)
}

/**
 * Default map service using OpenStreetMap/Leaflet (no API key required)
 */
export const defaultMapService = createMapService({ type: "leaflet" })
