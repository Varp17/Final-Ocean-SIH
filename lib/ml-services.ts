import { generateText, generateObject } from "ai"
import { groq } from "@ai-sdk/groq"
import { xai } from "@ai-sdk/xai"
import { z } from "zod"

// Schema for hazard classification
const HazardClassificationSchema = z.object({
  hazardType: z.enum([
    "tsunami",
    "cyclone",
    "storm_surge",
    "coastal_erosion",
    "oil_spill",
    "marine_pollution",
    "rip_current",
    "high_waves",
    "flooding",
    "other",
  ]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  confidence: z.number().min(0).max(1),
  location: z
    .object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      placeName: z.string().optional(),
    })
    .optional(),
  keywords: z.array(z.string()),
  urgency: z.enum(["immediate", "within_hours", "within_days", "monitoring"]),
})

// Schema for social media analysis
const SocialMediaAnalysisSchema = z.object({
  isHazardRelated: z.boolean(),
  sentiment: z.enum(["positive", "negative", "neutral", "urgent"]),
  credibility: z.enum(["high", "medium", "low"]),
  hazardInfo: HazardClassificationSchema.optional(),
  extractedEntities: z.object({
    locations: z.array(z.string()),
    organizations: z.array(z.string()),
    people: z.array(z.string()),
    timestamps: z.array(z.string()),
  }),
})

export class MLService {
  private groqModel = groq("llama-3.1-70b-versatile")
  private xaiModel = xai("grok-beta")

  async classifyHazardText(text: string): Promise<z.infer<typeof HazardClassificationSchema>> {
    try {
      const result = await generateObject({
        model: this.groqModel,
        schema: HazardClassificationSchema,
        prompt: `
        Analyze the following text for ocean/coastal hazard information:
        "${text}"
        
        Classify the hazard type, severity, and extract relevant information.
        Consider context clues about location, timing, and impact.
        Provide confidence score based on text clarity and specificity.
        
        Hazard types include:
        - tsunami: Large ocean waves caused by seismic activity
        - cyclone: Tropical storms with high winds
        - storm_surge: Abnormal rise in sea level during storms
        - coastal_erosion: Loss of coastal land due to wave action
        - oil_spill: Marine pollution from petroleum products
        - marine_pollution: Other forms of ocean contamination
        - rip_current: Strong offshore water currents
        - high_waves: Dangerous wave conditions
        - flooding: Coastal or inland water overflow
        - other: Other ocean-related hazards
        
        Severity levels:
        - low: Minor impact, advisory level
        - medium: Moderate impact, watch level
        - high: Significant impact, warning level
        - critical: Severe impact, emergency level
        `,
      })

      return result.object
    } catch (error) {
      console.error("[v0] Error in hazard classification:", error)
      throw new Error("Failed to classify hazard text")
    }
  }

  async analyzeSocialMediaPost(
    text: string,
    metadata?: { platform?: string; author?: string },
  ): Promise<z.infer<typeof SocialMediaAnalysisSchema>> {
    try {
      const result = await generateObject({
        model: this.xaiModel,
        schema: SocialMediaAnalysisSchema,
        prompt: `
        Analyze this social media post for ocean hazard information:
        Text: "${text}"
        Platform: ${metadata?.platform || "unknown"}
        Author: ${metadata?.author || "unknown"}
        
        Determine:
        1. Is this related to ocean/coastal hazards?
        2. What's the sentiment and urgency level?
        3. How credible does this source appear?
        4. Extract specific hazard information if present
        5. Identify named entities (locations, organizations, people, times)
        
        Consider factors like:
        - Official vs unofficial sources
        - Specific details vs vague claims
        - Emotional language vs factual reporting
        - Verification indicators (photos, official accounts, etc.)
        `,
      })

      return result.object
    } catch (error) {
      console.error("[v0] Error in social media analysis:", error)
      throw new Error("Failed to analyze social media post")
    }
  }

  async generateThreatAssessment(
    reports: Array<{
      text: string
      location?: { lat: number; lng: number }
      timestamp: string
      source: string
    }>,
  ): Promise<{
    overallThreatLevel: "low" | "medium" | "high" | "critical"
    primaryHazards: string[]
    affectedAreas: string[]
    recommendations: string[]
    confidence: number
  }> {
    try {
      const reportsText = reports
        .map((r, i) => `Report ${i + 1}: ${r.text} (Source: ${r.source}, Time: ${r.timestamp})`)
        .join("\n\n")

      const result = await generateText({
        model: this.groqModel,
        prompt: `
        Analyze these ocean hazard reports and provide a comprehensive threat assessment:
        
        ${reportsText}
        
        Provide a JSON response with:
        1. overallThreatLevel: Overall threat level considering all reports
        2. primaryHazards: Main hazard types identified
        3. affectedAreas: Geographic areas mentioned or implied
        4. recommendations: Specific actions for authorities and public
        5. confidence: Overall confidence in assessment (0-1)
        
        Consider:
        - Correlation between multiple reports
        - Geographic clustering of incidents
        - Temporal patterns and escalation
        - Source credibility and verification
        - Potential cascading effects
        `,
      })

      return JSON.parse(result.text)
    } catch (error) {
      console.error("[v0] Error in threat assessment:", error)
      throw new Error("Failed to generate threat assessment")
    }
  }

  async extractLocationFromText(text: string): Promise<{
    locations: Array<{
      name: string
      coordinates?: { lat: number; lng: number }
      confidence: number
    }>
  }> {
    try {
      const result = await generateText({
        model: this.groqModel,
        prompt: `
        Extract location information from this text:
        "${text}"
        
        Return a JSON object with locations array containing:
        - name: Location name as mentioned
        - coordinates: Lat/lng if you can determine them (for major cities/landmarks)
        - confidence: How confident you are this is a real location (0-1)
        
        Focus on:
        - Cities, towns, villages
        - Beaches, ports, harbors
        - Geographic features (bays, islands, etc.)
        - Administrative regions (states, districts)
        
        Example response:
        {
          "locations": [
            {"name": "Mumbai", "coordinates": {"lat": 19.0760, "lng": 72.8777}, "confidence": 0.95},
            {"name": "Juhu Beach", "coordinates": {"lat": 19.0896, "lng": 72.8656}, "confidence": 0.90}
          ]
        }
        `,
      })

      return JSON.parse(result.text)
    } catch (error) {
      console.error("[v0] Error in location extraction:", error)
      return { locations: [] }
    }
  }
}

export const mlService = new MLService()
