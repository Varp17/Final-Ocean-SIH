"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  attachments?: {
    type: "image" | "location"
    data: any
  }[]
}

interface HazardReport {
  id: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  location?: { lat: number; lng: number; address: string }
  description: string
  images?: string[]
  status: "pending" | "verified" | "resolved"
}

export default function HazardChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm Atlas, your emergency response assistant. I can help you report hazards, get emergency information, or connect you with local authorities. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentReport, setCurrentReport] = useState<Partial<HazardReport>>({})
  const [reportStep, setReportStep] = useState<"none" | "type" | "location" | "description" | "severity" | "complete">(
    "none",
  )
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (content: string, type: "user" | "bot", attachments?: any[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      attachments,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const simulateBotResponse = (userMessage: string) => {
    setIsTyping(true)

    setTimeout(
      () => {
        let botResponse = ""

        if (reportStep === "none") {
          if (
            userMessage.toLowerCase().includes("report") ||
            userMessage.toLowerCase().includes("hazard") ||
            userMessage.toLowerCase().includes("emergency")
          ) {
            botResponse =
              "I'll help you report a hazard. What type of hazard are you experiencing?\n\n🌊 Flooding\n🔥 Fire\n⛈️ Storm\n🏗️ Infrastructure damage\n🚨 Other emergency\n\nPlease type the number or name of the hazard type."
            setReportStep("type")
          } else if (userMessage.toLowerCase().includes("emergency") || userMessage.toLowerCase().includes("help")) {
            botResponse =
              "For immediate emergencies, call:\n🚨 Emergency Services: 911\n🚑 Medical Emergency: 911\n🚒 Fire Department: 911\n👮 Police: 911\n\nWould you like to report a non-emergency hazard instead?"
          } else {
            botResponse =
              "I can help you with:\n• Report hazards and emergencies\n• Get emergency contact numbers\n• Check hazard status in your area\n• Connect with local authorities\n\nWhat would you like to do?"
          }
        } else if (reportStep === "type") {
          const hazardTypes = {
            "1": "flooding",
            flood: "flooding",
            flooding: "flooding",
            "2": "fire",
            fire: "fire",
            "3": "storm",
            storm: "storm",
            weather: "storm",
            "4": "infrastructure",
            damage: "infrastructure",
            building: "infrastructure",
            "5": "other",
            other: "other",
            emergency: "other",
          }

          const detectedType = Object.entries(hazardTypes).find(([key]) => userMessage.toLowerCase().includes(key))?.[1]

          if (detectedType) {
            setCurrentReport((prev) => ({ ...prev, type: detectedType }))
            botResponse = `Got it, reporting a ${detectedType} hazard. Can you share your location? You can:\n\n📍 Share your current location\n📝 Type your address\n🗺️ Describe nearby landmarks\n\nThis helps emergency responders reach you quickly.`
            setReportStep("location")
          } else {
            botResponse = "Please select a valid hazard type by typing the number (1-5) or the hazard name."
          }
        } else if (reportStep === "location") {
          // Mock location detection
          const mockLocation = {
            lat: 40.7128 + (Math.random() - 0.5) * 0.1,
            lng: -74.006 + (Math.random() - 0.5) * 0.1,
            address: userMessage.includes("current") ? "Current Location (GPS)" : userMessage,
          }
          setCurrentReport((prev) => ({ ...prev, location: mockLocation }))
          botResponse = `Location recorded: ${mockLocation.address}\n\nNow, please describe what you're seeing. Be as detailed as possible:\n• What exactly is happening?\n• How severe is it?\n• Are people in immediate danger?\n• Any other important details?`
          setReportStep("description")
        } else if (reportStep === "description") {
          setCurrentReport((prev) => ({ ...prev, description: userMessage }))
          botResponse =
            "How would you rate the severity of this hazard?\n\n🟢 Low - Minor issue, no immediate danger\n🟡 Medium - Concerning, may need attention\n🟠 High - Serious, requires prompt response\n🔴 Critical - Immediate danger, urgent response needed\n\nType: low, medium, high, or critical"
          setReportStep("severity")
        } else if (reportStep === "severity") {
          const severityMap: { [key: string]: "low" | "medium" | "high" | "critical" } = {
            low: "low",
            "1": "low",
            minor: "low",
            medium: "medium",
            "2": "medium",
            moderate: "medium",
            high: "high",
            "3": "high",
            serious: "high",
            critical: "critical",
            "4": "critical",
            urgent: "critical",
            emergency: "critical",
          }

          const severity = severityMap[userMessage.toLowerCase()] || "medium"

          const finalReport: HazardReport = {
            id: `RPT-${Date.now()}`,
            type: currentReport.type || "other",
            severity,
            location: currentReport.location,
            description: currentReport.description || userMessage,
            status: "pending",
          }

          // Simulate saving report
          console.log("[v0] Hazard report created:", finalReport)

          botResponse = `✅ Hazard report submitted successfully!\n\n📋 Report ID: ${finalReport.id}\n🏷️ Type: ${finalReport.type}\n📍 Location: ${finalReport.location?.address}\n⚠️ Severity: ${severity.toUpperCase()}\n\n${severity === "critical" ? "🚨 CRITICAL ALERT: Emergency responders have been notified immediately!" : "📨 Your report has been sent to local authorities for review."}\n\nYou can track your report status or submit another report anytime. Is there anything else I can help you with?`

          setReportStep("complete")
          setCurrentReport({})

          // Reset after a delay
          setTimeout(() => setReportStep("none"), 2000)
        }

        addMessage(botResponse, "bot")
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // Simulate thinking time
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    addMessage(inputValue, "user")
    simulateBotResponse(inputValue)
    setInputValue("")
  }

  const handleKeyPress = (e: React.KeyEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickActions = [
    {
      label: "Report Hazard",
      action: () => {
        setInputValue("I want to report a hazard")
        handleSend()
      },
    },
    {
      label: "Emergency Numbers",
      action: () => {
        setInputValue("emergency numbers")
        handleSend()
      },
    },
    {
      label: "Check Status",
      action: () => {
        setInputValue("check hazard status")
        handleSend()
      },
    },
    {
      label: "Get Help",
      action: () => {
        setInputValue("I need help")
        handleSend()
      },
    },
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          Atlas Emergency Assistant
          <Badge variant="outline" className="ml-auto">
            Online
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start gap-2 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === "user" ? "bg-blue-600" : "bg-gray-600"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  <div className={`text-xs mt-1 opacity-70`}>{message.timestamp.toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {reportStep === "none" && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={action.action}
                  className="text-xs bg-transparent"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or describe the hazard..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button onClick={handleSend} disabled={!inputValue.trim() || isTyping} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
