export interface UrgencyFactors {
  severity: "low" | "medium" | "high" | "critical"
  hazardType: string
  locationRisk: number
  timeOfDay: number
  weatherConditions: number
  crowdDensity: number
  historicalData: number
  socialMediaMentions: number
  verificationStatus: number
}

export interface UrgencyScore {
  score: number
  level: "low" | "medium" | "high" | "critical"
  factors: UrgencyFactors
  recommendations: string[]
  estimatedResponseTime: number
}

export class UrgencyScorer {
  private static readonly WEIGHTS = {
    severity: 0.25,
    hazardType: 0.15,
    locationRisk: 0.15,
    timeOfDay: 0.1,
    weatherConditions: 0.1,
    crowdDensity: 0.1,
    historicalData: 0.05,
    socialMediaMentions: 0.05,
    verificationStatus: 0.05,
  }

  private static readonly HAZARD_MULTIPLIERS = {
    "shark-sighting": 1.0,
    "rip-current": 0.95,
    "high-waves": 0.85,
    jellyfish: 0.7,
    pollution: 0.6,
    debris: 0.5,
    other: 0.4,
  }

  static calculateUrgencyScore(factors: Partial<UrgencyFactors>): UrgencyScore {
    const normalizedFactors = this.normalizeFactors(factors)

    // Calculate weighted score
    let score = 0
    score += this.getSeverityScore(normalizedFactors.severity) * this.WEIGHTS.severity
    score += this.getHazardTypeScore(normalizedFactors.hazardType) * this.WEIGHTS.hazardType
    score += normalizedFactors.locationRisk * this.WEIGHTS.locationRisk
    score += normalizedFactors.timeOfDay * this.WEIGHTS.timeOfDay
    score += normalizedFactors.weatherConditions * this.WEIGHTS.weatherConditions
    score += normalizedFactors.crowdDensity * this.WEIGHTS.crowdDensity
    score += normalizedFactors.historicalData * this.WEIGHTS.historicalData
    score += normalizedFactors.socialMediaMentions * this.WEIGHTS.socialMediaMentions
    score += normalizedFactors.verificationStatus * this.WEIGHTS.verificationStatus

    // Apply hazard type multiplier
    const hazardMultiplier =
      this.HAZARD_MULTIPLIERS[normalizedFactors.hazardType as keyof typeof this.HAZARD_MULTIPLIERS] || 0.5
    score *= hazardMultiplier

    // Determine urgency level
    const level = this.getUrgencyLevel(score)

    return {
      score: Math.round(score * 100),
      level,
      factors: normalizedFactors,
      recommendations: this.generateRecommendations(level, normalizedFactors),
      estimatedResponseTime: this.calculateResponseTime(level, score),
    }
  }

  private static normalizeFactors(factors: Partial<UrgencyFactors>): UrgencyFactors {
    return {
      severity: factors.severity || "low",
      hazardType: factors.hazardType || "other",
      locationRisk: Math.min(Math.max(factors.locationRisk || 0.5, 0), 1),
      timeOfDay: Math.min(Math.max(factors.timeOfDay || 0.5, 0), 1),
      weatherConditions: Math.min(Math.max(factors.weatherConditions || 0.5, 0), 1),
      crowdDensity: Math.min(Math.max(factors.crowdDensity || 0.5, 0), 1),
      historicalData: Math.min(Math.max(factors.historicalData || 0.5, 0), 1),
      socialMediaMentions: Math.min(Math.max(factors.socialMediaMentions || 0, 0), 1),
      verificationStatus: Math.min(Math.max(factors.verificationStatus || 0.5, 0), 1),
    }
  }

  private static getSeverityScore(severity: string): number {
    switch (severity) {
      case "critical":
        return 1.0
      case "high":
        return 0.8
      case "medium":
        return 0.6
      case "low":
        return 0.3
      default:
        return 0.2
    }
  }

  private static getHazardTypeScore(hazardType: string): number {
    return this.HAZARD_MULTIPLIERS[hazardType as keyof typeof this.HAZARD_MULTIPLIERS] || 0.5
  }

  private static getUrgencyLevel(score: number): "low" | "medium" | "high" | "critical" {
    if (score >= 0.8) return "critical"
    if (score >= 0.6) return "high"
    if (score >= 0.4) return "medium"
    return "low"
  }

  private static generateRecommendations(level: string, factors: UrgencyFactors): string[] {
    const recommendations: string[] = []

    switch (level) {
      case "critical":
        recommendations.push("Immediate evacuation of affected area")
        recommendations.push("Deploy emergency response teams")
        recommendations.push("Issue public safety alerts")
        recommendations.push("Coordinate with coast guard and marine police")
        break
      case "high":
        recommendations.push("Alert nearby lifeguards and authorities")
        recommendations.push("Post warning signs in affected areas")
        recommendations.push("Monitor situation closely")
        recommendations.push("Prepare emergency response resources")
        break
      case "medium":
        recommendations.push("Increase surveillance in the area")
        recommendations.push("Inform local authorities")
        recommendations.push("Update safety advisories")
        break
      case "low":
        recommendations.push("Log incident for monitoring")
        recommendations.push("Continue routine surveillance")
        break
    }

    if (factors.crowdDensity > 0.7) {
      recommendations.push("Consider crowd control measures")
    }

    if (factors.weatherConditions > 0.7) {
      recommendations.push("Factor in adverse weather conditions")
    }

    return recommendations
  }

  private static calculateResponseTime(level: string, score: number): number {
    // Response time in minutes
    switch (level) {
      case "critical":
        return Math.max(2, 15 - score * 10)
      case "high":
        return Math.max(5, 30 - score * 20)
      case "medium":
        return Math.max(15, 60 - score * 30)
      case "low":
        return Math.max(30, 120 - score * 60)
      default:
        return 120
    }
  }
}
