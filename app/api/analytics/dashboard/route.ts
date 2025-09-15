import { type NextRequest, NextResponse } from "next/server"

interface AnalyticsDashboard {
  overview: {
    totalReports: number
    activeIncidents: number
    resolvedIncidents: number
    avgResponseTime: number
    systemUptime: number
  }
  realTimeMetrics: {
    reportsLastHour: number
    socialMediaMentions: number
    emergencyAlerts: number
    usersOnline: number
  }
  geographicData: {
    hotspots: Array<{
      location: string
      latitude: number
      longitude: number
      incidentCount: number
      riskLevel: string
    }>
    regionStats: Array<{
      region: string
      reports: number
      resolved: number
      avgSeverity: number
    }>
  }
  trendAnalysis: {
    reportTrends: Array<{
      date: string
      count: number
      severity: string
    }>
    sentimentTrends: Array<{
      date: string
      positive: number
      negative: number
      urgent: number
    }>
    hashtagTrends: Array<{
      hashtag: string
      count: number
      growth: number
    }>
  }
  mlPerformance: {
    classificationAccuracy: number
    sentimentAccuracy: number
    threatDetectionRate: number
    falsePositiveRate: number
    processingLatency: number
  }
  systemHealth: {
    apiResponseTime: number
    databaseConnections: number
    websocketConnections: number
    errorRate: number
    memoryUsage: number
    cpuUsage: number
  }
}

class AnalyticsService {
  static generateMockDashboard(): AnalyticsDashboard {
    const now = new Date()
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    }).reverse()

    return {
      overview: {
        totalReports: 15847,
        activeIncidents: 23,
        resolvedIncidents: 15824,
        avgResponseTime: 8.5, // minutes
        systemUptime: 99.97,
      },
      realTimeMetrics: {
        reportsLastHour: Math.floor(Math.random() * 15) + 5,
        socialMediaMentions: Math.floor(Math.random() * 200) + 100,
        emergencyAlerts: Math.floor(Math.random() * 5),
        usersOnline: Math.floor(Math.random() * 500) + 200,
      },
      geographicData: {
        hotspots: [
          { location: "Mumbai Coast", latitude: 19.076, longitude: 72.8777, incidentCount: 45, riskLevel: "high" },
          { location: "Chennai Marina", latitude: 13.0827, longitude: 80.2707, incidentCount: 32, riskLevel: "medium" },
          { location: "Goa Beaches", latitude: 15.2993, longitude: 74.124, incidentCount: 28, riskLevel: "medium" },
          { location: "Kochi Harbor", latitude: 9.9312, longitude: 76.2673, incidentCount: 19, riskLevel: "low" },
          { location: "Vizag Port", latitude: 17.6868, longitude: 83.2185, incidentCount: 15, riskLevel: "low" },
        ],
        regionStats: [
          { region: "West Coast", reports: 234, resolved: 221, avgSeverity: 2.3 },
          { region: "East Coast", reports: 189, resolved: 178, avgSeverity: 2.1 },
          { region: "South Coast", reports: 156, resolved: 149, avgSeverity: 1.9 },
          { region: "Island Territories", reports: 67, resolved: 64, avgSeverity: 2.5 },
        ],
      },
      trendAnalysis: {
        reportTrends: last7Days.map((date) => ({
          date,
          count: Math.floor(Math.random() * 50) + 20,
          severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)],
        })),
        sentimentTrends: last7Days.map((date) => ({
          date,
          positive: Math.floor(Math.random() * 30) + 10,
          negative: Math.floor(Math.random() * 20) + 5,
          urgent: Math.floor(Math.random() * 15) + 2,
        })),
        hashtagTrends: [
          { hashtag: "#OceanRanger", count: 1247, growth: 23.5 },
          { hashtag: "#BlueWatch", count: 892, growth: 15.2 },
          { hashtag: "#CoastalAlert", count: 634, growth: 45.8 },
          { hashtag: "#MarineSafety", count: 423, growth: 8.9 },
          { hashtag: "#TsunamiWatch", count: 312, growth: 67.3 },
        ],
      },
      mlPerformance: {
        classificationAccuracy: 94.2 + Math.random() * 2,
        sentimentAccuracy: 91.8 + Math.random() * 3,
        threatDetectionRate: 96.5 + Math.random() * 2,
        falsePositiveRate: 2.1 + Math.random() * 1,
        processingLatency: 150 + Math.random() * 50, // milliseconds
      },
      systemHealth: {
        apiResponseTime: 120 + Math.random() * 30,
        databaseConnections: 45 + Math.floor(Math.random() * 10),
        websocketConnections: 234 + Math.floor(Math.random() * 50),
        errorRate: 0.1 + Math.random() * 0.2,
        memoryUsage: 65 + Math.random() * 15,
        cpuUsage: 35 + Math.random() * 20,
      },
    }
  }

  static async getHistoricalData(days = 30): Promise<any> {
    // Simulate historical data retrieval
    const data = []
    const now = new Date()

    for (let i = days; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      data.push({
        date: date.toISOString().split("T")[0],
        reports: Math.floor(Math.random() * 100) + 20,
        incidents: Math.floor(Math.random() * 10) + 1,
        responseTime: 5 + Math.random() * 10,
        socialMentions: Math.floor(Math.random() * 500) + 100,
        sentimentScore: Math.random() * 100,
      })
    }

    return data
  }

  static async getSystemMetrics(): Promise<any> {
    return {
      timestamp: new Date().toISOString(),
      services: {
        "ml-classifier": { status: "healthy", responseTime: 145, uptime: 99.9 },
        "social-monitor": { status: "healthy", responseTime: 89, uptime: 99.8 },
        "sms-service": { status: "healthy", responseTime: 234, uptime: 99.7 },
        "websocket-server": { status: "healthy", responseTime: 12, uptime: 99.9 },
        database: { status: "healthy", responseTime: 23, uptime: 99.95 },
      },
      resources: {
        cpu: 35 + Math.random() * 20,
        memory: 65 + Math.random() * 15,
        disk: 45 + Math.random() * 10,
        network: 25 + Math.random() * 30,
      },
      performance: {
        requestsPerSecond: 150 + Math.random() * 50,
        avgResponseTime: 120 + Math.random() * 30,
        errorRate: Math.random() * 0.5,
        throughput: 2.5 + Math.random() * 1.5,
      },
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "dashboard"
    const days = Number.parseInt(searchParams.get("days") || "7")

    switch (type) {
      case "dashboard":
        const dashboard = AnalyticsService.generateMockDashboard()
        return NextResponse.json(dashboard)

      case "historical":
        const historical = await AnalyticsService.getHistoricalData(days)
        return NextResponse.json({ data: historical })

      case "metrics":
        const metrics = await AnalyticsService.getSystemMetrics()
        return NextResponse.json(metrics)

      default:
        return NextResponse.json({ error: "Invalid analytics type" }, { status: 400 })
    }
  } catch (error) {
    console.error("[Analytics] Error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, data } = body

    // Log analytics event
    console.log(`[Analytics Event] ${event}:`, data)

    // In a real implementation, this would store the event in a database
    // for later analysis and reporting

    return NextResponse.json({
      success: true,
      message: "Analytics event recorded",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Analytics] Event logging error:", error)
    return NextResponse.json({ error: "Failed to log analytics event" }, { status: 500 })
  }
}
