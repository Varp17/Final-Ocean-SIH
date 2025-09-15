import { type NextRequest, NextResponse } from "next/server"
import { mlService } from "@/lib/ml-services"

export async function POST(request: NextRequest) {
  try {
    const { text, metadata } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required and must be a string" }, { status: 400 })
    }

    const analysis = await mlService.analyzeSocialMediaPost(text, metadata)

    return NextResponse.json({
      success: true,
      data: analysis,
    })
  } catch (error) {
    console.error("[v0] Social media analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze social media post" }, { status: 500 })
  }
}
