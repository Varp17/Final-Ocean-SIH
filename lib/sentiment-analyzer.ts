import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export interface SentimentAnalysis {
  sentiment: "positive" | "negative" | "neutral" | "urgent"
  confidence: number
  urgencyScore: number
  emotions: string[]
  keywords: string[]
  threatLevel: "none" | "low" | "medium" | "high" | "critical"
  actionRequired: boolean
  summary: string
}

export interface SocialMediaPost {
  id: string
  content: string
  platform: string
  username: string
  timestamp: string
  hashtags: string[]
  location?: string
  engagement?: {
    likes: number
    shares: number
    comments: number
  }
}

export class SentimentAnalyzer {
  private static readonly OCEAN_KEYWORDS = [
    "tsunami",
    "flood",
    "hurricane",
    "cyclone",
    "storm",
    "waves",
    "tide",
    "current",
    "shark",
    "jellyfish",
    "drowning",
    "rescue",
    "emergency",
    "danger",
    "warning",
    "evacuation",
    "alert",
    "safety",
    "hazard",
    "risk",
    "threat",
    "disaster",
    "coastal",
    "marine",
    "ocean",
    "sea",
    "beach",
    "shore",
    "water",
    "swimming",
  ]

  private static readonly URGENCY_INDICATORS = [
    "help",
    "emergency",
    "urgent",
    "immediate",
    "now",
    "asap",
    "critical",
    "danger",
    "threat",
    "warning",
    "alert",
    "evacuation",
    "rescue",
    "sos",
  ]

  static async analyzeSentiment(post: SocialMediaPost): Promise<SentimentAnalysis> {
    try {
      // Use AI for comprehensive sentiment analysis
      const { text } = await generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt: `Analyze the sentiment and urgency of this social media post about ocean/marine safety:

Content: "${post.content}"
Platform: ${post.platform}
Hashtags: ${post.hashtags.join(", ")}
Location: ${post.location || "Unknown"}

Provide analysis in this JSON format:
{
  "sentiment": "positive|negative|neutral|urgent",
  "confidence": 0.0-1.0,
  "urgencyScore": 0-100,
  "emotions": ["emotion1", "emotion2"],
  "keywords": ["keyword1", "keyword2"],
  "threatLevel": "none|low|medium|high|critical",
  "actionRequired": true|false,
  "summary": "Brief analysis summary"
}

Focus on ocean safety, marine hazards, emergency situations, and public safety concerns.`,
      })

      const aiAnalysis = JSON.parse(text)

      // Enhance with rule-based analysis
      const ruleBasedAnalysis = this.performRuleBasedAnalysis(post)

