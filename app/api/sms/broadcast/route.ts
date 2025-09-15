import { type NextRequest, NextResponse } from "next/server"

interface SMSBroadcastRequest {
  message: string
  recipients: string[]
  priority: "low" | "medium" | "high" | "critical"
  location?: {
    latitude: number
    longitude: number
    radius: number
  }
  hazardType?: string
}

interface SMSProvider {
  name: string
  send: (to: string, message: string) => Promise<boolean>
}

class SMSBroadcastService {
  private providers: SMSProvider[] = [
    {
      name: "Twilio",
      send: async (to: string, message: string) => {
        // Simulate Twilio SMS sending
        console.log(`[SMS] Twilio sending to ${to}: ${message}`)
        return Math.random() > 0.1 // 90% success rate
      },
    },
    {
      name: "AWS SNS",
      send: async (to: string, message: string) => {
        // Simulate AWS SNS sending
        console.log(`[SMS] AWS SNS sending to ${to}: ${message}`)
        return Math.random() > 0.05 // 95% success rate
      },
    },
    {
      name: "Emergency Alert System",
      send: async (to: string, message: string) => {
        // Simulate Emergency Alert System
        console.log(`[SMS] Emergency Alert System broadcasting: ${message}`)
        return Math.random() > 0.02 // 98% success rate
      },
    },
  ]

  async broadcastSMS(request: SMSBroadcastRequest): Promise<{
    success: boolean
    sent: number
    failed: number
    results: Array<{ recipient: string; success: boolean; provider: string }>
  }> {
    const results: Array<{ recipient: string; success: boolean; provider: string }> = []
    let sent = 0
    let failed = 0

    // Format message based on priority
    const formattedMessage = this.formatMessage(request.message, request.priority, request.hazardType)

    // Send to all recipients
    for (const recipient of request.recipients) {
      // Choose provider based on priority
      const provider = this.selectProvider(request.priority)

      try {
        const success = await provider.send(recipient, formattedMessage)
        results.push({ recipient, success, provider: provider.name })

        if (success) {
          sent++
        } else {
          failed++
          // Retry with backup provider for critical messages
          if (request.priority === "critical") {
            const backupProvider = this.providers.find((p) => p.name !== provider.name)
            if (backupProvider) {
              const retrySuccess = await backupProvider.send(recipient, formattedMessage)
              if (retrySuccess) {
                results[results.length - 1] = { recipient, success: true, provider: backupProvider.name }
                sent++
                failed--
              }
            }
          }
        }
      } catch (error) {
        console.error(`[SMS] Failed to send to ${recipient}:`, error)
        results.push({ recipient, success: false, provider: provider.name })
        failed++
      }

      // Rate limiting delay
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    return {
      success: sent > 0,
      sent,
      failed,
      results,
    }
  }

  private selectProvider(priority: string): SMSProvider {
    switch (priority) {
      case "critical":
        return this.providers[2] // Emergency Alert System
      case "high":
        return this.providers[1] // AWS SNS
      default:
        return this.providers[0] // Twilio
    }
  }

  private formatMessage(message: string, priority: string, hazardType?: string): string {
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })

    let prefix = ""
    switch (priority) {
      case "critical":
        prefix = "🚨 CRITICAL ALERT 🚨\n"
        break
      case "high":
        prefix = "⚠️ HIGH PRIORITY ⚠️\n"
        break
      case "medium":
        prefix = "📢 OCEAN ALERT 📢\n"
        break
      default:
        prefix = "ℹ️ Ocean Safety Update\n"
    }

    const hazardInfo = hazardType ? `\nHazard: ${hazardType}` : ""
    const footer = "\n\nAtlas-Alert Ocean Safety Platform\nStay Safe, Stay Informed"

    return `${prefix}${message}${hazardInfo}\n\nTime: ${timestamp}${footer}`
  }

  async getLocationBasedRecipients(location: { latitude: number; longitude: number; radius: number }): Promise<
    string[]
  > {
    // Simulate fetching recipients based on location
    // In real implementation, this would query a database of registered users within the radius
    const mockRecipients = ["+91-9876543210", "+91-9876543211", "+91-9876543212", "+91-9876543213", "+91-9876543214"]

    // Simulate location-based filtering
    const recipientsInRange = mockRecipients.filter(() => Math.random() > 0.3) // 70% chance to be in range

    return recipientsInRange
  }
}

const smsService = new SMSBroadcastService()

export async function POST(request: NextRequest) {
  try {
    const body: SMSBroadcastRequest = await request.json()

    // Validate request
    if (!body.message || (!body.recipients?.length && !body.location)) {
      return NextResponse.json({ error: "Message and recipients or location are required" }, { status: 400 })
    }

    let recipients = body.recipients || []

    // If location is provided, get recipients in that area
    if (body.location && recipients.length === 0) {
      recipients = await smsService.getLocationBasedRecipients(body.location)
    }

    if (recipients.length === 0) {
      return NextResponse.json({ error: "No recipients found" }, { status: 400 })
    }

    // Broadcast SMS
    const result = await smsService.broadcastSMS({
      ...body,
      recipients,
    })

    // Log broadcast for audit
    console.log(`[SMS Broadcast] Priority: ${body.priority}, Sent: ${result.sent}, Failed: ${result.failed}`)

    return NextResponse.json({
      success: true,
      message: "SMS broadcast completed",
      ...result,
    })
  } catch (error) {
    console.error("[SMS Broadcast] Error:", error)
    return NextResponse.json({ error: "Failed to broadcast SMS" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "SMS Broadcast Service",
    endpoints: {
      POST: "/api/sms/broadcast - Broadcast SMS to recipients",
    },
    providers: ["Twilio", "AWS SNS", "Emergency Alert System"],
    features: [
      "Priority-based routing",
      "Location-based targeting",
      "Automatic retry for critical messages",
      "Rate limiting",
      "Audit logging",
    ],
  })
}
