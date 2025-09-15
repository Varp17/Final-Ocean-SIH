"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Cloud,
  Users,
  BarChart3,
  MessageSquare,
  TrendingUp,
  MapPin,
  Activity,
  Wind,
  Droplets,
} from "lucide-react"

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  condition: string
  location: string
}

interface VisitorData {
  total: number
  stateBreakdown: Array<{
    state: string
    count: number
    percentage: number
  }>
}

interface ReportsData {
  last24h: number
  trend: number
  hourlyData: Array<{
    hour: string
    count: number
  }>
}

interface SocialMediaData {
  last24h: Array<{
    hashtag: string
    count: number
  }>
  last30d: Array<{
    hashtag: string
    count: number
  }>
}

interface SentimentData {
  fear: number
  panic: number
  neutral: number
  positive: number
}

export function RealTimeWidgets() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    humidity: 72,
    windSpeed: 15,
    condition: "Partly Cloudy",
    location: "Mumbai HQ",
  })
  const [visitors, setVisitors] = useState<VisitorData>({
    total: 12847,
    stateBreakdown: [
      { state: "Maharashtra", count: 3421, percentage: 26.6 },
      { state: "Tamil Nadu", count: 2156, percentage: 16.8 },
      { state: "Karnataka", count: 1834, percentage: 14.3 },
      { state: "Gujarat", count: 1523, percentage: 11.9 },
      { state: "Others", count: 3913, percentage: 30.4 },
    ],
  })
  const [reports, setReports] = useState<ReportsData>({
    last24h: 247,
    trend: 23,
    hourlyData: [
      { hour: "00:00", count: 8 },
      { hour: "04:00", count: 12 },
      { hour: "08:00", count: 28 },
      { hour: "12:00", count: 45 },
      { hour: "16:00", count: 52 },
      { hour: "20:00", count: 38 },
    ],
  })
  const [socialMedia, setSocialMedia] = useState<SocialMediaData>({
    last24h: [
      { hashtag: "#TsunamiAlert", count: 1247 },
      { hashtag: "#FloodWarning", count: 892 },
      { hashtag: "#SafetyFirst", count: 634 },
      { hashtag: "#EmergencyResponse", count: 521 },
      { hashtag: "#CoastalSafety", count: 387 },
    ],
    last30d: [
      { hashtag: "#TsunamiAlert", count: 15623 },
      { hashtag: "#FloodWarning", count: 12847 },
      { hashtag: "#SafetyFirst", count: 9234 },
      { hashtag: "#EmergencyResponse", count: 7891 },
      { hashtag: "#CoastalSafety", count: 6543 },
    ],
  })
  const [sentiment, setSentiment] = useState<SentimentData>({
    fear: 35,
    panic: 20,
    neutral: 30,
    positive: 15,
  })
  const [activeIncidents, setActiveIncidents] = useState(8)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update weather data
      setWeather((prev) => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(0, Math.min(100, prev.humidity + (Math.random() - 0.5) * 5)),
        windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 3),
      }))

      // Update visitor count
      setVisitors((prev) => ({
        ...prev,
        total: prev.total + Math.floor(Math.random() * 10),
      }))

      // Update reports
      setReports((prev) => ({
        ...prev,
        last24h: prev.last24h + Math.floor(Math.random() * 3),
      }))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return "☀️"
      case "partly cloudy":
        return "⛅"
      case "cloudy":
        return "☁️"
      case "rainy":
        return "🌧️"
      default:
        return "🌤️"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {/* Real-time Date & Time */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Time (IST)</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-blue-600">{formatTime(currentTime)}</div>
          <p className="text-xs text-muted-foreground mt-1">India Standard Time</p>
        </CardContent>
      </Card>

      {/* Weather Widget */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weather - {weather.location}</CardTitle>
          <Cloud className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{Math.round(weather.temperature)}°C</div>
              <p className="text-xs text-muted-foreground">{weather.condition}</p>
            </div>
            <div className="text-2xl">{getWeatherIcon(weather.condition)}</div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <Droplets className="h-3 w-3" />
              {Math.round(weather.humidity)}%
            </div>
            <div className="flex items-center gap-1">
              <Wind className="h-3 w-3" />
              {Math.round(weather.windSpeed)} km/h
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Website Visitors */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Visitors Today</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{visitors.total.toLocaleString()}</div>
          <div className="mt-2 space-y-1">
            {visitors.stateBreakdown.slice(0, 3).map((state) => (
              <div key={state.state} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{state.state}</span>
                <span className="font-medium">{state.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reports Submitted */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reports (24h)</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reports.last24h}</div>
          <div className="flex items-center text-xs text-green-600 mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />+{reports.trend}% from yesterday
          </div>
          <div className="mt-2">
            <div className="flex justify-between items-end h-8">
              {reports.hourlyData.map((data, index) => (
                <div key={data.hour} className="flex flex-col items-center">
                  <div className="bg-blue-200 w-2 rounded-t" style={{ height: `${(data.count / 60) * 100}%` }} />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Tags */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Hashtags (24h)</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {socialMedia.last24h.slice(0, 3).map((tag, index) => (
              <div key={tag.hashtag} className="flex justify-between items-center">
                <span className="text-xs text-blue-600 font-medium">{tag.hashtag}</span>
                <Badge variant="secondary" className="text-xs">
                  {tag.count.toLocaleString()}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              30d total: {socialMedia.last30d.reduce((sum, tag) => sum + tag.count, 0).toLocaleString()} mentions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Distribution */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sentiment Analysis</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs">Fear</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${sentiment.fear}%` }} />
                </div>
                <span className="text-xs font-medium w-8">{sentiment.fear}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Panic</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${sentiment.panic}%` }} />
                </div>
                <span className="text-xs font-medium w-8">{sentiment.panic}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Neutral</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-500 h-2 rounded-full" style={{ width: `${sentiment.neutral}%` }} />
                </div>
                <span className="text-xs font-medium w-8">{sentiment.neutral}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Positive</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${sentiment.positive}%` }} />
                </div>
                <span className="text-xs font-medium w-8">{sentiment.positive}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Incidents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{activeIncidents}</div>
          <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
          <div className="mt-2 flex gap-1">
            <Badge variant="destructive" className="text-xs">
              High: 3
            </Badge>
            <Badge variant="default" className="text-xs">
              Med: 4
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Low: 1
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
