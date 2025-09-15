"use client"

import { useState } from "react"
import { toast } from "@/hooks/use-toast"

export function useMLAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const classifyHazard = async (text: string) => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/ml/classify-hazard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error)
      }

      return result.data
    } catch (error) {
      console.error("[v0] ML classification error:", error)
      toast({
        title: "Analysis Failed",
        description: "Unable to classify hazard. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsAnalyzing(false)
    }
  }

  const analyzeSocialMedia = async (text: string, metadata?: any) => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/ml/analyze-social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, metadata }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error)
      }

      return result.data
    } catch (error) {
      console.error("[v0] Social media analysis error:", error)
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze social media post. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateThreatAssessment = async (reports: any[]) => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/ml/threat-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reports }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error)
      }

      return result.data
    } catch (error) {
      console.error("[v0] Threat assessment error:", error)
      toast({
        title: "Assessment Failed",
        description: "Unable to generate threat assessment. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsAnalyzing(false)
    }
  }

  return {
    isAnalyzing,
    classifyHazard,
    analyzeSocialMedia,
    generateThreatAssessment,
  }
}
