import { type NextRequest, NextResponse } from "next/server"
import { io } from "@/app/api/socket/route"

export async function POST(request: NextRequest) {
  try {
    const { type, data, room } = await request.json()

    console.log("[v0] Broadcasting message:", { type, data, room })

    switch (type) {
      case "newReport":
        if (room) {
          io.to(room).emit("newReport", data)
        } else {
          io.emit("newReport", data)
        }
        break
      case "emergencyAlert":
        if (room) {
          io.to(room).emit("emergencyAlert", data)
        } else {
          io.emit("emergencyAlert", data)
        }
        break
      case "systemNotification":
        if (room) {
          io.to(room).emit("systemNotification", data)
        } else {
          io.emit("systemNotification", data)
        }
        break
      case "threatLevelChange":
        if (room) {
          io.to(room).emit("threatLevelChange", data)
        } else {
          io.emit("threatLevelChange", data)
        }
        break
      case "locationUpdate":
        if (room) {
          io.to(room).emit("locationUpdate", data)
        } else {
          io.emit("locationUpdate", data)
        }
        break
      default:
        return NextResponse.json({ error: "Invalid broadcast type" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Broadcast sent successfully",
      type,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Broadcast error:", error)
    return NextResponse.json({ error: "Failed to send broadcast" }, { status: 500 })
  }
}
