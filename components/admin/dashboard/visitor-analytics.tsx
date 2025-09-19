"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MapPin } from "lucide-react"

interface VisitorData {
  state: string
  count: number
  percentage: number
}

export function VisitorAnalytics() {
  const visitorData: VisitorData[] = [
    { state: "Maharashtra", count: 342, percentage: 28 },
    { state: "Tamil Nadu", count: 298, percentage: 24 },
    { state: "Gujarat", count: 187, percentage: 15 },
    { state: "Karnataka", count: 156, percentage: 13 },
    { state: "Andhra Pradesh", count: 134, percentage: 11 },
    { state: "Others", count: 113, percentage: 9 },
  ]

  const totalVisitors = visitorData.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <MapPin className="h-5 w-5 text-primary" />
          Visitor Analytics (Today)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-card-foreground">{totalVisitors.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Total Visitors</div>
        </div>

        <div className="space-y-3">
          {visitorData.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-card-foreground">{item.state}</span>
                <span className="text-muted-foreground">{item.count}</span>
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
