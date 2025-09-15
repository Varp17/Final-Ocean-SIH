"use client"

import { useEffect, useState, useCallback } from "react"

interface WebSocketMessage {
  type: string
  data: any
  timestamp: string
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [messages, setMessages] = useState<WebSocketMessage[]>([])

  useEffect(() => {
    console.log("[v0] Initializing mock WebSocket connection...")

    // Simulate connection after a short delay
    const connectTimer = setTimeout(() => {
      setIsConnected(true)
      setConnectionError(null)
      console.log("[v0] Mock WebSocket connected successfully")
    }, 1000)

    // Simulate periodic messages
    const messageInterval = setInterval(() => {
      if (isConnected) {
        const mockMessage: WebSocketMessage = {
          type: "location_update",
          data: {
            citizenId: `citizen-${Date.now()}`,
            lat: 19.076 + (Math.random() - 0.5) * 0.1,
            lng: 72.8777 + (Math.random() - 0.5) * 0.1,
            status: Math.random() > 0.7 ? "danger" : "safe",
          },
          timestamp: new Date().toISOString(),
        }

        setMessages((prev) => [...prev.slice(-50), mockMessage])
      }
    }, 3000)

    return () => {
      clearTimeout(connectTimer)
      clearInterval(messageInterval)
      setIsConnected(false)
    }
  }, [isConnected])

  const sendMessage = useCallback(
    (message: { type: string; data: any }) => {
      if (isConnected) {
        console.log("[v0] Sending message:", message)
        // In a real implementation, this would send to the WebSocket server
        return true
      }
      return false
    },
    [isConnected],
  )

  const joinRoom = useCallback(
    (room: string) => {
      console.log("[v0] Joining room:", room)
      return sendMessage({ type: "join_room", data: { room } })
    },
    [sendMessage],
  )

  const leaveRoom = useCallback(
    (room: string) => {
      console.log("[v0] Leaving room:", room)
      return sendMessage({ type: "leave_room", data: { room } })
    },
    [sendMessage],
  )

  const sendLocation = useCallback(
    (location: { lat: number; lng: number }) => {
      console.log("[v0] Sending location:", location)
      return sendMessage({ type: "location_update", data: location })
    },
    [sendMessage],
  )

  const reportIncident = useCallback(
    (incident: any) => {
      console.log("[v0] Reporting incident:", incident)
      return sendMessage({ type: "incident_report", data: incident })
    },
    [sendMessage],
  )

  const updateUserStatus = useCallback(
    (status: any) => {
      console.log("[v0] Updating user status:", status)
      return sendMessage({ type: "status_update", data: status })
    },
    [sendMessage],
  )

  return {
    isConnected,
    connectionError,
    messages,
    sendMessage,
    joinRoom,
    leaveRoom,
    sendLocation,
    reportIncident,
    updateUserStatus,
  }
}
