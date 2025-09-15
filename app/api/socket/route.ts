import type { NextRequest } from "next/server"

export const io = {
  emit: (event: string, data: any) => {
    console.log("[v0] Mock WebSocket emit:", event, data)
    // In development, we just log the events
    // In production, this would be a real Socket.IO server instance
  },
  to: (room: string) => ({
    emit: (event: string, data: any) => {
      console.log("[v0] Mock WebSocket emit to room:", room, event, data)
    },
  }),
}

export async function GET(req: NextRequest) {
  console.log("[v0] WebSocket API endpoint accessed")

  return new Response(
    JSON.stringify({
      status: "WebSocket service available",
      timestamp: new Date().toISOString(),
      message: "Using mock WebSocket implementation for development",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("[v0] WebSocket message received:", body)

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message processed",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to process message",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
