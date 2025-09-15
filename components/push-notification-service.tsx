"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, XCircle, Clock, Smartphone } from "lucide-react"

interface PushNotification {
  id: string
  title: string
  body: string
  icon?: string
  badge?: string
  timestamp: string
  priority: "low" | "normal" | "high" | "urgent"
  category: string
  delivered: boolean
  clicked: boolean
}

export function PushNotificationService() {
  const [notifications, setNotifications] = useState<PushNotification[]>([])
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if push notifications are supported
    setIsSupported("Notification" in window && "serviceWorker" in navigator)

    if ("Notification" in window) {
      setPermission(Notification.permission)
    }

    // Register service worker for push notifications
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.log("[v0] Service worker registration failed:", error)
      })
    }
  }, [])

  const requestPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setPermission(permission)
      return permission === "granted"
    }
    return false
  }

  const sendPushNotification = async (
    notification: Omit<PushNotification, "id" | "timestamp" | "delivered" | "clicked">,
  ) => {
    if (permission !== "granted") {
      const granted = await requestPermission()
      if (!granted) return false
    }

    try {
      const notificationOptions: NotificationOptions = {
        body: notification.body,
        icon: notification.icon || "/atlas-alert-icon.png",
        badge: notification.badge || "/atlas-alert-badge.png",
        tag: notification.category,
        requireInteraction: notification.priority === "urgent",
        silent: notification.priority === "low",
        vibrate: notification.priority === "urgent" ? [200, 100, 200] : [100],
        data: {
          category: notification.category,
          priority: notification.priority,
          timestamp: new Date().toISOString(),
        },
      }

      const browserNotification = new Notification(notification.title, notificationOptions)

      const newNotification: PushNotification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        delivered: true,
        clicked: false,
      }

      browserNotification.onclick = () => {
        setNotifications((prev) => prev.map((n) => (n.id === newNotification.id ? { ...n, clicked: true } : n)))
        browserNotification.close()
      }

      setNotifications((prev) => [newNotification, ...prev.slice(0, 49)])
      return true
    } catch (error) {
      console.error("[v0] Push notification failed:", error)
      return false
    }
  }

  const sendEmergencyAlert = () => {
    sendPushNotification({
      title: "🚨 EMERGENCY ALERT",
      body: "High waves detected at Mumbai Coast. Avoid swimming immediately!",
      priority: "urgent",
      category: "emergency",
    })
  }

  const sendWeatherUpdate = () => {
    sendPushNotification({
      title: "Weather Update",
      body: "Storm conditions expected in coastal areas. Stay alert.",
      priority: "high",
      category: "weather",
    })
  }

  const sendSafetyTip = () => {
    sendPushNotification({
      title: "Ocean Safety Tip",
      body: "Always swim in designated areas with lifeguard supervision.",
      priority: "normal",
      category: "safety",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "normal":
        return "bg-blue-100 text-blue-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (notification: PushNotification) => {
    if (notification.clicked) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (notification.delivered) return <Clock className="h-4 w-4 text-blue-600" />
    return <XCircle className="h-4 w-4 text-red-600" />
  }

  return (
    <div className="space-y-6">
      {/* Permission Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Push Notification Service</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Status: {isSupported ? "Supported" : "Not Supported"}</span>
              <Badge variant={permission === "granted" ? "default" : "secondary"}>
                {permission === "granted" ? "Enabled" : permission === "denied" ? "Blocked" : "Pending"}
              </Badge>
            </div>
            {permission !== "granted" && (
              <Button onClick={requestPermission} size="sm">
                Enable Notifications
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Test Push Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={sendEmergencyAlert} variant="destructive" disabled={permission !== "granted"}>
              Send Emergency Alert
            </Button>
            <Button onClick={sendWeatherUpdate} variant="default" disabled={permission !== "granted"}>
              Send Weather Update
            </Button>
            <Button onClick={sendSafetyTip} variant="outline" disabled={permission !== "granted"}>
              Send Safety Tip
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification History */}
      <Card>
        <CardHeader>
          <CardTitle>Notification History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No notifications sent yet</p>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  {getStatusIcon(notification)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <Badge className={getPriorityColor(notification.priority)}>{notification.priority}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.body}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{new Date(notification.timestamp).toLocaleString()}</span>
                      <span>Category: {notification.category}</span>
                      <span>{notification.clicked ? "Clicked" : "Delivered"}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Push Notification Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{notifications.length}</div>
              <div className="text-sm text-blue-700">Total Sent</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{notifications.filter((n) => n.delivered).length}</div>
              <div className="text-sm text-green-700">Delivered</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{notifications.filter((n) => n.clicked).length}</div>
              <div className="text-sm text-purple-700">Clicked</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">
                {notifications.length > 0
                  ? Math.round((notifications.filter((n) => n.clicked).length / notifications.length) * 100)
                  : 0}
                %
              </div>
              <div className="text-sm text-amber-700">Click Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
