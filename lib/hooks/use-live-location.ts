"use client"

import { useEffect, useState } from "react"
import { useWebSocket } from "./use-websocket"

interface LocationData {
  lat: number
  lng: number
  accuracy?: number
  timestamp: string
}

export function useLiveLocation() {
  const { socket, sendLocation } = useWebSocket()
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      return
    }

    setIsTracking(true)
    setError(null)

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const locationData: LocationData = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date().toISOString(),
      }

      setCurrentLocation(locationData)

      // Send location via WebSocket
      sendLocation({
        lat: locationData.lat,
        lng: locationData.lng,
      })

      console.log("[v0] Location updated:", locationData)
    }

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = "Unknown location error"

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location access denied by user"
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information unavailable"
          break
        case error.TIMEOUT:
          errorMessage = "Location request timed out"
          break
      }

      setError(errorMessage)
      setIsTracking(false)
      console.error("[v0] Location error:", errorMessage)
    }

    // Start watching position
    const id = navigator.geolocation.watchPosition(handleSuccess, handleError, options)
    setWatchId(id)
  }

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
    setIsTracking(false)
    console.log("[v0] Location tracking stopped")
  }

  const getCurrentLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString(),
          }
          resolve(locationData)
        },
        (error) => {
          reject(new Error(`Location error: ${error.message}`))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    })
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  return {
    currentLocation,
    isTracking,
    error,
    startTracking,
    stopTracking,
    getCurrentLocation,
  }
}
