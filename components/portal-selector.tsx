"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, BarChart3, MapPin, AlertTriangle, TrendingUp, Heart } from "lucide-react"
import Link from "next/link"

export function PortalSelector() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 pt-4 sm:pt-8 px-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4 text-balance">
            🌊 Ocean Hazard Platform
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto text-pretty leading-relaxed">
            Integrated emergency response system with AI-powered hazard detection and real-time coordination
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 px-2 sm:px-0">
          {/* Citizen Portal */}
          <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-emerald-200 hover:scale-[1.02]">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">Citizen Portal</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Report hazards, view alerts, find safe zones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm">Interactive hazard maps</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm">5-step report submission</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm">Real-time safety alerts</span>
                </div>
              </div>
              <Badge variant="secondary" className="w-full justify-center text-xs sm:text-sm">
                PWA Ready
              </Badge>
              <Link href="/citizen" className="block">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-10 sm:h-11 text-sm sm:text-base font-medium">
                  Enter Citizen Portal
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Volunteer Portal */}
          <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-orange-200 hover:scale-[1.02]">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">Volunteer Portal</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Join response efforts, verify reports, help communities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span className="text-sm">Incident assignment system</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span className="text-sm">Report verification workflow</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span className="text-sm">Trust score & achievements</span>
                </div>
              </div>
              <Badge variant="secondary" className="w-full justify-center text-xs sm:text-sm">
                No Login Required
              </Badge>
              <Link href="/volunteer" className="block">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 h-10 sm:h-11 text-sm sm:text-base font-medium">
                  Join as Volunteer
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Portal */}
          <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200 hover:scale-[1.02]">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">Admin Portal</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Manage operations, deploy teams, coordinate response
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm">Team management & tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm">Emergency alert broadcasting</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm">Live operational dashboard</span>
                </div>
              </div>
              <Badge variant="secondary" className="w-full justify-center text-xs sm:text-sm">
                Command Center
              </Badge>
              <Link href="/admin" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-10 sm:h-11 text-sm sm:text-base font-medium">
                  Enter Admin Portal
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Analyst Portal */}
          <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-purple-200 hover:scale-[1.02]">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">Analyst Portal</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                AI insights, trends analysis, predictive modeling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span className="text-sm">Hazard clustering & trends</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span className="text-sm">Social media sentiment analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span className="text-sm">Predictive risk modeling</span>
                </div>
              </div>
              <Badge variant="secondary" className="w-full justify-center text-xs sm:text-sm">
                AI Powered
              </Badge>
              <Link href="/analyst" className="block">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 h-10 sm:h-11 text-sm sm:text-base font-medium">
                  Enter Analyst Portal
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="bg-white/50 backdrop-blur-sm mx-2 sm:mx-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-lg sm:text-xl">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 text-center">
              <div className="p-2 sm:p-3 rounded-lg bg-white/50">
                <div className="text-xl sm:text-2xl font-bold text-emerald-600">1,247</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">Active Citizens</div>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-white/50">
                <div className="text-xl sm:text-2xl font-bold text-orange-600">342</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">Active Volunteers</div>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-white/50">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">23</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">Response Teams</div>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-white/50">
                <div className="text-xl sm:text-2xl font-bold text-orange-600">156</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">Active Reports</div>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-white/50">
                <div className="text-xl sm:text-2xl font-bold text-red-600">7</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">Red Zones</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
