import { AuditLogs } from "@/components/admin/audit-logs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function AdminAuditPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
          <p className="text-slate-600">System activity tracking and security monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>System Activity Log</CardTitle>
              <CardDescription>Real-time tracking of user actions and system events</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search logs..." className="pl-9 w-64" />
              </div>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                Live
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AuditLogs limit={20} />
        </CardContent>
      </Card>
    </div>
  )
}
