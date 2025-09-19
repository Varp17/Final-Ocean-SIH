"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Satellite, Wifi, WifiOff, Send, Inbox, Clock, MapPin, Signal } from "lucide-react"

interface SatelliteMessage {
  id: string
  sender: string
  content: string
  location: string
  timestamp: string
  status: "pending" | "sent" | "delivered" | "failed"
  priority: "low" | "medium" | "high" | "emergency"
  messageType: "sms" | "email" | "emergency"
}

export function SatelliteCommunication() {
  const [isOnline, setIsOnline] = useState(false)
  const [queuedMessages, setQueuedMessages] = useState<SatelliteMessage[]>([
    {
      id: "sat-001",
      sender: "Fisherman Boat #47",
      content:
        "Emergency: Engine failure 15km offshore from Mumbai. Need immediate rescue assistance. 3 people on board.",
      location: "19.0760°N, 72.8777°E",
      timestamp: "13:45",
      status: "pending",
      priority: "emergency",
      messageType: "emergency",
    },
    {
      id: "sat-002",
      sender: "Remote Island Station",
      content: "High waves observed, approximately 4m height. Local fishing boats advised to return to harbor.",
      location: "18.9388°N, 72.8354°E",
      timestamp: "12:30",
      status: "pending",
      priority: "high",
      messageType: "sms",
    },
    {
      id: "sat-003",
      sender: "Coast Guard Patrol",
      content:
        "Oil spill detected 20km south of Kochi port. Estimated size 2km diameter. Containment teams dispatched.",
      location: "9.9312°N, 76.2673°E",
      timestamp: "11:15",
      status: "delivered",
      priority: "high",
      messageType: "email",
    },
  ])

  const [newMessage, setNewMessage] = useState({
    content: "",
    priority: "medium" as const,
    messageType: "sms" as const,
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "emergency":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500"
      case "sent":
        return "bg-blue-500"
      case "pending":
        return "bg-yellow-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const syncMessages = () => {
    setIsOnline(true)
    // Simulate syncing messages
    setTimeout(() => {
      setQueuedMessages((prev) =>
        prev.map((msg) => (msg.status === "pending" ? { ...msg, status: "sent" as const } : msg)),
      )
      setTimeout(() => {
        setQueuedMessages((prev) =>
          prev.map((msg) => (msg.status === "sent" ? { ...msg, status: "delivered" as const } : msg)),
        )
        setIsOnline(false)
      }, 3000)
    }, 2000)
  }

  const sendMessage = () => {
    if (!newMessage.content.trim()) return

    const message: SatelliteMessage = {
      id: `sat-${Date.now()}`,
      sender: "Control Center",
      content: newMessage.content,
      location: "Mumbai Control Center",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: isOnline ? "sent" : "pending",
      priority: newMessage.priority,
      messageType: newMessage.messageType,
    }

    setQueuedMessages((prev) => [message, ...prev])
    setNewMessage({ content: "", priority: "medium", messageType: "sms" })
  }

  return (
    <div className="space-y-6">
      {/* Satellite Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Satellite className="h-5 w-5" />
            Satellite Communication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${isOnline ? "text-green-600" : "text-red-600"}`}>
                {isOnline ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
                <span className="font-medium">{isOnline ? "Connected" : "Offline"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Signal className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Signal Strength: {isOnline ? "Strong" : "No Signal"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last Sync: {isOnline ? "Now" : "2 hours ago"}
              </Badge>
              <Button onClick={syncMessages} disabled={isOnline}>
                {isOnline ? "Syncing..." : "Sync Messages"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {queuedMessages.filter((m) => m.status === "pending").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-blue-600">
                  {queuedMessages.filter((m) => m.status === "sent").length}
                </p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {queuedMessages.filter((m) => m.status === "delivered").length}
                </p>
              </div>
              <Inbox className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emergency</p>
                <p className="text-2xl font-bold text-red-600">
                  {queuedMessages.filter((m) => m.priority === "emergency").length}
                </p>
              </div>
              <Satellite className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Send Message */}
      <Card>
        <CardHeader>
          <CardTitle>Send Satellite Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Priority</label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={newMessage.priority}
                onChange={(e) => setNewMessage((prev) => ({ ...prev, priority: e.target.value as any }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Message Type</label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={newMessage.messageType}
                onChange={(e) => setNewMessage((prev) => ({ ...prev, messageType: e.target.value as any }))}
              >
                <option value="sms">SMS</option>
                <option value="email">Email</option>
                <option value="emergency">Emergency Alert</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Message Content</label>
            <Textarea
              placeholder="Enter your message (160 characters max for SMS)"
              value={newMessage.content}
              onChange={(e) => setNewMessage((prev) => ({ ...prev, content: e.target.value }))}
              maxLength={newMessage.messageType === "sms" ? 160 : 1000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {newMessage.content.length}/{newMessage.messageType === "sms" ? 160 : 1000} characters
            </p>
          </div>
          <Button onClick={sendMessage} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            {isOnline ? "Send Immediately" : "Queue for Next Sync"}
          </Button>
        </CardContent>
      </Card>

      {/* Message Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-5 w-5" />
            Message Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {queuedMessages.map((message) => (
              <div key={message.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{message.sender}</span>
                    <Badge className={`${getPriorityColor(message.priority)} border`}>{message.priority}</Badge>
                    <Badge className={`${getStatusColor(message.status)} text-white`}>{message.status}</Badge>
                    <Badge variant="outline">{message.messageType}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    {message.timestamp}
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-2">{message.content}</p>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  {message.location}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
