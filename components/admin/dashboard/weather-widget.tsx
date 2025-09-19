"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Cloud, Sun, CloudRain, Wind } from "lucide-react"
import { useEffect, useState } from "react"

interface WeatherData {
  temperature: number
  condition: string
  windSpeed: number
  humidity: number
  location: string
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    condition: "Partly Cloudy",
    windSpeed: 15,
    humidity: 72,
    location: "Mumbai Coast",
  })

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="h-5 w-5 text-yellow-500" />
      case "rainy":
        return <CloudRain className="h-5 w-5 text-blue-500" />
      default:
        return <Cloud className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <Card className="w-80">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-card-foreground">{currentTime.toLocaleTimeString()}</div>
            <div className="text-sm text-muted-foreground">{currentTime.toLocaleDateString()}</div>
            <div className="text-xs text-muted-foreground mt-1">{weather.location}</div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              {getWeatherIcon(weather.condition)}
              <span className="text-lg font-semibold text-card-foreground">{weather.temperature}°C</span>
            </div>
            <div className="text-xs text-muted-foreground">{weather.condition}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Wind className="h-3 w-3" />
              <span>{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
