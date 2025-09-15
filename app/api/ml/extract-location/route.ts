import { type NextRequest, NextResponse } from "next/server"
import { mlService } from "@/lib/ml-services"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required and must be a string" }, { status: 400 })
    }

    const locations = await mlService.extractLocationFromText(text)

    return NextResponse.json({
      success: true,
      data: locations,
    })
  } catch (error) {
    console.error("[v0] Location extraction error:", error)
    return NextResponse.json({ error: "Failed to extract locations" }, { status: 500 })
  }
}
