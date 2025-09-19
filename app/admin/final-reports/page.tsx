import { FinalReportsCompiler } from "@/components/admin/final-reports/final-reports-compiler"
import { ReportsLibrary } from "@/components/admin/final-reports/reports-library"
import { ReportTemplates } from "@/components/admin/final-reports/report-templates"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Archive, BookTemplate as Template, TrendingUp } from "lucide-react"

export default function FinalReportsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Final Reports Compilation</h1>
          <p className="text-muted-foreground">
            Compile comprehensive incident reports from ML analysis, verification, and response actions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Archive className="h-3 w-3" />
            156 Reports Archived
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Reports</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">8</div>
            <p className="text-xs text-muted-foreground">Awaiting compilation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Template className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">5</div>
            <p className="text-xs text-muted-foreground">Pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Archive className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">143</div>
            <p className="text-xs text-muted-foreground">Completed reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">23</div>
            <p className="text-xs text-muted-foreground">Reports generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <Tabs defaultValue="compiler" className="space-y-4">
        <TabsList>
          <TabsTrigger value="compiler">Report Compiler</TabsTrigger>
          <TabsTrigger value="library">Reports Library</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="compiler" className="space-y-4">
          <FinalReportsCompiler />
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <ReportsLibrary />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <ReportTemplates />
        </TabsContent>
      </Tabs>
    </div>
  )
}
