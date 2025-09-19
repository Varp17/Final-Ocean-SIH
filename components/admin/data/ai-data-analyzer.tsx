"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Zap,
  BarChart3,
  RefreshCw,
  Download,
  Eye,
  Activity,
  Target,
} from "lucide-react"

interface AnalysisResult {
  id: string
  type: "pattern" | "anomaly" | "prediction" | "insight"
  title: string
  description: string
  confidence: number
  severity: "low" | "medium" | "high" | "critical"
  timestamp: string
  data?: any
}

interface DataMetrics {
  totalRecords: number
  processedToday: number
  anomaliesDetected: number
  accuracyRate: number
  processingSpeed: number
  aiConfidence: number
}

export function AIDataAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedModel, setSelectedModel] = useState("groq")
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [metrics, setMetrics] = useState<DataMetrics>({
    totalRecords: 45678,
    processedToday: 1234,
    anomaliesDetected: 23,
    accuracyRate: 94.7,
    processingSpeed: 2.3,
    aiConfidence: 87.5,
  })

  // Mock analysis results
  const mockResults: AnalysisResult[] = [
    {
      id: "1",
      type: "anomaly",
      title: "Unusual Reporting Pattern Detected",
      description: "Spike in hazard reports from Mumbai region - 340% increase in last 2 hours",
      confidence: 92,
      severity: "high",
      timestamp: "2024-01-15 14:30:00",
    },
    {
      id: "2",
      type: "prediction",
      title: "Storm Surge Prediction",
      description: "AI models predict 78% chance of storm surge in Chennai within next 6 hours",
      confidence: 78,
      severity: "critical",
      timestamp: "2024-01-15 14:25:00",
    },
    {
      id: "3",
      type: "pattern",
      title: "Seasonal Trend Analysis",
      description: "Historical data shows 23% increase in coastal hazards during this period",
      confidence: 85,
      severity: "medium",
      timestamp: "2024-01-15 14:20:00",
    },
    {
      id: "4",
      type: "insight",
      title: "Response Time Optimization",
      description: "AI suggests relocating Team Alpha to reduce average response time by 12 minutes",
      confidence: 89,
      severity: "low",
      timestamp: "2024-01-15 14:15:00",
    },
  ]

  const runAIAnalysis = async () => {
    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/admin/ai-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          analysisType: "comprehensive",
        }),
      })

      if (response.ok) {
        const results = await response.json()
        setAnalysisResults(results.analysis || mockResults)

        // Update metrics with AI results
        setMetrics((prev) => ({
          ...prev,
          processedToday: prev.processedToday + 50,
          aiConfidence: results.confidence || prev.aiConfidence,
        }))
      } else {
        // Fallback to mock data
        setAnalysisResults(mockResults)
      }
    } catch (error) {
      console.error("AI Analysis failed:", error)
      // Use mock data as fallback
      setAnalysisResults(mockResults)
    }

    setTimeout(() => setIsAnalyzing(false), 3000)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pattern":
        return <TrendingUp className="h-4 w-4" />
      case "anomaly":
        return <AlertTriangle className="h-4 w-4" />
      case "prediction":
        return <Target className="h-4 w-4" />
      case "insight":
        return <Brain className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  useEffect(() => {
    // Load initial analysis results
    setAnalysisResults(mockResults)
  }, [])

  return (
    <div className="space-y-6">
      {/* AI Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Analysis Control Center
          </CardTitle>
          <CardDescription>Powered by Groq and Grok integrations for advanced data intelligence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">AI Model:</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="groq">Groq</SelectItem>
                  <SelectItem value="grok">Grok</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={runAIAnalysis} disabled={isAnalyzing} className="flex items-center gap-2">
              {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {isAnalyzing ? "Analyzing..." : "Run AI Analysis"}
            </Button>

            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Results
            </Button>
          </div>

          {/* Real-time Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{metrics.totalRecords.toLocaleString()}</div>
              <div className="text-xs text-blue-700">Total Records</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{metrics.processedToday}</div>
              <div className="text-xs text-green-700">Processed Today</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{metrics.anomaliesDetected}</div>
              <div className="text-xs text-orange-700">Anomalies Found</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{metrics.accuracyRate}%</div>
              <div className="text-xs text-purple-700">Accuracy Rate</div>
            </div>
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{metrics.processingSpeed}s</div>
              <div className="text-xs text-indigo-700">Avg Processing</div>
            </div>
            <div className="text-center p-3 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">{metrics.aiConfidence}%</div>
              <div className="text-xs text-emerald-700">AI Confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      <Tabs defaultValue="results" className="space-y-4">
        <TabsList>
          <TabsTrigger value="results">Analysis Results</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Detection</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Latest AI Analysis Results</CardTitle>
              <CardDescription>Real-time insights and anomaly detection from your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResults.map((result) => (
                  <div key={result.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-slate-50">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100">
                      {getTypeIcon(result.type)}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-slate-900">{result.title}</h4>
                        <Badge className={getSeverityColor(result.severity)}>{result.severity.toUpperCase()}</Badge>
                        <Badge variant="outline" className="capitalize">
                          {result.type}
                        </Badge>
                      </div>

                      <p className="text-sm text-slate-600">{result.description}</p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Confidence:</span>
                          <Progress value={result.confidence} className="w-20 h-2" />
                          <span className="text-xs font-medium">{result.confidence}%</span>
                        </div>
                        <span className="text-xs text-slate-500">{result.timestamp}</span>
                      </div>
                    </div>

                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns">
          <Card>
            <CardHeader>
              <CardTitle>Pattern Detection</CardTitle>
              <CardDescription>AI-identified patterns in hazard reporting and response data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Temporal Patterns</h4>
                  <p className="text-sm text-slate-600 mb-3">Peak reporting hours: 2-4 PM and 8-10 PM</p>
                  <Progress value={78} className="mb-2" />
                  <span className="text-xs text-slate-500">78% pattern confidence</span>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Geographic Clusters</h4>
                  <p className="text-sm text-slate-600 mb-3">High activity zones: Mumbai, Chennai, Kochi</p>
                  <Progress value={85} className="mb-2" />
                  <span className="text-xs text-slate-500">85% pattern confidence</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions">
          <Card>
            <CardHeader>
              <CardTitle>AI Predictions</CardTitle>
              <CardDescription>Predictive analytics for hazard forecasting and resource planning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <h4 className="font-medium text-red-900">High Risk Prediction</h4>
                  </div>
                  <p className="text-sm text-red-700 mb-2">Storm surge likely in Chennai region within 6 hours</p>
                  <div className="flex items-center gap-2">
                    <Progress value={78} className="flex-1" />
                    <span className="text-sm font-medium text-red-700">78% probability</span>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-yellow-600" />
                    <h4 className="font-medium text-yellow-900">Resource Demand Forecast</h4>
                  </div>
                  <p className="text-sm text-yellow-700 mb-2">Expected 40% increase in rescue team deployment needs</p>
                  <div className="flex items-center gap-2">
                    <Progress value={65} className="flex-1" />
                    <span className="text-sm font-medium text-yellow-700">65% confidence</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Insights</CardTitle>
              <CardDescription>Strategic recommendations based on data analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    Response Optimization
                  </h4>
                  <p className="text-sm text-slate-600 mb-3">
                    Relocating Team Alpha to Sector 7 could reduce average response time by 12 minutes
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-purple-100 text-purple-800">Efficiency Gain: +18%</Badge>
                    <Button size="sm" variant="outline">
                      Implement
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    Resource Allocation
                  </h4>
                  <p className="text-sm text-slate-600 mb-3">
                    Current equipment distribution is suboptimal for predicted hazard patterns
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-100 text-blue-800">Cost Reduction: -23%</Badge>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
