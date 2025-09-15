"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Camera, Upload, Navigation, AlertTriangle, Phone, Crosshair } from "lucide-react"

interface EmergencyReport {
  quickReport?: string
  hazardCategory?: string
  location?: { lat: number; lng: number }
  description: string
  media: File[]
}

export function EmergencyReportForm() {
  const [report, setReport] = useState<EmergencyReport>({
    description: "",
    media: [],
  })
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [selectedPin, setSelectedPin] = useState<{ lat: number; lng: number } | null>(null)

  const quickReportOptions = [
    { id: "water-rising", label: "Water Rising", icon: "🌊" },
    { id: "flooded-bridge", label: "Flooded Bridge", icon: "🌉" },
    { id: "road-blocked", label: "Road Blocked", icon: "🚧" },
    { id: "stuck-vehicle", label: "Stuck Vehicle", icon: "🚗" },
    { id: "heavy-traffic", label: "Heavy Traffic", icon: "🚦" },
    { id: "traffic-moving", label: "Traffic Moving", icon: "🟢" },
    { id: "no-electricity", label: "No Electricity", icon: "⚡" },
    { id: "landslide", label: "Landslide", icon: "🏔️" },
    { id: "oil-spill", label: "Oil Spill", icon: "🛢️" },
  ]

  const hazardCategories = [
    { id: "flood", label: "Flood", color: "bg-blue-500" },
    { id: "tsunami", label: "Tsunami", color: "bg-indigo-600" },
    { id: "high-waves", label: "High Waves", color: "bg-cyan-500" },
    { id: "cyclone", label: "Cyclone", color: "bg-purple-500" },
    { id: "oil-spill", label: "Oil Spill", color: "bg-slate-700" },
    { id: "storm-surge", label: "Storm Surge", color: "bg-emerald-600" },
  ]

  const getMyLocation = () => {
    if (navigator.geolocation) {
      setIsGettingLocation(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setReport((prev) => ({ ...prev, location }))
          setIsGettingLocation(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsGettingLocation(false)
        },
      )
    }
  }

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Convert pixel coordinates to lat/lng (simplified)
    const lat = 19.076 + ((y - rect.height / 2) / rect.height) * 0.2
    const lng = 72.8777 + ((x - rect.width / 2) / rect.width) * 0.2

    setSelectedPin({ lat, lng })
    setReport((prev) => ({ ...prev, location: { lat, lng } }))
  }

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length + report.media.length <= 3) {
      setReport((prev) => ({ ...prev, media: [...prev.media, ...files] }))
    }
  }

  const removeMedia = (index: number) => {
    setReport((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }))
  }

  const submitReport = () => {
    console.log("[v0] Submitting emergency report:", report)
    // Here you would send the report to your backend
    alert("Emergency report submitted successfully!")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Emergency Alert */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 font-medium">
          <strong>Emergency Report</strong> – For life-threatening emergencies, call{" "}
          <Button variant="link" className="p-0 h-auto text-red-800 font-bold underline">
            <Phone className="h-3 w-3 mr-1" />
            100, 101, or 108
          </Button>{" "}
          immediately.
        </AlertDescription>
      </Alert>

      {/* Quick Report Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Report</CardTitle>
          <CardDescription>Select what you're seeing right now</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickReportOptions.map((option) => (
              <Button
                key={option.id}
                variant={report.quickReport === option.id ? "default" : "outline"}
                className="h-auto p-3 flex flex-col items-center gap-2"
                onClick={() => setReport((prev) => ({ ...prev, quickReport: option.id }))}
              >
                <span className="text-2xl">{option.icon}</span>
                <span className="text-xs text-center">{option.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hazard Category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hazard Category</CardTitle>
          <CardDescription>What type of ocean hazard is this?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {hazardCategories.map((category) => (
              <Button
                key={category.id}
                variant={report.hazardCategory === category.id ? "default" : "outline"}
                className={`h-16 ${report.hazardCategory === category.id ? category.color : ""}`}
                onClick={() => setReport((prev) => ({ ...prev, hazardCategory: category.id }))}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Location</CardTitle>
          <CardDescription>Pin the exact location or use your current location</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={getMyLocation}
              disabled={isGettingLocation}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              <Navigation className="h-4 w-4 mr-2" />
              {isGettingLocation ? "Getting Location..." : "Get My Location"}
            </Button>
          </div>

          {/* Interactive Location Picker */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Or click on the map to pin location:</div>
            <div
              className="relative bg-gradient-to-br from-blue-100 to-emerald-100 rounded-lg h-48 border-2 border-dashed border-slate-300 cursor-crosshair"
              onClick={handleMapClick}
            >
              <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <Crosshair className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Click to pin location</p>
                </div>
              </div>

              {/* Selected Pin */}
              {selectedPin && (
                <div
                  className="absolute w-6 h-6 text-red-600 animate-bounce"
                  style={{
                    left: "50%",
                    top: "40%",
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  <MapPin className="h-6 w-6" />
                </div>
              )}
            </div>
          </div>

          {report.location && (
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-sm font-medium">Selected Location:</div>
              <div className="text-sm text-slate-600">📍 Latitude: {report.location.lat.toFixed(6)}</div>
              <div className="text-sm text-slate-600">📍 Longitude: {report.location.lng.toFixed(6)}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Describe the Situation</CardTitle>
          <CardDescription>What are you seeing? How severe is it?</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe what you're seeing, the severity, and any immediate dangers..."
            value={report.description}
            onChange={(e) => setReport((prev) => ({ ...prev, description: e.target.value }))}
            className="min-h-24"
          />
        </CardContent>
      </Card>

      {/* Photos/Videos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Photos/Videos (Optional)</CardTitle>
          <CardDescription>Upload up to 3 photos or videos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild disabled={report.media.length >= 3}>
              <label className="cursor-pointer">
                <Camera className="h-4 w-4 mr-2" />
                Add Media
                <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleMediaUpload} />
              </label>
            </Button>
            <span className="text-sm text-slate-500">{report.media.length}/3 files</span>
          </div>

          {report.media.length > 0 && (
            <div className="space-y-2">
              {report.media.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-slate-500" />
                    <span className="text-sm">{file.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMedia(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        onClick={submitReport}
        className="w-full h-12 text-lg font-semibold bg-red-600 hover:bg-red-700"
        disabled={!report.description.trim() || !report.location}
      >
        <AlertTriangle className="h-5 w-5 mr-2" />
        Submit Emergency Report
      </Button>
    </div>
  )
}
