"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { useLiveLocation } from "@/lib/hooks/use-live-location"

export function LiveLocationTracker() {
  const { currentLocation, isTracking, error, startTracking, stopTracking } = useLiveLocation()

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }

  const formatAccuracy = (accuracy?: number) => {
    if (!accuracy) return "Unknown"
    if (accuracy < 10) return "High"
    if (accuracy < 50) return "Medium"
    return "Low"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Navigation className="h-5 w-5" />
          <span>Live Location Tracking</span>
        </CardTitle>
        <CardDescription>Share your location for real-time hazard monitoring and emergency response</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isTracking ? (
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            ) : error ? (
              <XCircle className="h-5 w-5 text-red-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            )}
            <span className="font-medium">
              {isTracking ? "Location Tracking Active" : error ? "Location Error" : "Location Tracking Inactive"}
            </span>
          </div>
          <Badge variant={isTracking ? "default" : "secondary"}>{isTracking ? "LIVE" : "OFFLINE"}</Badge>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Current Location Display */}
        {currentLocation && (
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="font-medium text-emerald-900">Current Location</div>
                  <div className="text-sm text-emerald-700">
                    {formatCoordinates(currentLocation.lat, currentLocation.lng)}
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-emerald-600">
                    <span>Accuracy: {formatAccuracy(currentLocation.accuracy)}</span>
                    <span>Updated: {new Date(currentLocation.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex space-x-2">
          {!isTracking ? (
            <Button onClick={startTracking} className="flex-1">
              <Navigation className="h-4 w-4 mr-2" />
              Start Location Tracking
            </Button>
          ) : (
            <Button onClick={stopTracking} variant="outline" className="flex-1 bg-transparent">
              <XCircle className="h-4 w-4 mr-2" />
              Stop Tracking
            </Button>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-xs text-blue-700">
            <strong>Privacy Notice:</strong> Your location is only shared with authorized emergency responders and
            coastal authorities. Location data is encrypted and automatically deleted after 24 hours unless part of an
            active incident report.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
