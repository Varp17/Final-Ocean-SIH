"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Twitter, MessageCircle, TrendingUp, MapPin, Clock, Heart, Repeat2 } from "lucide-react"
import { useWebSocket } from "@/lib/hooks/use-websocket"

interface SocialPost {
  id: string
  platform: "twitter" | "facebook" | "instagram"
  username: string
  content: string
  hashtags: string[]
  location?: string
  timestamp: string
  engagement: {
    likes: number
    shares: number
    comments: number
  }
  sentiment: "positive" | "negative" | "neutral" | "urgent"
  urgencyScore: number
  verified: boolean
  mediaUrls?: string[]
}

interface TrendingHashtag {
  tag: string
  count: number
  sentiment: "positive" | "negative" | "neutral" | "urgent"
  growth: number
}

export function LiveSocialFeed() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [trendingHashtags, setTrendingHashtags] = useState<TrendingHashtag[]>([
    { tag: "#OceanRanger", count: 1247, sentiment: "urgent", growth: 23.5 },
    { tag: "#BlueWatch", count: 892, sentiment: "neutral", growth: 15.2 },
    { tag: "#CoastalAlert", count: 634, sentiment: "urgent", growth: 45.8 },
    { tag: "#MarineSafety", count: 423, sentiment: "positive", growth: 8.9 },
    { tag: "#TsunamiWatch", count: 312, sentiment: "urgent", growth: 67.3 },
  ])
  const [activeFilters, setActiveFilters] = useState<string[]>(["urgent"])
  const [searchQuery, setSearchQuery] = useState("")
  const { isConnected, sendMessage } = useWebSocket()

  useEffect(() => {
    // Simulate live social media feed
    const interval = setInterval(
      () => {
        const newPost: SocialPost = generateMockPost()
        setPosts((prev) => [newPost, ...prev.slice(0, 49)]) // Keep last 50 posts
      },
      3000 + Math.random() * 7000,
    ) // Random interval 3-10 seconds

    return () => clearInterval(interval)
  }, [])

  const generateMockPost = (): SocialPost => {
    const platforms = ["twitter", "facebook", "instagram"] as const
    const usernames = [
      "@CoastGuardIndia",
      "@MarinePatrol",
      "@OceanWatcher",
      "@BeachSafety",
      "@WaveAlert",
      "@CitizenReporter",
    ]
    const locations = ["Mumbai Coast", "Chennai Marina", "Goa Beach", "Kochi Harbor", "Vizag Port", "Puri Beach"]
    const hashtags = ["#OceanRanger", "#BlueWatch", "#CoastalAlert", "#MarineSafety", "#TsunamiWatch", "#FloodAlert"]

    const contents = [
      "High waves spotted near the shore, swimmers advised to stay away",
      "Unusual marine activity detected in sector 7, investigating",
      "Strong rip current warning issued for next 2 hours",
      "Jellyfish swarm moving towards popular beach area",
      "Emergency response team deployed to coastal zone",
      "Weather conditions deteriorating, small craft advisory in effect",
      "Rescue operation successful, all personnel safe",
      "Monitoring unusual tidal patterns, stay alert",
    ]

    const sentiments = ["positive", "negative", "neutral", "urgent"] as const
    const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)]

    return {
      id: Date.now().toString() + Math.random(),
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      username: usernames[Math.floor(Math.random() * usernames.length)],
      content: contents[Math.floor(Math.random() * contents.length)],
      hashtags: hashtags.slice(0, Math.floor(Math.random() * 3) + 1),
      location: Math.random() > 0.3 ? locations[Math.floor(Math.random() * locations.length)] : undefined,
      timestamp: "Just now",
      engagement: {
        likes: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 50),
      },
      sentiment: randomSentiment,
      urgencyScore: Math.floor(Math.random() * 100),
      verified: Math.random() > 0.7,
      mediaUrls: Math.random() > 0.6 ? ["/ocean-hazard.jpg"] : undefined,
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 border-green-200"
      case "negative":
        return "bg-red-100 text-red-800 border-red-200"
      case "urgent":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="w-4 h-4" />
      case "facebook":
        return <MessageCircle className="w-4 h-4" />
      case "instagram":
        return <MessageCircle className="w-4 h-4" />
      default:
        return <MessageCircle className="w-4 h-4" />
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesFilter = activeFilters.length === 0 || activeFilters.includes(post.sentiment)
    const matchesSearch =
      searchQuery === "" ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.hashtags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Trending Hashtags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Trending Ocean Hashtags</span>
            <Badge variant="secondary" className="ml-auto">
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {trendingHashtags.map((hashtag) => (
              <div key={hashtag.tag} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-blue-600">{hashtag.tag}</span>
                  <Badge className={getSentimentColor(hashtag.sentiment)}>{hashtag.sentiment}</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <div>{hashtag.count.toLocaleString()} posts</div>
                  <div className="text-green-600">+{hashtag.growth}% growth</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search posts, hashtags, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <div className="flex gap-2">
              {["urgent", "negative", "positive", "neutral"].map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilters.includes(filter) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setActiveFilters((prev) =>
                      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter],
                    )
                  }}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <span>Live Social Media Feed</span>
            </div>
            <div className="flex items-center space-x-2">
              {isConnected && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600">Live</span>
                </div>
              )}
              <Badge variant="secondary">{filteredPosts.length} posts</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredPosts.map((post) => (
              <div key={post.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getPlatformIcon(post.platform)}
                    <span className="font-semibold">{post.username}</span>
                    {post.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    <Badge className={getSentimentColor(post.sentiment)}>{post.sentiment}</Badge>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.timestamp}</span>
                  </div>
                </div>

                <p className="text-gray-800">{post.content}</p>

                {post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.hashtags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-blue-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {post.location && (
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>{post.location}</span>
                  </div>
                )}

                {post.mediaUrls && (
                  <div className="grid grid-cols-2 gap-2">
                    {post.mediaUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url || "/placeholder.svg"}
                        alt="Social media content"
                        className="rounded-lg object-cover h-32 w-full"
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{post.engagement.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Repeat2 className="w-4 h-4" />
                      <span>{post.engagement.shares}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.engagement.comments}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Urgency:</span>
                    <Badge
                      variant={
                        post.urgencyScore > 70 ? "destructive" : post.urgencyScore > 40 ? "default" : "secondary"
                      }
                    >
                      {post.urgencyScore}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
