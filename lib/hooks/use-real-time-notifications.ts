"use client"

import { useEffect, useState } from "react"
import { useWebSocket } from "./use-websocket"
import { toast } from "@/hooks/use-toast"

interface Notification {
  id: string
  type: "report" | "alert" | "system" | "threat"
  title: string
  message: string
  severity: "low" | "medium" | "high" | "critical"
  timestamp: string
  data?: any
}

export function useRealTimeNotifications() {
  const { socket, isConnected } = useWebSocket()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!socket) return

    // Handle new reports
    socket.on("newReport", (report) => {
      const notification: Notification = {
        id: `report_${Date.now()}`,
        type: "report",
        title: "New Hazard Report",
        message: `${report.type} reported in ${report.location}`,
        severity: report.severity || "medium",
        timestamp: new Date().toISOString(),
        data: report,
      }

      setNotifications((prev) => [notification, ...prev.slice(0, 49)]) // Keep last 50
      setUnreadCount((prev) => prev + 1)

      // Show toast for high severity reports
      if (report.severity === "high" || report.severity === "critical") {
        toast({
          title: "🚨 New High Priority Report",
          description: `${report.type} in ${report.location}`,
          variant: "destructive",
        })
      }
    })

    // Handle emergency alerts
    socket.on("emergencyAlert", (alert) => {
      const notification: Notification = {
        id: `alert_${Date.now()}`,
        type: "alert",
        title: "Emergency Alert",
        message: alert.title || alert.message,
        severity: "critical",
        timestamp: new Date().toISOString(),
        data: alert,
      }

      setNotifications((prev) => [notification, ...prev.slice(0, 49)])
      setUnreadCount((prev) => prev + 1)

      // Always show toast for emergency alerts
      toast({
        title: "🚨 EMERGENCY ALERT",
        description: alert.title || alert.message,
        variant: "destructive",
      })

      // Request notification permission and show browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Atlas-Alert Emergency", {
          body: alert.title || alert.message,
          icon: "/favicon.ico",
          tag: "emergency-alert",
        })
      }
    })

    // Handle system notifications
    socket.on("systemNotification", (notification) => {
      const notif: Notification = {
        id: `system_${Date.now()}`,
        type: "system",
        title: "System Notification",
        message: notification.message,
        severity: notification.severity || "low",
        timestamp: new Date().toISOString(),
        data: notification,
      }

      setNotifications((prev) => [notif, ...prev.slice(0, 49)])
      setUnreadCount((prev) => prev + 1)
    })

    // Handle threat level changes
    socket.on("threatLevelChange", (threat) => {
      const notification: Notification = {
        id: `threat_${Date.now()}`,
        type: "threat",
        title: "Threat Level Update",
        message: `Threat level changed to ${threat.level} in ${threat.area}`,
        severity: threat.level === "critical" ? "critical" : "medium",
        timestamp: new Date().toISOString(),
        data: threat,
      }

      setNotifications((prev) => [notification, ...prev.slice(0, 49)])
      setUnreadCount((prev) => prev + 1)

      if (threat.level === "critical") {
        toast({
          title: "⚠️ Threat Level Critical",
          description: `${threat.area} - Take immediate precautions`,
          variant: "destructive",
        })
      }
    })

    return () => {
      socket.off("newReport")
      socket.off("emergencyAlert")
      socket.off("systemNotification")
      socket.off("threatLevelChange")
    }
  }, [socket])

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
    setUnreadCount(0)
  }

  const clearNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  // Request notification permission on first use
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  }
}
