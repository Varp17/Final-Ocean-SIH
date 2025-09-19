"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, AlertTriangle, MapPin, Clock, Target, Brain, Zap, Activity } from "lucide-react"

interface EscalationPrediction {
  escalation_probability: number
  escalation_level: string
  confidence: number
  affected_zone: Array<{ latitude: number; longitude: number }>
  zone_size_km2: number
  time_predictions: {
    now: { probability: number; level: string }
    "6_hours": { probability: number; level: string }
    "12_hours": { probability: number; level: string }
    "24_hours": { probability: number; level: string }
  }
  recommendations: string[]
}

export function PredictiveDashboard() {
  const [predictions, setPredictions] = useState<EscalationPrediction[]>([])
  const [selectedPrediction, setSelectedPrediction] = useState<EscalationPrediction | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock prediction data
  const mockPredictions: EscalationPrediction[] = [
    {
      escalation_probability: 0.78,
      escalation_level: "high",
      confidence: 0.85,
      affected_zone: [
        { latitude: 19.076, longitude: 72.8777 },
        { latitude: 19.08, longitude: 72.88 },
        { latitude: 19.072, longitude: 72.882 },
        { latitude: 19.068, longitude: 72.875 },
      ],
      zone_size_km2: 12.5,
      time_predictions: {
        now: { probability: 0.78, level: "high" },
        "6_hours": { probability: 0.82, level: "high" },
        "12_hours": { probability: 0.85, level: "critical" },
        "24_hours": { probability: 0.75, level: "high" },
      },
      recommendations: [
        "Activate emergency response teams",
        "Issue public safety warnings",
        "Prepare evacuation plans",
        "Monitor situation continuously",
      ],
    },
    {
      escalation_probability: 0.45,
      escalation_level: "medium",
      confidence: 0.72,
      affected_zone: [
        { latitude: 18.9388, longitude: 72.8354 },
        { latitude: 18.942, longitude: 72.838 },
        { latitude: 18.935, longitude: 72.84 },
        { latitude: 18.932, longitude: 72.832 },
      ],
      zone_size_km2: 8.2,
      time_predictions: {
        now: { probability: 0.45, level: "medium" },
        "6_hours": { probability: 0.48, level: "medium" },
        "12_hours": { probability: 0.42, level: "medium" },
        "24_hours": { probability: 0.38, level: "low" },
      },
      recommendations: [
        "Increase monitoring frequency",
        "Alert emergency services to standby",
        "Issue advisory warnings to public",
      ],
    },
  ]

  useEffect(() => {
    setPredictions(mockPredictions)
    setSelectedPrediction(mockPredictions[0])
  }, [])

  const getLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getProbabilityColor = (prob: number) => {
    if (prob >= 0.8) return "text-red-600"
    if (prob >= 0.6) return "text-orange-600"
    if (prob >= 0.4) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Predictive Analytics Dashboard</h1>
          <p className="text-gray-600">AI-powered hazard escalation predictions and risk assessment</p>
        </div>
        <Button onClick={() => setIsLoading(true)} disabled={isLoading}>
          <Brain className="h-4 w-4 mr-2" />
          {isLoading ? "Analyzing..." : "Run Prediction"}
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Predictions</p>
                <p className="text-2xl font-bold text-blue-600">{predictions.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Risk Zones</p>
                <p className="text-2xl font-bold text-red-600">
                  {predictions.filter((p) => p.escalation_level === "high" || p.escalation_level === "critical").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Confidence</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((predictions.reduce((acc, p) => acc + p.confidence, 0) / predictions.length) * 100)}%
                </p>
              </div>
              <Zap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Area</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(predictions.reduce((acc, p) => acc + p.zone_size_km2, 0))} km²
                </p>
              </div>
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Escalation Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictions.map((prediction, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPrediction === prediction ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedPrediction(prediction)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`${getLevelColor(prediction.escalation_level)} border`}>
                      {prediction.escalation_level}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getProbabilityColor(prediction.escalation_probability)}`}>
                        {Math.round(prediction.escalation_probability * 100)}%
                      </span>
                      <Badge variant="outline">{Math.round(prediction.confidence * 100)}% confidence</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Escalation Probability</span>
                      <span className={getProbabilityColor(prediction.escalation_probability)}>
                        {Math.round(prediction.escalation_probability * 100)}%
                      </span>
                    </div>
                    <Progress value={prediction.escalation_probability * 100} className="h-2" />
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {prediction.zone_size_km2} km²
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Next 24h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Prediction View */}
        {selectedPrediction && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Prediction Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="timeline" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="zone">Affected Zone</TabsTrigger>
                  <TabsTrigger value="recommendations">Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="space-y-4">
                  <div className="space-y-3">
                    {Object.entries(selectedPrediction.time_predictions).map(([time, data]) => (
                      <div key={time} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium capitalize">{time.replace("_", " ")}</p>
                          <Badge className={`${getLevelColor(data.level)} border mt-1`}>{data.level}</Badge>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${getProbabilityColor(data.probability)}`}>
                            {Math.round(data.probability * 100)}%
                          </p>
                          <Progress value={data.probability * 100} className="h-2 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="zone" className="space-y-4">
                  <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Affected Zone Visualization</p>
                      <p className="text-sm text-gray-500">Area: {selectedPrediction.zone_size_km2} km²</p>
                      <p className="text-sm text-gray-500">{selectedPrediction.affected_zone.length} boundary points</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Zone Center</p>
                      <p className="text-gray-600">
                        {selectedPrediction.affected_zone[0]?.latitude.toFixed(4)},{" "}
                        {selectedPrediction.affected_zone[0]?.longitude.toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Estimated Radius</p>
                      <p className="text-gray-600">
                        {Math.sqrt(selectedPrediction.zone_size_km2 / Math.PI).toFixed(1)} km
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-4">
                  <div className="space-y-3">
                    {selectedPrediction.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800">{rec}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">Implement Actions</Button>
                    <Button variant="outline">Export Report</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
