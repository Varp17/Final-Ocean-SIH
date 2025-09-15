"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Send,
  Edit,
  RefreshCw,
  Download,
  Eye,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
} from "lucide-react"

interface FinalReport {
  id: string
  incidentId: string
  location: string
  hazardType: string
  date: string
  time: string
  totalReports: number
  verifiedAI: number
  verifiedAnalyst: number
  rejected: number
  sentimentBreakdown: {
    fear: number
    neutral: number
    panic: number
  }
  sources: {
    twitter: number
    website: number
    whatsapp: number
    call: number
  }
  recommendedAction: string
  alertLevel: "Level 1" | "Level 2" | "Level 3" | "Level 4"
  status: "draft" | "pending_review" | "approved" | "sent"
  summary: string
  keyFindings: string[]
  recommendations: string[]
  createdBy: string
  lastModified: string
}

export function FinalReportsGeneration() {
  const [reports, setReports] = useState<FinalReport[]>([
    {
      id: "FR-2025-001",
      incidentId: "2025-TSU-0032",
      location: "Vizag, Andhra Pradesh",
      hazardType: "High Waves",
      date: "15 Sept 2025",
      time: "14:22 IST",
      totalReports: 46,
      verifiedAI: 32,
      verifiedAnalyst: 10,
      rejected: 4,
      sentimentBreakdown: {
        fear: 60,
        neutral: 25,
        panic: 15,
      },
      sources: {
        twitter: 28,
        website: 12,
        whatsapp: 4,
        call: 2,
      },
      recommendedAction: "Level 2 Alert",
      alertLevel: "Level 2",
      status: "approved",
      summary:
        "High wave activity detected along Vizag coastline with significant public concern. Multiple verified reports indicate waves reaching 4-5 meters with potential for coastal flooding.",
      keyFindings: [
        "Wave heights consistently reported at 4-5 meters",
        "High correlation between AI and analyst verification (87%)",
        "Significant social media activity indicating public awareness",
        "Weather conditions support reported wave activity",
      ],
      recommendations: [
        "Issue Level 2 coastal alert for Vizag district",
        "Activate emergency response teams",
        "Coordinate with local authorities for beach closures",
        "Monitor situation for potential escalation",
      ],
      createdBy: "Analyst_Kumar",
      lastModified: "2 hours ago",
    },
    {
      id: "FR-2025-002",
      incidentId: "2025-FLD-0018",
      location: "Mumbai Coast",
      hazardType: "Flood",
      date: "15 Sept 2025",
      time: "12:45 IST",
      totalReports: 23,
      verifiedAI: 18,
      verifiedAnalyst: 3,
      rejected: 2,
      sentimentBreakdown: {
        fear: 45,
        neutral: 35,
        panic: 20,
      },
      sources: {
        twitter: 15,
        website: 5,
        whatsapp: 2,
        call: 1,
      },
      recommendedAction: "Level 1 Alert",
      alertLevel: "Level 1",
      status: "pending_review",
      summary:
        "Localized flooding reported in low-lying areas of Mumbai coast. Reports indicate water accumulation but no immediate threat to life or property.",
      keyFindings: [
        "Flooding limited to known vulnerable areas",
        "No reports of structural damage",
        "Water levels manageable with existing drainage",
        "Public response measured and appropriate",
      ],
      recommendations: [
        "Issue Level 1 advisory for affected areas",
        "Monitor drainage systems",
        "Provide traffic updates for affected routes",
        "Continue monitoring for 24 hours",
      ],
      createdBy: "Analyst_Sharma",
      lastModified: "30 minutes ago",
    },
    {
      id: "FR-2025-003",
      incidentId: "2025-OIL-0007",
      location: "Kochi Port, Kerala",
      hazardType: "Oil Spill",
      date: "15 Sept 2025",
      time: "10:15 IST",
      totalReports: 67,
      verifiedAI: 45,
      verifiedAnalyst: 18,
      rejected: 4,
      sentimentBreakdown: {
        fear: 35,
        neutral: 40,
        panic: 25,
      },
      sources: {
        twitter: 42,
        website: 15,
        whatsapp: 8,
        call: 2,
      },
      recommendedAction: "Level 3 Alert",
      alertLevel: "Level 3",
      status: "draft",
      summary:
        "Significant oil spill detected near Kochi Port with environmental impact concerns. Multiple sources confirm presence of oil slick affecting marine ecosystem.",
      keyFindings: [
        "Oil slick confirmed by satellite imagery",
        "Marine life impact reported by fishing communities",
        "Port operations temporarily suspended",
        "Environmental agencies mobilized",
      ],
      recommendations: [
        "Issue Level 3 environmental emergency alert",
        "Deploy oil spill response teams",
        "Coordinate with Coast Guard for containment",
        "Establish exclusion zone for fishing activities",
      ],
      createdBy: "Analyst_Nair",
      lastModified: "1 hour ago",
    },
  ])

  const [selectedReport, setSelectedReport] = useState<FinalReport | null>(null)
  const [editingReport, setEditingReport] = useState<FinalReport | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Draft
          </Badge>
        )
      case "pending_review":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            Pending Review
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        )
      case "sent":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Sent to Admin
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case "Level 1":
        return "bg-green-100 text-green-800 border-green-200"
      case "Level 2":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Level 3":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Level 4":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleReportAction = (reportId: string, action: "approve" | "edit" | "send" | "request_info") => {
    setReports((prev) =>
      prev.map((report) => {
        if (report.id === reportId) {
          switch (action) {
            case "approve":
              return { ...report, status: "approved" as const }
            case "send":
              return { ...report, status: "sent" as const }
            case "edit":
              setEditingReport(report)
              setIsEditDialogOpen(true)
              return report
            case "request_info":
              // This would typically trigger a request for more information
              return report
            default:
              return report
          }
        }
        return report
      }),
    )
  }

  const handleSaveEdit = () => {
    if (editingReport) {
      setReports((prev) => prev.map((report) => (report.id === editingReport.id ? editingReport : report)))
      setIsEditDialogOpen(false)
      setEditingReport(null)
    }
  }

  const generateNewReport = () => {
    // This would typically trigger the AI to generate a new report
    console.log("Generating new report...")
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Final Reports Generation
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button onClick={generateNewReport} className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate New Report
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Total Reports</p>
                  <p className="text-2xl font-bold text-blue-800">{reports.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Approved</p>
                  <p className="text-2xl font-bold text-green-800">
                    {reports.filter((r) => r.status === "approved").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-800">
                    {reports.filter((r) => r.status === "pending_review").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">Sent to Admin</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {reports.filter((r) => r.status === "sent").length}
                  </p>
                </div>
                <Send className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {report.incidentId}
                    </Badge>
                    {getStatusBadge(report.status)}
                  </div>
                  <CardTitle className="text-lg">{report.location}</CardTitle>
                  <p className="text-sm text-gray-600">{report.hazardType}</p>
                </div>
                <Badge className={`${getAlertLevelColor(report.alertLevel)} border`}>{report.alertLevel}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Incident Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{report.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{report.time}</span>
                </div>
              </div>

              {/* Report Statistics */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Reports:</span>
                    <span className="font-medium">{report.totalReports}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">AI Verified:</span>
                    <span className="font-medium text-green-600">{report.verifiedAI}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Analyst:</span>
                    <span className="font-medium text-blue-600">{report.verifiedAnalyst}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rejected:</span>
                    <span className="font-medium text-red-600">{report.rejected}</span>
                  </div>
                </div>
              </div>

              {/* Sentiment Breakdown */}
              <div>
                <p className="text-sm font-medium mb-2">Sentiment Distribution</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Fear: {report.sentimentBreakdown.fear}%</span>
                    <span>Neutral: {report.sentimentBreakdown.neutral}%</span>
                    <span>Panic: {report.sentimentBreakdown.panic}%</span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500" style={{ width: `${report.sentimentBreakdown.fear}%` }} />
                    <div className="bg-gray-400" style={{ width: `${report.sentimentBreakdown.neutral}%` }} />
                    <div className="bg-orange-500" style={{ width: `${report.sentimentBreakdown.panic}%` }} />
                  </div>
                </div>
              </div>

              {/* Sources */}
              <div>
                <p className="text-sm font-medium mb-2">Sources</p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline">Twitter({report.sources.twitter})</Badge>
                  <Badge variant="outline">Website({report.sources.website})</Badge>
                  <Badge variant="outline">WhatsApp({report.sources.whatsapp})</Badge>
                  <Badge variant="outline">Call({report.sources.call})</Badge>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-1">Recommended Action</p>
                <p className="text-sm text-blue-700">{report.recommendedAction}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" onClick={() => setSelectedReport(report)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Final Report - {selectedReport?.incidentId}</DialogTitle>
                      <DialogDescription>Comprehensive incident analysis and recommendations</DialogDescription>
                    </DialogHeader>

                    {selectedReport && (
                      <Tabs defaultValue="summary" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="summary">Summary</TabsTrigger>
                          <TabsTrigger value="findings">Key Findings</TabsTrigger>
                          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                          <TabsTrigger value="data">Raw Data</TabsTrigger>
                        </TabsList>

                        <TabsContent value="summary" className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Incident Summary</h4>
                            <p className="text-sm">{selectedReport.summary}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Location & Time</h4>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <MapPin className="h-4 w-4 inline mr-1" />
                                  {selectedReport.location}
                                </p>
                                <p>
                                  <Calendar className="h-4 w-4 inline mr-1" />
                                  {selectedReport.date} at {selectedReport.time}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Alert Level</h4>
                              <Badge
                                className={`${getAlertLevelColor(selectedReport.alertLevel)} border text-base px-3 py-1`}
                              >
                                {selectedReport.alertLevel}
                              </Badge>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="findings" className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-3">Key Findings</h4>
                            <ul className="space-y-2">
                              {selectedReport.keyFindings.map((finding, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  {finding}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </TabsContent>

                        <TabsContent value="recommendations" className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-3">Recommendations</h4>
                            <ul className="space-y-2">
                              {selectedReport.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </TabsContent>

                        <TabsContent value="data" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium mb-3">Report Statistics</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Total Reports:</span>
                                  <span className="font-medium">{selectedReport.totalReports}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>AI Verified:</span>
                                  <span className="font-medium text-green-600">{selectedReport.verifiedAI}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Analyst Verified:</span>
                                  <span className="font-medium text-blue-600">{selectedReport.verifiedAnalyst}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Rejected:</span>
                                  <span className="font-medium text-red-600">{selectedReport.rejected}</span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium mb-3">Source Breakdown</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Twitter:</span>
                                  <span className="font-medium">{selectedReport.sources.twitter}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Website:</span>
                                  <span className="font-medium">{selectedReport.sources.website}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>WhatsApp:</span>
                                  <span className="font-medium">{selectedReport.sources.whatsapp}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Voice Call:</span>
                                  <span className="font-medium">{selectedReport.sources.call}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    )}
                  </DialogContent>
                </Dialog>

                {report.status === "draft" && (
                  <Button size="sm" variant="outline" onClick={() => handleReportAction(report.id, "edit")}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}

                {report.status === "pending_review" && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleReportAction(report.id, "approve")}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                )}

                {report.status === "approved" && (
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleReportAction(report.id, "send")}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send to Admin
                  </Button>
                )}

                <Button size="sm" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Request More Info
                </Button>
              </div>

              {/* Metadata */}
              <div className="text-xs text-gray-500 pt-2 border-t">
                <p>Created by: {report.createdBy}</p>
                <p>Last modified: {report.lastModified}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Report - {editingReport?.incidentId}</DialogTitle>
            <DialogDescription>Modify report details and recommendations</DialogDescription>
          </DialogHeader>

          {editingReport && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Summary</label>
                <Textarea
                  value={editingReport.summary}
                  onChange={(e) => setEditingReport({ ...editingReport, summary: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Recommended Action</label>
                <Input
                  value={editingReport.recommendedAction}
                  onChange={(e) => setEditingReport({ ...editingReport, recommendedAction: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Alert Level</label>
                <Select
                  value={editingReport.alertLevel}
                  onValueChange={(value) => setEditingReport({ ...editingReport, alertLevel: value as any })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Level 1">Level 1</SelectItem>
                    <SelectItem value="Level 2">Level 2</SelectItem>
                    <SelectItem value="Level 3">Level 3</SelectItem>
                    <SelectItem value="Level 4">Level 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
