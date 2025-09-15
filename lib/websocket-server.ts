import type { Server as SocketIOServer } from "socket.io"
import type { NextApiRequest } from "next"
import type { Server as NetServer } from "http"

export interface ServerToClientEvents {
  newReport: (report: any) => void
  reportUpdate: (report: any) => void
  emergencyAlert: (alert: any) => void
  systemNotification: (notification: any) => void
  locationUpdate: (location: any) => void
  threatLevelChange: (threat: any) => void
  userStatusChange: (user: any) => void
}

export interface ClientToServerEvents {
  joinRoom: (room: string) => void
  leaveRoom: (room: string) => void
  sendLocation: (location: any) => void
  reportIncident: (incident: any) => void
  updateUserStatus: (status: any) => void
}

export interface InterServerEvents {
  ping: () => void
}

export interface SocketData {
  userId?: string
  userRole?: string
  location?: {
    lat: number
    lng: number
  }
}

export type NextApiResponseServerIO = NextApiRequest & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
    }
  }
}

// WebSocket event handlers
export class WebSocketManager {
  private io: SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>

  constructor(io: SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {
    this.io = io
    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket) => {
      console.log("[v0] WebSocket client connected:", socket.id)

      // Handle room joining (for location-based updates)
      socket.on("joinRoom", (room: string) => {
        socket.join(room)
        console.log("[v0] Client joined room:", room)
      })

      // Handle room leaving
      socket.on("leaveRoom", (room: string) => {
        socket.leave(room)
        console.log("[v0] Client left room:", room)
      })

      // Handle location updates
      socket.on("sendLocation", (location: any) => {
        socket.data.location = location
        // Broadcast location to relevant rooms (nearby users, authorities)
        this.broadcastLocationUpdate(socket, location)
      })

      // Handle incident reporting
      socket.on("reportIncident", (incident: any) => {
        this.handleIncidentReport(socket, incident)
      })

      // Handle user status updates
      socket.on("updateUserStatus", (status: any) => {
        socket.data.userRole = status.role
        socket.data.userId = status.userId
        this.broadcastUserStatusChange(socket, status)
      })

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("[v0] WebSocket client disconnected:", socket.id)
      })
    })
  }

  // Broadcast new report to all connected clients
  broadcastNewReport(report: any) {
    this.io.emit("newReport", report)

    // Send to location-specific rooms
    if (report.location) {
      const locationRoom = `location_${Math.floor(report.location.lat)}_${Math.floor(report.location.lng)}`
      this.io.to(locationRoom).emit("newReport", report)
    }
  }

  // Broadcast report updates
  broadcastReportUpdate(report: any) {
    this.io.emit("reportUpdate", report)
  }

  // Broadcast emergency alerts
  broadcastEmergencyAlert(alert: any) {
    this.io.emit("emergencyAlert", alert)

    // Send to specific regions if targeted
    if (alert.targetAreas) {
      alert.targetAreas.forEach((area: string) => {
        this.io.to(`area_${area}`).emit("emergencyAlert", alert)
      })
    }
  }

  // Broadcast system notifications
  broadcastSystemNotification(notification: any) {
    this.io.emit("systemNotification", notification)
  }

  // Broadcast threat level changes
  broadcastThreatLevelChange(threat: any) {
    this.io.emit("threatLevelChange", threat)
  }

  private broadcastLocationUpdate(socket: any, location: any) {
    // Broadcast to nearby users and authorities
    const locationRoom = `location_${Math.floor(location.lat)}_${Math.floor(location.lng)}`
    socket.to(locationRoom).emit("locationUpdate", {
      userId: socket.data.userId,
      location,
      timestamp: new Date().toISOString(),
    })
  }

  private handleIncidentReport(socket: any, incident: any) {
    // Process incident and broadcast to relevant parties
    const enrichedIncident = {
      ...incident,
      reporterId: socket.data.userId,
      timestamp: new Date().toISOString(),
      status: "pending",
    }

    this.broadcastNewReport(enrichedIncident)
  }

  private broadcastUserStatusChange(socket: any, status: any) {
    // Broadcast user status changes to administrators
    this.io.to("admin_room").emit("userStatusChange", {
      userId: socket.data.userId,
      status,
      timestamp: new Date().toISOString(),
    })
  }
}
