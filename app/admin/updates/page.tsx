import { DeploymentUpdatesCenter } from "@/components/admin/deployment/deployment-updates-center"
import { DeploymentMap } from "@/components/admin/deployment/deployment-map"
import { UpdatesTimeline } from "@/components/admin/deployment/updates-timeline"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, Users, AlertTriangle } from "lucide-react"

export default function DeploymentUpdatesPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Deployment Updates</h1>
          <p className="text-muted-foreground">Real-time tracking of field operations and team status</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Updates
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deployments</CardTitle>
            <MapPin className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">8</div>
            <p className="text-xs text-muted-foreground">Teams in field</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Route</CardTitle>
            <Clock className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">3</div>
            <p className="text-xs text-muted-foreground">Teams dispatched</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personnel</CardTitle>
            <Users className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">47</div>
            <p className="text-xs text-muted-foreground">Total deployed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Updates</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">2</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="center" className="space-y-4">
        <TabsList>
          <TabsTrigger value="center">Operations Center</TabsTrigger>
          <TabsTrigger value="map">Deployment Map</TabsTrigger>
          <TabsTrigger value="timeline">Updates Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="center" className="space-y-4">
          <DeploymentUpdatesCenter />
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <DeploymentMap />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <UpdatesTimeline />
        </TabsContent>
      </Tabs>
    </div>
  )
}
