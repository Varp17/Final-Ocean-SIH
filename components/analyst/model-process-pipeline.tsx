"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowRight,
  Database,
  Filter,
  Brain,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
  Zap,
  Target,
  BarChart3,
  RefreshCw,
  Eye,
  Settings,
} from "lucide-react"

interface PipelineStep {
  id: string
  name: string
  description: string
  status: "completed" | "processing" | "pending" | "error"
  progress: number
  duration: number
  icon: React.ReactNode
}

interface ProcessingReport {
  id: string
  source: string
  status: "ingest" | "clean" | "sentiment" | "geo" | "verify" | "output" | "error"
  step: string
  confidence: number
  startTime: string
  estimatedCompletion: string
  errorMessage?: string
}

interface ModelMetrics {
  name: string
  accuracy: number
  throughput: number
  latency: number
  status: "healthy" | "warning" | "error"
  lastUpdated: string
}

export function ModelProcessPipeline() {
  const [pipelineSteps] = useState<PipelineStep[]>([
    {
      id: "ingest",
      name: "Data Ingest",
      description: "Collecting reports from multiple sources",
      status: "completed",
      progress: 100,
      duration: 0.5,
      icon: <Database className="h-4 w-4" />,
    },
    {
      id: "clean",
      name: "Data Cleaning",
      description: "Preprocessing and normalizing input data",
      status: "processing",
      progress: 75,
      duration: 1.2,
      icon: <Filter className="h-4 w-4" />,
    },
    {
      id: "sentiment",
      name: "Sentiment Analysis",
      description: "Analyzing emotional content and urgency",
      status: "processing",
      progress: 45,
      duration: 2.1,
      icon: <Brain className="h-4 w-4" />,
    },
    {
      id: "geo",
      name: "Geo-tagging",
      description: "Extracting and validating location data",
      status: "pending",
      progress: 0,
      duration: 0,
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      id: "verify",
      name: "Cross-verification",
      description: "Validating against multiple data sources",
      status: "pending",
      progress: 0,
      duration: 0,
      icon: <CheckCircle className="h-4 w-4" />,
    },
    {
      id: "output",
      name: "Final Output",
      description: "Generating structured report for analysts",
      status: "pending",
      progress: 0,
      duration: 0,
      icon: <Target className="h-4 w-4" />,
    },
  ])

  const [processingQueue, setProcessingQueue] = useState<ProcessingReport[]>([
    {
      id: "RPT-2025-008",
      source: "Twitter",
      status: "sentiment",
      step: "Sentiment Analysis",
      confidence: 87,
      startTime: "14:32:15",
      estimatedCompletion: "14:35:20",
    },
    {
      id: "RPT-2025-009",
      source: "Website",
      status: "clean",
      step: "Data Cleaning",
      confidence: 92,
      startTime: "14:31:45",
      estimatedCompletion: "14:33:10",
    },
    {
      id: "RPT-2025-010",
      source: "WhatsApp",
      status: "geo",
      step: "Geo-tagging",
      confidence: 78,
      startTime: "14:30:22",
      estimatedCompletion: "14:34:45",
    },
    {
      id: "RPT-2025-011",
      source: "Voice Call",
      status: "verify",
      step: "Cross-verification",
      confidence: 94,
      startTime: "14:29:18",
      estimatedCompletion: "14:32:30",
    },
    {
      id: "RPT-2025-012",
      source: "Social Media",
      status: "error",
      step: "Sentiment Analysis",
      confidence: 0,
      startTime: "14:28:55",
      estimatedCompletion: "Failed",
      errorMessage: "Insufficient data for sentiment analysis",
    },
  ])

  const [modelMetrics] = useState<ModelMetrics[]>([
    {
      name: "Text Classification",
      accuracy: 89.2,
      throughput: 1250,
      latency: 145,
      status: "healthy",
      lastUpdated: "2 min ago",
    },
    {
      name: "Image Analysis",
      accuracy: 91.7,
      throughput: 340,
      latency: 890,
      status: "healthy",
      lastUpdated: "1 min ago",
    },
    {
      name: "Sentiment Analysis",
      accuracy: 85.4,
      throughput: 2100,
      latency: 95,
      status: "warning",
      lastUpdated: "3 min ago",
    },
    {
      name: "Location Extraction",
      accuracy: 93.1,
      throughput: 1800,
      latency: 120,
      status: "healthy",
      lastUpdated: "1 min ago",
    },
    {
      name: "Threat Assessment",
      accuracy: 87.8,
      throughput: 950,
      latency: 210,
      status: "healthy",
      lastUpdated: "4 min ago",
    },
  ])

  const [errorLogs] = useState([
    {
      id: "ERR-001",
      reportId: "RPT-2025-012",
      step: "Sentiment Analysis",
      error: "Insufficient data for sentiment analysis",
      timestamp: "14:28:55",
      severity: "medium",
    },
    {
      id: "ERR-002",
      reportId: "RPT-2025-007",
      step: "Geo-tagging",
      error: "Location coordinates out of bounds",
      timestamp: "14:25:12",
      severity: "low",
    },
    {
      id: "ERR-003",
      reportId: "RPT-2025-005",
      step: "Cross-verification",
      error: "External API timeout",
      timestamp: "14:22:33",
      severity: "high",
    },
  ])

  const getStepStatus = (status: string) => {
    switch (status) {
      case "completed":
        return { color: "bg-green-500", textColor: "text-green-700", icon: <CheckCircle className="h-4 w-4" /> }
      case "processing":
        return {
          color: "bg-blue-500",
          textColor: "text-blue-700",
          icon: <RefreshCw className="h-4 w-4 animate-spin" />,
        }
      case "pending":
        return { color: "bg-gray-300", textColor: "text-gray-600", icon: <Clock className="h-4 w-4" /> }
      case "error":
        return { color: "bg-red-500", textColor: "text-red-700", icon: <AlertTriangle className="h-4 w-4" /> }
      default:
        return { color: "bg-gray-300", textColor: "text-gray-600", icon: <Clock className="h-4 w-4" /> }
    }
  }

  const getQueueStatus = (status: string) => {
    switch (status) {
      case "ingest":
        return { badge: "Ingesting", color: "bg-blue-100 text-blue-800" }
      case "clean":
        return { badge: "Cleaning", color: "bg-purple-100 text-purple-800" }
      case "sentiment":
        return { badge: "Analyzing", color: "bg-orange-100 text-orange-800" }
      case "geo":
        return { badge: "Geo-tagging", color: "bg-green-100 text-green-800" }
      case "verify":
        return { badge: "Verifying", color: "bg-yellow-100 text-yellow-800" }
      case "output":
        return { badge: "Finalizing", color: "bg-indigo-100 text-indigo-800" }
      case "error":
        return { badge: "Error", color: "bg-red-100 text-red-800" }
      default:
        return { badge: "Unknown", color: "bg-gray-100 text-gray-800" }
    }
  }

  const getModelStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            AI Model Processing Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Pipeline Steps */}
            <div className="flex items-center justify-between overflow-x-auto pb-4">
              {pipelineSteps.map((step, index) => {
                const statusInfo = getStepStatus(step.status)
                return (
                  <div key={step.id} className="flex items-center min-w-0">
                    <div className="flex flex-col items-center space-y-2 min-w-[120px]">
                      <div
                        className={`w-12 h-12 rounded-full ${statusInfo.color} flex items-center justify-center text-white`}
                      >
                        {step.status === "processing" ? statusInfo.icon : step.icon}
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-sm">{step.name}</div>
                        <div className="text-xs text-gray-500 max-w-[100px] truncate">{step.description}</div>
                        {step.status === "processing" && (
                          <div className="mt-1">
                            <Progress value={step.progress} className="w-16 h-1" />
                            <div className="text-xs text-gray-500 mt-1">{step.progress}%</div>
                          </div>
                        )}
                        {step.status === "completed" && (
                          <div className="text-xs text-green-600 mt-1">{step.duration}s</div>
                        )}
                      </div>
                    </div>
                    {index < pipelineSteps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-gray-400 mx-4 flex-shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Pipeline Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Total Processed</p>
                    <p className="text-2xl font-bold text-blue-800">1,247</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Success Rate</p>
                    <p className="text-2xl font-bold text-green-800">94.2%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600">Avg Processing</p>
                    <p className="text-2xl font-bold text-orange-800">3.2s</p>
                  </div>
                  <Zap className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600">Error Rate</p>
                    <p className="text-2xl font-bold text-red-800">5.8%</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Views */}
      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="queue">Processing Queue</TabsTrigger>
          <TabsTrigger value="models">Model Performance</TabsTrigger>
          <TabsTrigger value="errors">Error Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="queue">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Live Processing Queue</span>
                <Badge variant="secondary">{processingQueue.length} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {processingQueue.map((report) => {
                    const statusInfo = getQueueStatus(report.status)
                    return (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex flex-col items-center">
                            <Badge className={`text-xs ${statusInfo.color}`}>{statusInfo.badge}</Badge>
                            {report.status !== "error" && (
                              <div className="mt-1 text-xs text-gray-500">{report.confidence}%</div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{report.id}</div>
                            <div className="text-sm text-gray-600">
                              {report.source} • {report.step}
                            </div>
                            {report.errorMessage && (
                              <div className="text-xs text-red-600 mt-1">{report.errorMessage}</div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{report.startTime}</div>
                          <div className="text-xs text-gray-500">ETA: {report.estimatedCompletion}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {modelMetrics.map((model) => (
              <Card key={model.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-base">{model.name}</span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          model.status === "healthy"
                            ? "bg-green-500"
                            : model.status === "warning"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      <span className={`text-sm ${getModelStatusColor(model.status)}`}>{model.status}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Accuracy</p>
                        <div className="flex items-center gap-2">
                          <Progress value={model.accuracy} className="flex-1" />
                          <span className="text-sm font-medium">{model.accuracy}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Throughput</p>
                        <p className="text-lg font-bold">{model.throughput.toLocaleString()}/hr</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Latency</p>
                        <p className="text-lg font-bold">{model.latency}ms</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Updated</p>
                        <p className="text-sm">{model.lastUpdated}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Error Logs & Manual Review Queue</span>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Alerts
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {errorLogs.map((error) => (
                    <div key={error.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex items-start space-x-4">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{error.reportId}</span>
                            <Badge className={`text-xs ${getSeverityColor(error.severity)}`}>{error.severity}</Badge>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{error.step}</div>
                          <div className="text-sm text-red-600 mt-1">{error.error}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{error.timestamp}</span>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
