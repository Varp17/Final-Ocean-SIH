"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileText, Copy, Edit, Plus, Eye } from "lucide-react"

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: "incident" | "analysis" | "summary" | "public"
  sections: string[]
  estimatedPages: number
  usageCount: number
  lastUsed: Date
  isDefault: boolean
}

export function ReportTemplates() {
  const templates: ReportTemplate[] = [
    {
      id: "comprehensive",
      name: "Comprehensive Incident Report",
      description: "Complete incident analysis with ML data, verification, response actions, and outcomes",
      category: "incident",
      sections: [
        "Executive Summary",
        "Incident Overview",
        "ML Analysis Results",
        "Analyst Verification",
        "Response Actions",
        "Outcome Assessment",
        "Lessons Learned",
        "Recommendations",
      ],
      estimatedPages: 25,
      usageCount: 45,
      lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isDefault: true,
    },
    {
      id: "executive",
      name: "Executive Summary Report",
      description: "High-level summary for management and stakeholders",
      category: "summary",
      sections: ["Executive Summary", "Key Findings", "Impact Assessment", "Recommendations"],
      estimatedPages: 8,
      usageCount: 32,
      lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isDefault: false,
    },
    {
      id: "technical",
      name: "Technical Analysis Report",
      description: "Detailed technical analysis for specialists and researchers",
      category: "analysis",
      sections: [
        "Technical Overview",
        "ML Algorithm Performance",
        "Data Analysis",
        "Verification Methodology",
        "Technical Findings",
        "Future Improvements",
      ],
      estimatedPages: 35,
      usageCount: 18,
      lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      isDefault: false,
    },
    {
      id: "public",
      name: "Public Information Report",
      description: "Public-facing report with appropriate information disclosure",
      category: "public",
      sections: ["Incident Summary", "Response Actions", "Public Safety Measures", "Contact Information"],
      estimatedPages: 6,
      usageCount: 28,
      lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isDefault: false,
    },
    {
      id: "environmental",
      name: "Environmental Impact Assessment",
      description: "Focused on environmental consequences and remediation",
      category: "analysis",
      sections: [
        "Environmental Overview",
        "Impact Assessment",
        "Ecosystem Effects",
        "Remediation Actions",
        "Monitoring Plan",
        "Recovery Timeline",
      ],
      estimatedPages: 20,
      usageCount: 15,
      lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isDefault: false,
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "incident":
        return "bg-red-100 text-red-800 border-red-200"
      case "analysis":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "summary":
        return "bg-green-100 text-green-800 border-green-200"
      case "public":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Report Templates</h2>
          <p className="text-muted-foreground">Pre-configured templates for different types of reports</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className={`relative ${template.isDefault ? "border-primary" : ""}`}>
            {template.isDefault && (
              <div className="absolute top-2 right-2">
                <Badge variant="default" className="text-xs">
                  Default
                </Badge>
              </div>
            )}

            <CardHeader>
              <div className="space-y-2">
                <CardTitle className="text-lg text-card-foreground">{template.name}</CardTitle>
                <Badge className={getCategoryColor(template.category)}>{template.category.toUpperCase()}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{template.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Sections:</span>
                  <p className="font-medium">{template.sections.length}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Est. Pages:</span>
                  <p className="font-medium">{template.estimatedPages}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Usage:</span>
                  <p className="font-medium">{template.usageCount} times</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Used:</span>
                  <p className="font-medium">{formatDate(template.lastUsed)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Sections:</span>
                <div className="flex flex-wrap gap-1">
                  {template.sections.slice(0, 3).map((section) => (
                    <Badge key={section} variant="outline" className="text-xs">
                      {section}
                    </Badge>
                  ))}
                  {template.sections.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.sections.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="flex items-center gap-1 bg-transparent">
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{template.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm leading-relaxed">{template.description}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Template Sections:</h4>
                        <div className="space-y-2">
                          {template.sections.map((section, index) => (
                            <div key={section} className="flex items-center gap-2 p-2 border rounded">
                              <span className="text-sm font-mono text-muted-foreground">{index + 1}.</span>
                              <span className="text-sm">{section}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Category:</span> {template.category}
                        </div>
                        <div>
                          <span className="font-medium">Estimated Pages:</span> {template.estimatedPages}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button size="sm" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Use Template
                </Button>

                <Button size="sm" variant="outline" className="flex items-center gap-1 bg-transparent">
                  <Copy className="h-4 w-4" />
                  Duplicate
                </Button>

                <Button size="sm" variant="outline" className="flex items-center gap-1 bg-transparent">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground">Template Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">
                {templates.filter((t) => t.category === "incident").length}
              </div>
              <div className="text-sm text-muted-foreground">Incident Reports</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {templates.filter((t) => t.category === "analysis").length}
              </div>
              <div className="text-sm text-muted-foreground">Analysis Reports</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {templates.filter((t) => t.category === "summary").length}
              </div>
              <div className="text-sm text-muted-foreground">Summary Reports</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">
                {templates.filter((t) => t.category === "public").length}
              </div>
              <div className="text-sm text-muted-foreground">Public Reports</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
