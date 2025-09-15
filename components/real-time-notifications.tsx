"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, AlertTriangle, Activity, Settings, Trash2, CheckCheck } from "lucide-react"
import { useRealTimeNotifications } from "@/lib/hooks/use-real-time-notifications"

export function RealTimeNotifications() {
  const { notifications, unreadCount, isConnected, markAsRead, markAllAsRead, clearNotifications } =
    useRealTimeNotifications()
  const [isOpen, setIsOpen] = useState(false)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "report":
        return <Activity className="h-4 w-4 text-blue-500" />
      case "system":
        return <Settings className="h-4 w-4 text-purple-500" />
      case "threat":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      default:
        return <Bell className="h-4 w-4 text-slate-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <h3 className="font-semibold text-slate-900">Notifications</h3>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-red-500"}`}></div>
            <span className="text-xs text-slate-500">{isConnected ? "Live" : "Offline"}</span>
          </div>
        </div>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="flex items-center justify-between p-2">
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
              <Button variant="ghost" size="sm" onClick={clearNotifications} className="text-xs text-red-600">
                <Trash2 className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            </div>
          </>
        )}

        <DropdownMenuSeparator />

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-slate-500">
              <Bell className="h-8 w-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.slice(0, 10).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="p-0 focus:bg-slate-50"
                onClick={() => markAsRead(notification.id)}
              >
                <div className="w-full p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getNotificationIcon(notification.type)}
                      <span className="font-medium text-sm text-slate-900">{notification.title}</span>
                    </div>
                    <Badge className={`text-xs ${getSeverityColor(notification.severity)}`}>
                      {notification.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{notification.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{formatTimestamp(notification.timestamp)}</span>
                    {!(notification as any).read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>

        {notifications.length > 10 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                View all notifications ({notifications.length})
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
