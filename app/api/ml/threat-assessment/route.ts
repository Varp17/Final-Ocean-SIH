import { type NextRequest, NextResponse } from "next/server"
import { mlService } from "@/lib/ml-services"

export async function POST(request: NextRequest) {
  try {
    const { reports } = await request.json()

    if (!Array.isArray(reports) || reports.length === 0) {
      return NextResponse.json({ error: "Reports array is required and must not be empty" }, { status: 400 })
    }

    const assessment = await mlService.generateThreatAssessment(reports)

    return NextResponse.json({
      success: true,
      data: assessment,
    })
  } catch (error) {
    console.error("[v0] Threat assessment error:", error)
    return NextResponse.json({ error: "Failed to generate threat assessment" }, { status: 500 })
  }
}
