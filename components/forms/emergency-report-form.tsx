"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Waves,
  CloudRain,
  Wind,
  AlertTriangle,
  Camera,
  MapPin,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  Upload,
} from "lucide-react"

interface EmergencyReportFormProps {
  onClose: () => void
}

interface FormData {
  hazardType: string
  severity: string
  description: string
  media: File[]
  location: { lat: number; lng: number } | null
  accuracy: number
}

export function EmergencyReportForm({ onClose }: EmergencyReportFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    hazardType: "",
    severity: "",
    description: "",
    media: [],
    location: null,
    accuracy: 0,
  })

  const hazardTypes = [
    { id: "flood", name: "Flood", icon: <Waves className="h-6 w-6 sm:h-8 sm:w-8" />, color: "bg-blue-500" },
    { id: "tsunami", name: "Tsunami", icon: <Waves className="h-6 w-6 sm:h-8 sm:w-8" />, color: "bg-red-500" },
    { id: "high_waves", name: "High Waves", icon: <Wind className="h-6 w-6 sm:h-8 sm:w-8" />, color: "bg-cyan-500" },
    {
      id: "heavy_rain",
      name: "Heavy Rain",
      icon: <CloudRain className="h-6 w-6 sm:h-8 sm:w-8" />,
      color: "bg-gray-500",
    },
    {
      id: "oil_spill",
      name: "Oil Spill",
      icon: <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8" />,
      color: "bg-yellow-500",
    },
    { id: "other", name: "Other", icon: <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8" />, color: "bg-purple-500" },
  ]

  const severityLevels = [
    { id: "low", name: "Low", description: "Minor concern, no immediate danger", color: "bg-green-500" },
    { id: "medium", name: "Medium", description: "Moderate risk, caution advised", color: "bg-yellow-500" },
    { id: "high", name: "High", description: "Serious threat, immediate action needed", color: "bg-red-500" },
  ]

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

 const handleSubmit = async () => {
  if (!formData.location) {
    return alert("Please set your location before submitting");
  }

  // Get user ID if available, otherwise null
  const userId = window.currentUser?.id || null; // replace window.currentUser with your auth/user context

  const payload = {
    user_id: userId,
    source: "app",
    hazard_type: formData.hazardType,
    severity: formData.severity,
    description: formData.description || "",
    media_key: "", // handle media upload separately if needed
    lat: formData.location.lat,
    lon: formData.location.lng,
  };

  try {
    const response = await fetch("http://localhost:8000/api/reports/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Submission error:", err);
      alert("Failed to submit: " + JSON.stringify(err.detail));
      return;
    }

    const data = await response.json();
    console.log("Report submitted:", data);
    alert("Report submitted successfully!");
    onClose();
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Unexpected error occurred");
  }
};


  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            accuracy: position.coords.accuracy,
          }))
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData((prev) => ({
      ...prev,
      media: [...prev.media, ...files],
    }))
  }

  const removeMedia = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.hazardType !== ""
      case 2:
        return formData.severity !== ""
      case 3:
        return true // Media is optional
      case 4:
        return formData.location !== null
      case 5:
        return true
      default:
        return false
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b">
        <h2 className="text-base sm:text-lg font-semibold">Emergency Report</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="p-3 sm:p-4 border-b">
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {/* Form Content */}
      <div className="p-3 sm:p-4">
        {/* Step 1: Hazard Type */}
        {currentStep === 1 && (
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">What type of hazard are you reporting?</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Select the category that best describes the situation
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {hazardTypes.map((type) => (
                <button
                  key={type.id}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                    formData.hazardType === type.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, hazardType: type.id }))}
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${type.color} flex items-center justify-center text-white mx-auto mb-2`}
                  >
                    {type.icon}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-center">{type.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Severity */}
        {currentStep === 2 && (
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">How severe is the situation?</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Help us understand the urgency level</p>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {severityLevels.map((level) => (
                <button
                  key={level.id}
                  className={`w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all ${
                    formData.severity === level.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, severity: level.id }))}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${level.color}`} />
                    <div>
                      <div className="font-medium text-sm sm:text-base">{level.name}</div>
                      <div className="text-xs sm:text-sm text-gray-600">{level.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Media Upload */}
        {currentStep === 3 && (
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Add photos or videos (optional)</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Visual evidence helps verify and assess the situation
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
              <Camera className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Take a photo or upload from gallery</p>

              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm bg-transparent">
                  <Camera className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Camera
                </Button>
                <label className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild className="text-xs sm:text-sm bg-transparent">
                    <span>
                      <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Gallery
                    </span>
                  </Button>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleMediaUpload}
                  />
                </label>
              </div>
            </div>

            {/* Uploaded Media Preview */}
            {formData.media.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Uploaded Files:</h4>
                {formData.media.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-xs sm:text-sm truncate flex-1 mr-2">{file.name}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeMedia(index)}>
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Location */}
        {currentStep === 4 && (
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Confirm location</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">We need to know where this is happening</p>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full bg-transparent text-xs sm:text-sm"
                onClick={getCurrentLocation}
              >
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Use Current Location
              </Button>

              {formData.location && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="font-medium text-xs sm:text-sm">Location Captured</span>
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Lat: {formData.location.lat.toFixed(6)}, Lng: {formData.location.lng.toFixed(6)}
                  </div>
                  <div className="text-xs text-green-600">Accuracy: ±{formData.accuracy.toFixed(0)}m</div>
                </div>
              )}

              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-500">or</p>
              </div>

              <Button variant="outline" className="w-full bg-transparent text-xs sm:text-sm">
                Select on Map
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Description & Submit */}
        {currentStep === 5 && (
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Additional details</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Provide any additional information that might be helpful
              </p>
            </div>

            <Textarea
              placeholder="Describe what you're seeing, any immediate dangers, number of people affected, etc."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="text-sm"
            />

            {/* Summary */}
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2 text-sm">Report Summary:</h4>
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="flex flex-wrap items-center gap-1">
                  Type:{" "}
                  <Badge variant="secondary" className="text-xs">
                    {formData.hazardType.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  Severity:{" "}
                  <Badge variant="secondary" className="text-xs">
                    {formData.severity}
                  </Badge>
                </div>
                <div>Media: {formData.media.length} files</div>
                <div>Location: {formData.location ? "Captured" : "Not set"}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-t">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          size="sm"
          className="text-xs sm:text-sm bg-transparent"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          Previous
        </Button>

        {currentStep < totalSteps ? (
          <Button onClick={handleNext} disabled={!canProceed()} size="sm" className="text-xs sm:text-sm">
            Next
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!canProceed()} className="bg-red-600 hover:bg-red-700" size="sm">
            <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="text-xs sm:text-sm">Submit Report</span>
          </Button>
        )}
      </div>
    </div>
  )
}
