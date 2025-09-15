"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share, ExternalLink, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { useMLAnalysis } from "@/lib/hooks/use-ml-analysis"

interface SocialPost {
  id: string
  platform: "twitter" | "facebook" | "instagram" | "reddit"
  author: string
  avatar?: string
  content: string
  timestamp: string
  engagement: {
    likes: number
    comments: number
    shares: number
  }
  analysis?: {
    isHazardRelated: boolean
    sentiment: string
    credibility: string
    hazardInfo?: any
  }
}

interface SocialMediaFeedProps {
  searchQuery: string
  severityFilter: string
}

export function SocialMediaFeed({ searchQuery, severityFilter }: SocialMediaFeedProps) {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { analyzeSocialMedia, isAnalyzing } = useMLAnalysis()

  // Mock social media posts
  useEffect(() => {
    const mockPosts: SocialPost[] = [
      {
        id: "1",
        platform: "twitter",
        author: "@CoastalWatch_IN",
        content:
          "🌊 URGENT: Massive waves hitting Juhu Beach, Mumbai. Locals advised to stay away from shoreline. #MumbaiWeather #CoastalAlert",
        timestamp: "2 minutes ago",
        engagement: { likes: 234, comments: 45, shares: 89 },
        analysis: {
          isHazardRelated: true,
          sentiment: "urgent",
          credibility: "high",
          hazardInfo: { hazardType: "high_waves", severity: "high" },
        },
      },
      {
        id: "2",
        platform: "facebook",
        author: "Chennai Port Authority",
        content:
          "Port operations suspended due to rough sea conditions. All vessels advised to seek shelter. Weather monitoring continues.",
        timestamp: "15 minutes ago",
        engagement: { likes: 156, comments: 23, shares: 67 },
        analysis: {
          isHazardRelated: true,
          sentiment: "neutral",
          credibility: "high",
          hazardInfo: { hazardType: "high_waves", severity: "medium" },
        },
      },
      {
        id: "3",
        platform: "instagram",
        author: "beachlife_goa",
        content: "Beautiful sunset at Baga Beach! Perfect weather for evening walks 🌅 #GoaVibes #BeachLife",
        timestamp: "1 hour ago",
        engagement: { likes: 89, comments: 12, shares: 5 },
        analysis: {
          isHazardRelated: false,
          sentiment: "positive",
          credibility: "medium",
        },
      },
      {
        id: "4",
        platform: "reddit",
        author: "u/fisherman_kerala",
        content:
          "Noticed unusual fish behavior near Kochi coast. Large schools moving away from shore. Old timers say this happened before the 2004 tsunami. Should we be concerned?",
        timestamp: "3 hours ago",
        engagement: { likes: 445, comments: 78, shares: 123 },
        analysis: {
          isHazardRelated: true,
          sentiment: "urgent",
          credibility: "medium",
          hazardInfo: { hazardType: "tsunami", severity: "medium" },
        },
      },
    ]

    setPosts(mockPosts)
    setIsLoading(false)
  }, [])

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "twitter":
        return "bg-blue-500"
      case "facebook":
        return "bg-blue-600"
      case "instagram":
        return "bg-pink-500"
      case "reddit":
        return "bg-orange-500"
      default:
        return "bg-slate-500"
    }
  }

  const getCredibilityIcon = (credibility: string) => {
    switch (credibility) {
      case "high":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case "medium":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      case "low":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getSeverityBadge = (severity?: string) => {
    if (!severity) return null

    const variants = {
      critical: "destructive",
      high: "destructive",
      medium: "default",
      low: "secondary",
    } as const

    return (
      <Badge variant={variants[severity as keyof typeof variants] || "secondary"}>
        {severity?.toUpperCase() || ""}
      </Badge>
    )
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSeverity = severityFilter === "all" || post.analysis?.hazardInfo?.severity === severityFilter

    return matchesSearch && matchesSeverity
  })

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-4">
                  <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Social Media Intelligence</CardTitle>
          <CardDescription>AI-powered analysis of social media posts for ocean hazard detection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {posts.filter((p) => p.analysis?.isHazardRelated).length}
              </div>
              <div className="text-sm text-slate-600">Hazard-Related Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {posts.filter((p) => p.analysis?.credibility === "high").length}
              </div>
              <div className="text-sm text-slate-600">High Credibility</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {posts.filter((p) => p.analysis?.sentiment === "urgent").length}
              </div>
              <div className="text-sm text-slate-600">Urgent Reports</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className={`${post.analysis?.isHazardRelated ? "border-l-4 border-l-red-500" : ""}`}>
            <CardContent className="pt-6">
              <div className="flex space-x-4">
                <Avatar>
                  <AvatarImage src={post.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    <div
                      className={`w-full h-full ${getPlatformColor(post.platform)} flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {post.platform[0].toUpperCase()}
                    </div>
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-900">{post.author}</span>
                      <Badge variant="outline" className="text-xs">
                        {post.platform}
                      </Badge>
                      {post.analysis && getCredibilityIcon(post.analysis.credibility)}
                    </div>
                    <span className="text-sm text-slate-500">{post.timestamp}</span>
                  </div>

                  <p className="text-slate-700 leading-relaxed">{post.content}</p>

                  {post.analysis && (
                    <div className="flex flex-wrap items-center gap-2">
                      {post.analysis.isHazardRelated && (
                        <Badge variant="destructive" className="text-xs">
                          Hazard Detected
                        </Badge>
                      )}
                      {post.analysis.hazardInfo && getSeverityBadge(post.analysis.hazardInfo.severity)}
                      <Badge variant="outline" className="text-xs">
                        {post.analysis.sentiment}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {post.analysis.credibility} credibility
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.engagement.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.engagement.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Share className="h-4 w-4" />
                        <span>{post.engagement.shares}</span>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