      // Combine AI and rule-based results
      return this.combineAnalyses(aiAnalysis, ruleBasedAnalysis)
    } catch (error) {
      console.error("[Sentiment] AI analysis failed, falling back to rule-based:", error)
      return this.performRuleBasedAnalysis(post)
    }
  }

  private static performRuleBasedAnalysis(post: SocialMediaPost): SentimentAnalysis {
    const content = post.content.toLowerCase()
    const allText = `${content} ${post.hashtags.join(" ")}`.toLowerCase()

    // Calculate urgency score
    let urgencyScore = 0
    this.URGENCY_INDICATORS.forEach((indicator) => {
      if (allText.includes(indicator)) {
        urgencyScore += 15
      }
    })

    // Check for ocean-related keywords
    const oceanKeywords = this.OCEAN_KEYWORDS.filter((keyword) => allText.includes(keyword))

    if (oceanKeywords.length > 0) {
      urgencyScore += oceanKeywords.length * 5
    }

    // Analyze sentiment patterns
    const positiveWords = ["safe", "rescued", "clear", "calm", "beautiful", "peaceful"]
    const negativeWords = ["danger", "threat", "emergency", "warning", "critical", "urgent"]

    let sentimentScore = 0
    positiveWords.forEach((word) => {
      if (allText.includes(word)) sentimentScore += 1
    })
    negativeWords.forEach((word) => {
      if (allText.includes(word)) sentimentScore -= 2
    })

    // Determine sentiment
    let sentiment: "positive" | "negative" | "neutral" | "urgent"
    if (urgencyScore > 50) {
      sentiment = "urgent"
    } else if (sentimentScore > 1) {
      sentiment = "positive"
    } else if (sentimentScore < -1) {
      sentiment = "negative"
    } else {
      sentiment = "neutral"
    }

    // Determine threat level
    let threatLevel: "none" | "low" | "medium" | "high" | "critical"
    if (urgencyScore > 80) threatLevel = "critical"
    else if (urgencyScore > 60) threatLevel = "high"
    else if (urgencyScore > 40) threatLevel = "medium"
    else if (urgencyScore > 20) threatLevel = "low"
    else threatLevel = "none"

    return {
      sentiment,
      confidence: Math.min(0.8, 0.4 + oceanKeywords.length * 0.1),
      urgencyScore: Math.min(100, urgencyScore),
      emotions: this.extractEmotions(content),
      keywords: oceanKeywords,
      threatLevel,
      actionRequired: urgencyScore > 40,
      summary: this.generateSummary(sentiment, urgencyScore, oceanKeywords),
    }
  }

  private static combineAnalyses(aiAnalysis: any, ruleAnalysis: SentimentAnalysis): SentimentAnalysis {
    return {
      sentiment: aiAnalysis.sentiment || ruleAnalysis.sentiment,
      confidence: Math.max(aiAnalysis.confidence || 0, ruleAnalysis.confidence),
      urgencyScore: Math.max(aiAnalysis.urgencyScore || 0, ruleAnalysis.urgencyScore),
      emotions: [...(aiAnalysis.emotions || []), ...ruleAnalysis.emotions].slice(0, 5),
      keywords: [...(aiAnalysis.keywords || []), ...ruleAnalysis.keywords].slice(0, 10),
      threatLevel: this.getHigherThreatLevel(aiAnalysis.threatLevel, ruleAnalysis.threatLevel),
      actionRequired: aiAnalysis.actionRequired || ruleAnalysis.actionRequired,
      summary: aiAnalysis.summary || ruleAnalysis.summary,
    }
  }

  private static extractEmotions(content: string): string[] {
    const emotionMap = {
      fear: ["scared", "afraid", "terrified", "panic", "worried"],
      anger: ["angry", "furious", "mad", "outraged", "frustrated"],
      sadness: ["sad", "devastated", "heartbroken", "tragic", "loss"],
      joy: ["happy", "excited", "thrilled", "amazing", "wonderful"],
      surprise: ["shocked", "surprised", "unexpected", "sudden", "wow"],
      urgency: ["urgent", "immediate", "emergency", "critical", "now"],
    }

    const emotions: string[] = []
    Object.entries(emotionMap).forEach(([emotion, words]) => {
      if (words.some((word) => content.includes(word))) {
        emotions.push(emotion)
      }
    })

    return emotions
  }

  private static getHigherThreatLevel(level1: string, level2: string): "none" | "low" | "medium" | "high" | "critical" {
    const levels = ["none", "low", "medium", "high", "critical"]
    const index1 = levels.indexOf(level1) || 0
    const index2 = levels.indexOf(level2) || 0
    return levels[Math.max(index1, index2)] as any
  }

  private static generateSummary(sentiment: string, urgencyScore: number, keywords: string[]): string {
    if (urgencyScore > 70) {
      return `High urgency ocean safety post detected with ${keywords.length} relevant keywords. Immediate attention recommended.`
    } else if (urgencyScore > 40) {
      return `Moderate urgency ocean-related content with potential safety implications.`
    } else if (keywords.length > 0) {
      return `Ocean-related content with ${sentiment} sentiment. Routine monitoring recommended.`
    } else {
      return `General social media post with ${sentiment} sentiment.`
    }
  }

  static async batchAnalyze(posts: SocialMediaPost[]): Promise<Map<string, SentimentAnalysis>> {
    const results = new Map<string, SentimentAnalysis>()

    // Process in batches to avoid rate limits
    const batchSize = 5
    for (let i = 0; i < posts.length; i += batchSize) {
      const batch = posts.slice(i, i + batchSize)
      const batchPromises = batch.map((post) =>
        this.analyzeSentiment(post).then((analysis) => ({ id: post.id, analysis })),
      )

      const batchResults = await Promise.all(batchPromises)
      batchResults.forEach(({ id, analysis }) => {
        results.set(id, analysis)
      })

      // Small delay between batches
      if (i + batchSize < posts.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    return results
  }
}
