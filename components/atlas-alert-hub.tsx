"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Waves,
  Shield,
  BarChart3,
  MessageSquare,
  Bell,
  Brain,
  MapPin,
  Activity,
  Smartphone,
  AlertTriangle,
  TrendingUp,
  Database,
  Zap,
  Map,
  Phone,
} from "lucide-react"
import Link from "next/link"

export function AtlasAlertHub() {
  const [systemStats] = useState({
    totalReports: 15847,
    activeIncidents: 23,
    usersOnline: 1247,
    mlAccuracy: 94.2,
    responseTime: 1.2,
    uptime: 99.8,
  })

  const dashboards = [
    {
      title: "Citizen Dashboard",
      description: "Mobile-first hazard reporting for citizens",
      icon: Smartphone,
      href: "/citizen",
      color: "bg-emerald-600",
      features: ["Real-time reporting", "Location tracking", "Emergency contacts", "Safety status"],
    },
    {
      title: "Analyst Dashboard",
      description: "Social media monitoring and threat analysis",
      icon: BarChart3,
      href: "/analyst",
      color: "bg-blue-600",
      features: ["Social media feeds", "ML analysis", "Threat mapping", "Analytics charts"],
    },
    {
      title: "Admin Control Center",
      description: "System administration and emergency broadcasting",
      icon: Shield,
      href: "/admin",
      color: "bg-purple-600",
      features: ["User management", "SMS broadcasting", "System monitoring", "Alert management"],
    },
    {
      title: "Notification Center",
      description: "Push notification and SMS management",
      icon: Bell,
      href: "/notifications",
      color: "bg-orange-600",
      features: ["Push notifications", "SMS delivery", "Engagement tracking", "Test alerts"],
    },
    {
      title: "Live Interactive Map",
      description: "Real-time citizen locations and danger zones",
      icon: Map,
      href: "/live-map",
      color: "bg-red-600",
      features: ["Live location dots", "Resizable danger zones", "Real-time updates", "Interactive pinning"],
    },
    {
      title: "Emergency Report Form",
      description: "Quick emergency reporting with location pinning",
      icon: Phone,
      href: "/emergency-report",
      color: "bg-red-700",
      features: ["Quick report buttons", "Location pinning", "Media upload", "Emergency contacts"],
    },
  ]

  const features = [
    {
      title: "AI-Powered Analysis",
      description: "Machine learning for hazard classification and sentiment analysis",
      icon: Brain,
      stats: `${systemStats.mlAccuracy}% accuracy`,
    },
    {
      title: "Real-time Monitoring",
      description: "Live social media feeds with hashtag tracking (#OceanRanger, #BlueWatch)",
      icon: Activity,
      stats: "Live updates",
    },
    {
      title: "SMS Broadcasting",
      description: "Priority-based emergency SMS with location targeting",
      icon: MessageSquare,
      stats: "Multi-provider",
    },
    {
      title: "Geographic Intelligence",
      description: "Spatial mapping with PostGIS and hotspot detection",
      icon: MapPin,
      stats: "Location-aware",
    },
    {
      title: "Urgency Scoring",
      description: "Advanced algorithms considering multiple threat factors",
      icon: TrendingUp,
      stats: "Smart prioritization",
    },
    {
      title: "System Integration",
      description: "WebSocket real-time updates and comprehensive APIs",
      icon: Database,
      stats: `${systemStats.responseTime}s response`,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Waves className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl sm:text-6xl font-bold">Atlas-Alert</h1>
                <p className="text-xl text-emerald-100">Ocean Hazard Reporting Platform</p>
              </div>
            </div>

            <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              AI-powered real-time ocean safety monitoring with crowdsourced reporting, social media intelligence, and
              emergency broadcasting capabilities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold">{systemStats.totalReports.toLocaleString()}</div>
                <div className="text-emerald-100">Total Reports</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{systemStats.activeIncidents}</div>
                <div className="text-emerald-100">Active Incidents</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{systemStats.uptime}%</div>
                <div className="text-emerald-100">System Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* System Status */}
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-6 h-6 text-emerald-600" />
              <span>System Status</span>
              <Badge className="bg-green-100 text-green-800 ml-auto">All Systems Operational</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="font-semibold">ML Pipeline</div>
                  <div className="text-sm text-gray-600">{systemStats.mlAccuracy}% accuracy</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="font-semibold">Real-time Feeds</div>
                  <div className="text-sm text-gray-600">Live monitoring</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="font-semibold">SMS Service</div>
                  <div className="text-sm text-gray-600">Multi-provider</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="font-semibold">WebSocket</div>
                  <div className="text-sm text-gray-600">{systemStats.usersOnline} connected</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboards */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Platform Dashboards</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Access specialized interfaces designed for different user roles and use cases
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dashboards.map((dashboard) => {
              const IconComponent = dashboard.icon
              return (
                <Card
                  key={dashboard.title}
                  className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-emerald-200"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 ${dashboard.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{dashboard.title}</CardTitle>
                        <CardDescription className="text-base">{dashboard.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {dashboard.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Link href={dashboard.href}>
                      <Button className="w-full group-hover:bg-emerald-600 transition-colors">Access Dashboard</Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Features */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Platform Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive ocean safety monitoring with advanced AI and real-time capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const IconComponent = feature.icon
              return (
                <Card key={feature.title} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                        <Badge variant="secondary" className="text-xs">
                          {feature.stats}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Emergency Alert */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">Emergency Response Ready</h3>
                  <p className="text-red-700">Atlas-Alert is monitoring ocean conditions 24/7 for your safety</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-700 font-medium">Live Monitoring</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Specifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-6 h-6 text-blue-600" />
              <span>Technical Capabilities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">AI & ML</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Groq & Grok integration</li>
                  <li>• Sentiment analysis</li>
                  <li>• Threat classification</li>
                  <li>• Urgency scoring</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Real-time</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• WebSocket connections</li>
                  <li>• Live location tracking</li>
                  <li>• Social media streams</li>
                  <li>• Push notifications</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Communication</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• SMS broadcasting</li>
                  <li>• Multi-provider routing</li>
                  <li>• Priority-based delivery</li>
                  <li>• Location targeting</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Analytics</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Comprehensive dashboards</li>
                  <li>• Performance metrics</li>
                  <li>• Trend analysis</li>
                  <li>• System monitoring</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
