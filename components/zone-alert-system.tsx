"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Shield, Navigation, Bell, BellOff, MapPin, Clock } from "lucide-react"
import { generateZoneAlert, shouldSendNotification, type Coordinates, type Zone } from "@/lib/utils/zone-detection"

interface ZoneAlertSystemProps {
  userLocation: Coordinates | null
  dangerZones: Zone[]
  safeZones: Zone[]
  enableNotifications?: boolean
  onNavigateToSafeZone?: (zone: Zone) => void
}

export function ZoneAlertSystem({
  userLocation,
  dangerZones,
  safeZones,
  enableNotifications = true,
  onNavigateToSafeZone,
}: ZoneAlertSystemProps) {
  const [currentAlert, setCurrentAlert] = useState<{
    type: "danger" | "safe" | "warning" | "clear"
    message: string
    nearestSafeZone?: { zone: Zone; distance: number }
  } | null>(null)
  const [previousAlert, setPreviousAlert] = useState<string | null>(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(enableNotifications)
  const [alertHistory, setAlertHistory] = useState<
    Array<{
      timestamp: string
      type: string
      message: string
    }>
  >([])

  // Check zone status when user location changes
  useEffect(() => {
    if (!userLocation) {
      setCurrentAlert(null)
      return
    }

    const alert = generateZoneAlert(userLocation, dangerZones, safeZones)

    // Check if we should send a notification
    if (notificationsEnabled && shouldSendNotification(previousAlert, alert)) {
      // Request notification permission if not granted
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission()
      }

      // Send browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Atlas-Alert Zone Update", {
          body: alert.message.replace(/[⚠️✅]/g, "").trim(),
          icon: "/favicon.ico",
          tag: "zone-alert",
        })
      }

      // Add to alert history
      setAlertHistory((prev) => [
        {
          timestamp: new Date().toISOString(),
          type: alert.type,
          message: alert.message,
        },
        ...prev.slice(0, 9), // Keep last 10 alerts
      ])
    }

    setPreviousAlert(alert.message)
    setCurrentAlert(alert)
  }, [userLocation, dangerZones, safeZones, notificationsEnabled, previousAlert])

  const getAlertColor = (type: string) => {
    switch (type) {
      case "danger":
        return "border-red-500 bg-red-50 text-red-900"
      case "warning":
        return "border-orange-500 bg-orange-50 text-orange-900"
      case "safe":
        return "border-green-500 bg-green-50 text-green-900"
      default:
        return "border-blue-500 bg-blue-50 text-blue-900"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "danger":
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "safe":
        return <Shield className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  if (!userLocation) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center text-slate-500">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">Enable location to receive zone alerts</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Current Alert */}
      {currentAlert && (
        <Alert className={getAlertColor(currentAlert.type)}>
          <div className="flex items-start gap-3">
            {getAlertIcon(currentAlert.type)}
            <div className="flex-1 space-y-2">
              <AlertDescription className="text-sm font-medium">{currentAlert.message}</AlertDescription>

              {/* Action Buttons */}
              {currentAlert.nearestSafeZone && (currentAlert.type === "danger" || currentAlert.type === "warning") && (
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onNavigateToSafeZone?.(currentAlert.nearestSafeZone!.zone)}
                    className="text-xs bg-white"
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    Navigate to Safety
                  </Button>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(currentAlert.nearestSafeZone.distance)}m away
                  </Badge>
                </div>
              )}
            </div>

            {/* Notification Toggle */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className="p-1"
            >
              {notificationsEnabled ? (
                <Bell className="h-4 w-4 text-blue-600" />
              ) : (
                <BellOff className="h-4 w-4 text-slate-400" />
              )}
            </Button>
          </div>
        </Alert>
      )}

      {/* Zone Status Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Zone Status Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Danger Zones Nearby:</span>
              <div className="font-medium text-red-600">{dangerZones.length}</div>
            </div>
            <div>
              <span className="text-slate-600">Safe Zones Available:</span>
              <div className="font-medium text-green-600">{safeZones.length}</div>
            </div>
          </div>

          {currentAlert?.nearestSafeZone && (
            <div className="p-2 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-600">Nearest Safe Zone:</div>
              <div className="font-medium text-sm">{currentAlert.nearestSafeZone.zone.name}</div>
              <div className="text-xs text-slate-500">{Math.round(currentAlert.nearestSafeZone.distance)}m away</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert History */}
      {alertHistory.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {alertHistory.map((alert, index) => (
                <div key={index} className="flex items-start gap-2 p-2 border rounded-lg">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      alert.type === "danger"
                        ? "bg-red-500"
                        : alert.type === "warning"
                          ? "bg-orange-500"
                          : alert.type === "safe"
                            ? "bg-green-500"
                            : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-900 truncate">{alert.message.replace(/[⚠️✅]/g, "").trim()}</div>
                    <div className="text-xs text-slate-500">{new Date(alert.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
