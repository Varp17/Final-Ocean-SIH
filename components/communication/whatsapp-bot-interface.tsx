"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, Bot, Clock, CheckCircle } from "lucide-react"

interface ChatMessage {
  id: string
  type: "incoming" | "outgoing"
  sender: "user" | "bot"
  content: string
  timestamp: string
  status: "sent" | "delivered" | "read"
  reportData?: {
    location: string
    hazardType: string
    severity: string
    confidence: number
  }
}

export function WhatsAppBotInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "incoming",
      sender: "user",
      content: "High waves at Juhu Beach, very dangerous!",
      timestamp: "14:30",
      status: "read",
      reportData: {
        location: "Juhu Beach, Mumbai",
        hazardType: "High Waves",
        severity: "High",
        confidence: 0.85,
      },
    },
    {
      id: "2",
      type: "outgoing",
      sender: "bot",
      content:
        "Thank you for reporting. I've recorded high waves at Juhu Beach. Can you provide more details about the wave height?",
      timestamp: "14:31",
      status: "read",
    },
    {
      id: "3",
      type: "incoming",
      sender: "user",
      content: "Waves are about 4-5 meters high, people are staying away from the shore",
      timestamp: "14:32",
      status: "read",
    },
    {
      id: "4",
      type: "outgoing",
      sender: "bot",
      content:
        "Report updated with wave height details. Your report has been forwarded to authorities. Stay safe and avoid the beach area. Report ID: #WB-2025-001",
      timestamp: "14:33",
      status: "delivered",
    },
  ])

  const [newMessage, setNewMessage] = useState("")

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      type: "outgoing",
      sender: "bot",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  return (
    <div className="space-y-6">
      {/* WhatsApp Bot Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Chats</p>
                <p className="text-2xl font-bold text-green-600">127</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reports Today</p>
                <p className="text-2xl font-bold text-blue-600">43</p>
              </div>
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-purple-600">94%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold text-orange-600">12s</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            WhatsApp Bot Interface
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg h-96 flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "bot" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "bot" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs opacity-75">{message.timestamp}</span>
                      {message.sender === "bot" && (
                        <div className="flex items-center gap-1">
                          {message.status === "sent" && <Clock className="h-3 w-3" />}
                          {message.status === "delivered" && <CheckCircle className="h-3 w-3" />}
                          {message.status === "read" && <CheckCircle className="h-3 w-3 text-blue-300" />}
                        </div>
                      )}
                    </div>
                    {message.reportData && (
                      <div className="mt-2 p-2 bg-white bg-opacity-20 rounded text-xs">
                        <p>
                          <strong>Location:</strong> {message.reportData.location}
                        </p>
                        <p>
                          <strong>Hazard:</strong> {message.reportData.hazardType}
                        </p>
                        <p>
                          <strong>Severity:</strong> {message.reportData.severity}
                        </p>
                        <p>
                          <strong>Confidence:</strong> {(message.reportData.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button onClick={sendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
