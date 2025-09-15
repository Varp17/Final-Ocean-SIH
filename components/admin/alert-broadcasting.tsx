"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Send, Clock, Users, MessageSquare, Phone, Mail, Bell } from "lucide-react"

export function AlertBroadcasting() {
  const [alertForm, setAlertForm] = useState({
    title: "",
    message: "",
    severity: "",
    targetAreas: [] as string[],
    channels: [] as string[],
    scheduledTime: "",
    smsRecipients: "",
    locationRadius: "",
    emergencyContacts: false,
  })

  const [smsBroadcastStatus, setSMSBroadcastStatus] = useState<{
    isActive: boolean
    sent: number
    failed: number
    inProgress: boolean
  }>({
    isActive: false,
    sent: 0,
    failed: 0,
    inProgress: false,
  })

  const [recentAlerts, setRecentAlerts] = useState([
    {
      id: 1,
      title: "High Wave Warning - Mumbai Coast",
      severity: "high",
      sentAt: "2 hours ago",
      recipients: 15847,
      channels: ["SMS", "Email", "Push"],
      status: "delivered",
      smsStats: { sent: 15847, delivered: 15623, failed: 224 },
    },
    {
      id: 2,
      title: "Storm Surge Alert - Chennai",
      severity: "critical",
      sentAt: "6 hours ago",
      recipients: 8934,
      channels: ["SMS", "Email", "Push", "Social"],
      status: "delivered",
      smsStats: { sent: 8934, delivered: 8901, failed: 33 },
    },
    {
      id: 3,
      title: "Marine Pollution Report - Goa",
      severity: "medium",
      sentAt: "1 day ago",
      recipients: 3456,
      channels: ["Email", "Push"],
      status: "delivered",
      smsStats: { sent: 0, delivered: 0, failed: 0 },
    },
  ])

  const areas = [
    "Mumbai Metropolitan Region",
    "Chennai Coastal Area",
    "Kochi Harbor Zone",
    "Goa Coastal Belt",
    "Visakhapatnam Port Area",
    "Kolkata Port Region",
    "All Coastal Areas",
  ]

  const channels = [
    { id: "sms", label: "SMS", description: "Text messages to registered users", icon: MessageSquare },
    { id: "email", label: "Email", description: "Email notifications", icon: Mail },
    { id: "push", label: "Push Notifications", description: "Mobile app notifications", icon: Bell },
    { id: "social", label: "Social Media", description: "Twitter, Facebook posts", icon: Users },
    { id: "sirens", label: "Emergency Sirens", description: "Physical warning systems", icon: Phone },
  ]

  const handleSendAlert = async () => {
    console.log("[v0] Sending emergency alert:", alertForm)

    setSMSBroadcastStatus({ ...smsBroadcastStatus, inProgress: true })

    // If SMS is selected, trigger SMS broadcast
    if (alertForm.channels.includes("sms")) {
      try {
        const smsPayload = {
          message: `${alertForm.title}\n\n${alertForm.message}`,
          recipients: alertForm.smsRecipients
            .split(",")
            .map((r) => r.trim())
            .filter((r) => r),
          priority: alertForm.severity,
          location: alertForm.locationRadius
            ? {
                latitude: 19.076, // Mock coordinates
                longitude: 72.8777,
                radius: Number.parseInt(alertForm.locationRadius) || 10,
              }
            : undefined,
          hazardType: alertForm.title.toLowerCase().includes("wave") ? "high-waves" : "other",
        }

        const response = await fetch("/api/sms/broadcast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(smsPayload),
        })

        const result = await response.json()
        console.log("[v0] SMS broadcast result:", result)

        setSMSBroadcastStatus({
          isActive: true,
          sent: result.sent || 0,
          failed: result.failed || 0,
          inProgress: false,
        })
      } catch (error) {
        console.error("[v0] SMS broadcast failed:", error)
        setSMSBroadcastStatus({ ...smsBroadcastStatus, inProgress: false })
      }
    }

    // Add to recent alerts
    const newAlert = {
      id: recentAlerts.length + 1,
      title: alertForm.title,
      severity: alertForm.severity,
      sentAt: "Just now",
      recipients: alertForm.smsRecipients ? alertForm.smsRecipients.split(",").length : 12000,
      channels: alertForm.channels,
      status: "sending" as const,
      smsStats: {
        sent: smsBroadcastStatus.sent,
        delivered: Math.floor(smsBroadcastStatus.sent * 0.98),
        failed: smsBroadcastStatus.failed,
      },
    }
    setRecentAlerts([newAlert, ...recentAlerts])

    // Reset form
    setAlertForm({
      title: "",
      message: "",
      severity: "",
      targetAreas: [],
      channels: [],
      scheduledTime: "",
      smsRecipients: "",
      locationRadius: "",
      emergencyContacts: false,
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div className="space-y-6">
      {smsBroadcastStatus.isActive && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">SMS Broadcast Active</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-green-700">Sent: {smsBroadcastStatus.sent}</span>
                <span className="text-red-700">Failed: {smsBroadcastStatus.failed}</span>
                {smsBroadcastStatus.inProgress && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600">Broadcasting...</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Composition */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Alert Broadcasting</CardTitle>
            <CardDescription>Send emergency alerts to citizens and authorities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="alert-title">Alert Title</Label>
              <Input
                id="alert-title"
                placeholder="Enter alert title..."
                value={alertForm.title}
                onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alert-message">Alert Message</Label>
              <Textarea
                id="alert-message"
                placeholder="Enter detailed alert message..."
                rows={4}
                value={alertForm.message}
                onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity Level</Label>
              <Select
                value={alertForm.severity}
                onValueChange={(value) => setAlertForm({ ...alertForm, severity: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Advisory</SelectItem>
                  <SelectItem value="medium">Medium - Watch</SelectItem>
                  <SelectItem value="high">High - Warning</SelectItem>
                  <SelectItem value="critical">Critical - Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Areas</Label>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                {areas.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={alertForm.targetAreas.includes(area)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAlertForm({ ...alertForm, targetAreas: [...alertForm.targetAreas, area] })
                        } else {
                          setAlertForm({ ...alertForm, targetAreas: alertForm.targetAreas.filter((a) => a !== area) })
                        }
                      }}
                    />
                    <Label htmlFor={area} className="text-sm">
                      {area}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Broadcasting Channels</Label>
              <div className="space-y-2">
                {channels.map((channel) => {
                  const IconComponent = channel.icon
                  return (
                    <div key={channel.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={channel.id}
                        checked={alertForm.channels.includes(channel.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setAlertForm({ ...alertForm, channels: [...alertForm.channels, channel.id] })
                          } else {
                            setAlertForm({ ...alertForm, channels: alertForm.channels.filter((c) => c !== channel.id) })
                          }
                        }}
                      />
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4 text-slate-600" />
                        <div>
                          <Label htmlFor={channel.id} className="text-sm font-medium">
                            {channel.label}
                          </Label>
                          <p className="text-xs text-slate-500">{channel.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {alertForm.channels.includes("sms") && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>SMS Configuration</span>
                </h4>

                <div className="space-y-2">
                  <Label htmlFor="sms-recipients">SMS Recipients (comma-separated phone numbers)</Label>
                  <Textarea
                    id="sms-recipients"
                    placeholder="+91-9876543210, +91-9876543211, +91-9876543212"
                    rows={2}
                    value={alertForm.smsRecipients}
                    onChange={(e) => setAlertForm({ ...alertForm, smsRecipients: e.target.value })}
                  />
                  <p className="text-xs text-blue-600">Leave empty to use location-based targeting</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location-radius">Location Radius (km)</Label>
                  <Input
                    id="location-radius"
                    type="number"
                    placeholder="10"
                    value={alertForm.locationRadius}
                    onChange={(e) => setAlertForm({ ...alertForm, locationRadius: e.target.value })}
                  />
                  <p className="text-xs text-blue-600">Radius for location-based SMS targeting</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emergency-contacts"
                    checked={alertForm.emergencyContacts}
                    onCheckedChange={(checked) => setAlertForm({ ...alertForm, emergencyContacts: !!checked })}
                  />
                  <Label htmlFor="emergency-contacts" className="text-sm">
                    Include emergency services contacts in SMS
                  </Label>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="scheduled-time">Schedule (Optional)</Label>
              <Input
                id="scheduled-time"
                type="datetime-local"
                value={alertForm.scheduledTime}
                onChange={(e) => setAlertForm({ ...alertForm, scheduledTime: e.target.value })}
              />
            </div>

            <Button
              onClick={handleSendAlert}
              className="w-full"
              disabled={!alertForm.title || !alertForm.message || !alertForm.severity || smsBroadcastStatus.inProgress}
            >
              <Send className="h-4 w-4 mr-2" />
              {smsBroadcastStatus.inProgress
                ? "Broadcasting..."
                : alertForm.scheduledTime
                  ? "Schedule Alert"
                  : "Send Alert Now"}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>History of sent emergency alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{alert.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getSeverityColor(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
                        <Badge variant="outline">{alert.status.toUpperCase()}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{alert.sentAt}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{alert.recipients.toLocaleString()} recipients</span>
                    </div>
                  </div>

                  {alert.channels.includes("SMS") && alert.smsStats && (
                    <div className="flex items-center space-x-4 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>SMS: {alert.smsStats.sent} sent</span>
                      </div>
                      <span className="text-green-600">{alert.smsStats.delivered} delivered</span>
                      <span className="text-red-600">{alert.smsStats.failed} failed</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {alert.channels.map((channel) => (
                      <Badge key={channel} variant="secondary" className="text-xs">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Broadcasting Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Broadcasting Statistics</CardTitle>
          <CardDescription>Alert delivery and engagement metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-blue-700">Alerts Sent (30 days)</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">98.5%</div>
              <div className="text-sm text-emerald-700">Delivery Rate</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">2.3s</div>
              <div className="text-sm text-amber-700">Avg Delivery Time</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">87%</div>
              <div className="text-sm text-purple-700">User Engagement</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">94.2%</div>
              <div className="text-sm text-indigo-700">SMS Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
