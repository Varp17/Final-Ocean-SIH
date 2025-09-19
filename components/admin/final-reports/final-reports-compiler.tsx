"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { FileText, Brain, Users, Shield, Clock, CheckCircle, Download, Send, Eye } from "lucide-react"
import { useState } from "react"

interface IncidentData {
  id: string
  title: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  location: string
  coordinates: { lat: number; lng: number }
  startTime: Date
  endTime?: Date
  status: "active" | "resolved" | "monitoring"
  mlAnalysis: {
    confidence: number
    hazardType: string
    estimatedImpact: string
    riskAssessment: string
    recommendations: string[]
  }
  analystVerification: {
    verifiedBy: string
    verificationTime: Date
    findings: string
    accuracy: number
    additionalNotes: string
  }
  responseActions: {
    teamsDeployed: string[]
    actionsToken: string[]
    resourcesUsed: string[]
    effectiveness: number
  }
  outcome: {
    resolved: boolean
    casualties: number
    damageAssessment: string
    lessonsLearned: string[]
  }
}

export function FinalReportsCompiler() {
  const [selectedIncident, setSelectedIncident] = useState<string>("")
  const [reportTitle, setReportTitle] = useState("")
  const [reportSummary, setReportSummary] = useState("")
  const [reportTemplate, setReportTemplate] = useState("comprehensive")
  const [compilationProgress, setCompilationProgress] = useState(0)
  const [isCompiling, setIsCompiling] = useState(false)

  const availableIncidents: IncidentData[] = [
    {
      id: "INC-2025-001",
      title: "Mumbai Port Oil Spill Emergency",
      type: "oil_spill",
      severity: "critical",
      location: "Mumbai Port, Sector 7",
      coordinates: { lat: 18.9388, lng: 72.8354 },
      startTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "resolved",
      mlAnalysis: {
        confidence: 95,
        hazardType: "Crude Oil Spill",
        estimatedImpact: "High environmental impact, 500L crude oil, 1.2km affected coastline",
        riskAssessment: "Critical - immediate containment required",
        recommendations: [
          "Deploy oil containment booms",
          "Evacuate marine life",
          "Notify environmental agencies",
          "Begin cleanup operations",
        ],
      },
      analystVerification: {
        verifiedBy: "Dr. Sharma, Marine Environmental Specialist",
        verificationTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
        findings: "Confirmed large-scale oil spill from container ship leak. Immediate environmental threat.",
        accuracy: 98,
        additionalNotes: "Satellite imagery confirms extent. Weather conditions favorable for containment.",
      },
      responseActions: {
        teamsDeployed: ["Coast Guard Alpha", "Environmental Response Team", "Marine Cleanup Crew"],
        actionsToken: [
          "Deployed containment booms",
          "Evacuated affected marine life",
          "Initiated cleanup operations",
          "Coordinated with port authority",
        ],
        resourcesUsed: ["3 response vessels", "500m containment boom", "Cleanup equipment", "Environmental monitoring"],
        effectiveness: 92,
      },
      outcome: {
        resolved: true,
        casualties: 0,
        damageAssessment: "Moderate environmental impact. 80% oil recovered. Marine ecosystem monitoring ongoing.",
        lessonsLearned: [
          "Faster deployment of containment systems needed",
          "Improved coordination with port authority",
          "Enhanced environmental monitoring protocols",
        ],
      },
    },
    {
      id: "INC-2025-002",
      title: "Chennai Marina High Wave Alert",
      type: "high_waves",
      severity: "high",
      location: "Chennai Marina Beach",
      coordinates: { lat: 13.0475, lng: 80.2824 },
      startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
      status: "resolved",
      mlAnalysis: {
        confidence: 88,
        hazardType: "High Wave Activity",
        estimatedImpact: "300 people at risk, beach closure required",
        riskAssessment: "High - immediate evacuation needed",
        recommendations: ["Close beach access", "Deploy rescue teams", "Issue public warnings", "Monitor conditions"],
      },
      analystVerification: {
        verifiedBy: "Coastal Safety Team",
        verificationTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
        findings: "Confirmed 4-5 meter waves due to offshore weather system. Multiple swimmers in distress.",
        accuracy: 91,
        additionalNotes: "Weather system moving away. Conditions improving gradually.",
      },
      responseActions: {
        teamsDeployed: ["Marine Response Beta", "Beach Safety Patrol"],
        actionsToken: ["Evacuated beach area", "Rescued 3 swimmers", "Issued public warnings", "Monitored conditions"],
        resourcesUsed: ["2 rescue boats", "Beach patrol vehicles", "Public announcement system"],
        effectiveness: 95,
      },
      outcome: {
        resolved: true,
        casualties: 0,
        damageAssessment: "No casualties. Minor property damage to beach facilities.",
        lessonsLearned: [
          "Earlier warning system activation",
          "Improved swimmer education",
          "Enhanced rescue coordination",
        ],
      },
    },
  ]

  const reportSections = [
    { id: "executive", name: "Executive Summary", required: true, completed: false },
    { id: "incident", name: "Incident Overview", required: true, completed: false },
    { id: "ml_analysis", name: "ML Analysis Results", required: true, completed: false },
    { id: "verification", name: "Analyst Verification", required: true, completed: false },
    { id: "response", name: "Response Actions", required: true, completed: false },
    { id: "outcome", name: "Outcome Assessment", required: true, completed: false },
    { id: "lessons", name: "Lessons Learned", required: false, completed: false },
    { id: "recommendations", name: "Future Recommendations", required: false, completed: false },
  ]

  const handleCompileReport = async () => {
    setIsCompiling(true)
    setCompilationProgress(0)

    // Simulate compilation process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setCompilationProgress(i)
    }

    setIsCompiling(false)
    // Here you would actually compile the report
  }

  const selectedIncidentData = availableIncidents.find((inc) => inc.id === selectedIncident)

  return (
    <div className="space-y-6">
      {/* Incident Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground">Select Incident for Report Compilation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Incident</label>
              <Select value={selectedIncident} onValueChange={setSelectedIncident}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an incident..." />
                </SelectTrigger>
                <SelectContent>
                  {availableIncidents.map((incident) => (
                    <SelectItem key={incident.id} value={incident.id}>
                      {incident.title} - {incident.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Report Template</label>
              <Select value={reportTemplate} onValueChange={setReportTemplate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                  <SelectItem value="executive">Executive Summary</SelectItem>
                  <SelectItem value="technical">Technical Analysis</SelectItem>
                  <SelectItem value="public">Public Information</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedIncidentData && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-card-foreground">{selectedIncidentData.title}</h3>
                <Badge
                  className={
                    selectedIncidentData.severity === "critical"
                      ? "bg-red-500 text-white"
                      : selectedIncidentData.severity === "high"
                        ? "bg-orange-500 text-white"
                        : "bg-yellow-500 text-white"
                  }
                >
                  {selectedIncidentData.severity.toUpperCase()}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <p className="font-medium">{selectedIncidentData.location}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p className="font-medium capitalize">{selectedIncidentData.status}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <p className="font-medium">
                    {selectedIncidentData.endTime
                      ? `${Math.round((selectedIncidentData.endTime.getTime() - selectedIncidentData.startTime.getTime()) / (1000 * 60 * 60))}h`
                      : "Ongoing"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">ML Confidence:</span>
                  <p className="font-medium">{selectedIncidentData.mlAnalysis.confidence}%</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedIncidentData && (
        <>
          {/* Report Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground">Report Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Report Title</label>
                  <Input
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="Enter report title..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Classification</label>
                  <Select defaultValue="internal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="internal">Internal Use</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                      <SelectItem value="confidential">Confidential</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Executive Summary</label>
                <Textarea
                  value={reportSummary}
                  onChange={(e) => setReportSummary(e.target.value)}
                  placeholder="Brief summary of the incident and response..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Report Sections */}
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground">Report Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="preview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="preview">Section Preview</TabsTrigger>
                  <TabsTrigger value="data">Source Data</TabsTrigger>
                  <TabsTrigger value="compilation">Compilation</TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportSections.map((section) => (
                      <div key={section.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-card-foreground">{section.name}</h4>
                          <div className="flex items-center gap-2">
                            {section.required && <Badge variant="outline">Required</Badge>}
                            {section.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {section.id === "executive" && "High-level overview and key findings"}
                          {section.id === "incident" && "Detailed incident timeline and description"}
                          {section.id === "ml_analysis" && "Machine learning analysis results and confidence"}
                          {section.id === "verification" && "Analyst verification and human assessment"}
                          {section.id === "response" && "Response actions taken and effectiveness"}
                          {section.id === "outcome" && "Final outcome and damage assessment"}
                          {section.id === "lessons" && "Key lessons learned from the incident"}
                          {section.id === "recommendations" && "Recommendations for future improvements"}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="data" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2 text-card-foreground">
                          <Brain className="h-4 w-4" />
                          ML Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Confidence:</span> {selectedIncidentData.mlAnalysis.confidence}%
                        </div>
                        <div>
                          <span className="font-medium">Type:</span> {selectedIncidentData.mlAnalysis.hazardType}
                        </div>
                        <div>
                          <span className="font-medium">Impact:</span> {selectedIncidentData.mlAnalysis.estimatedImpact}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2 text-card-foreground">
                          <Users className="h-4 w-4" />
                          Analyst Verification
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Verified by:</span>{" "}
                          {selectedIncidentData.analystVerification.verifiedBy}
                        </div>
                        <div>
                          <span className="font-medium">Accuracy:</span>{" "}
                          {selectedIncidentData.analystVerification.accuracy}%
                        </div>
                        <div>
                          <span className="font-medium">Findings:</span>{" "}
                          {selectedIncidentData.analystVerification.findings}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2 text-card-foreground">
                          <Shield className="h-4 w-4" />
                          Response Actions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Teams:</span>{" "}
                          {selectedIncidentData.responseActions.teamsDeployed.length}
                        </div>
                        <div>
                          <span className="font-medium">Actions:</span>{" "}
                          {selectedIncidentData.responseActions.actionsToken.length}
                        </div>
                        <div>
                          <span className="font-medium">Effectiveness:</span>{" "}
                          {selectedIncidentData.responseActions.effectiveness}%
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="compilation" className="space-y-4">
                  {isCompiling && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Compiling Report...</span>
                        <span className="text-sm text-muted-foreground">{compilationProgress}%</span>
                      </div>
                      <Progress value={compilationProgress} className="h-2" />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={handleCompileReport} disabled={isCompiling || !selectedIncident}>
                      <FileText className="h-4 w-4 mr-2" />
                      {isCompiling ? "Compiling..." : "Compile Report"}
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" disabled={!selectedIncident}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Report Preview - {selectedIncidentData.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-muted rounded-lg">
                            <h3 className="font-semibold mb-2">Executive Summary</h3>
                            <p className="text-sm leading-relaxed">
                              {reportSummary ||
                                `Critical incident at ${selectedIncidentData.location} involving ${selectedIncidentData.type.replace("_", " ")}. ML analysis showed ${selectedIncidentData.mlAnalysis.confidence}% confidence. Response teams successfully deployed with ${selectedIncidentData.responseActions.effectiveness}% effectiveness. Incident resolved with ${selectedIncidentData.outcome.casualties} casualties.`}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg">
                              <h4 className="font-medium mb-2">Incident Details</h4>
                              <div className="space-y-1 text-sm">
                                <div>
                                  <span className="font-medium">Location:</span> {selectedIncidentData.location}
                                </div>
                                <div>
                                  <span className="font-medium">Type:</span>{" "}
                                  {selectedIncidentData.type.replace("_", " ")}
                                </div>
                                <div>
                                  <span className="font-medium">Severity:</span> {selectedIncidentData.severity}
                                </div>
                                <div>
                                  <span className="font-medium">Status:</span> {selectedIncidentData.status}
                                </div>
                              </div>
                            </div>

                            <div className="p-4 border rounded-lg">
                              <h4 className="font-medium mb-2">Response Summary</h4>
                              <div className="space-y-1 text-sm">
                                <div>
                                  <span className="font-medium">Teams Deployed:</span>{" "}
                                  {selectedIncidentData.responseActions.teamsDeployed.length}
                                </div>
                                <div>
                                  <span className="font-medium">Actions Taken:</span>{" "}
                                  {selectedIncidentData.responseActions.actionsToken.length}
                                </div>
                                <div>
                                  <span className="font-medium">Effectiveness:</span>{" "}
                                  {selectedIncidentData.responseActions.effectiveness}%
                                </div>
                                <div>
                                  <span className="font-medium">Casualties:</span>{" "}
                                  {selectedIncidentData.outcome.casualties}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" disabled={!selectedIncident}>
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>

                    <Button variant="outline" disabled={!selectedIncident}>
                      <Send className="h-4 w-4 mr-2" />
                      Submit for Review
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
