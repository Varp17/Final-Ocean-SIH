"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Mic, MicOff, Play, Volume2, FileAudio, Clock } from "lucide-react"

interface VoiceCall {
  id: string
  callerNumber: string
  duration: string
  timestamp: string
  status: "completed" | "in_progress" | "failed"
  transcription: string
  summary: string
  reportGenerated: boolean
  language: string
  sentiment: "calm" | "urgent" | "panic"
}

export function VoiceBotInterface() {
  const [isRecording, setIsRecording] = useState(false)
  const [selectedCall, setSelectedCall] = useState<VoiceCall | null>(null)

  const voiceCalls: VoiceCall[] = [
    {
      id: "vc-001",
      callerNumber: "+91-9876543210",
      duration: "2:34",
      timestamp: "14:25",
      status: "completed",
      transcription:
        "Hello, I'm calling to report very high waves at Versova Beach. The waves are huge, maybe 5 meters high. People are running away from the beach. It looks very dangerous. I think authorities should be informed immediately.",
      summary: "High waves reported at Versova Beach, approximately 5 meters high, people evacuating area",
      reportGenerated: true,
      language: "English",
      sentiment: "urgent",
    },
    {
      id: "vc-002",
      callerNumber: "+91-9876543211",
      duration: "1:45",
      timestamp: "13:52",
      status: "completed",
      transcription:
        "मुझे मुंबई के जुहू बीच पर तेल का रिसाव दिख रहा है। पानी काला हो गया है और मछलियां मर रही हैं। कृपया तुरंत कार्रवाई करें।",
      summary: "Oil spill reported at Juhu Beach, Mumbai. Water appears black, marine life affected",
      reportGenerated: true,
      language: "Hindi",
      sentiment: "urgent",
    },
    {
      id: "vc-003",
      callerNumber: "+91-9876543212",
      duration: "3:12",
      timestamp: "12:18",
      status: "completed",
      transcription:
        "I want to report coastal erosion at Bandra Bandstand. The sea wall is damaged and water is coming onto the road during high tide. This has been happening for the past few days.",
      summary: "Coastal erosion at Bandra Bandstand, sea wall damage, water on road during high tide",
      reportGenerated: true,
      language: "English",
      sentiment: "calm",
    },
  ]

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "panic":
        return "bg-red-100 text-red-800"
      case "urgent":
        return "bg-orange-100 text-orange-800"
      case "calm":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in_progress":
        return "bg-blue-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Voice Bot Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Calls Today</p>
                <p className="text-2xl font-bold text-blue-600">28</p>
              </div>
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold text-green-600">2:15</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">92%</p>
              </div>
              <Volume2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Languages</p>
                <p className="text-2xl font-bold text-orange-600">5</p>
              </div>
              <Mic className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Recording Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-blue-600" />
            Live Voice Recording
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
            <div className="text-center space-y-4">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center ${isRecording ? "bg-red-500 animate-pulse" : "bg-blue-500"}`}
              >
                {isRecording ? <MicOff className="h-12 w-12 text-white" /> : <Mic className="h-12 w-12 text-white" />}
              </div>
              <div>
                <p className="text-lg font-medium">{isRecording ? "Recording in progress..." : "Ready to record"}</p>
                <p className="text-sm text-gray-600">
                  {isRecording ? "Click to stop recording" : "Click to start recording"}
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => setIsRecording(!isRecording)}
                className={isRecording ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileAudio className="h-5 w-5" />
            Recent Voice Calls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {voiceCalls.map((call) => (
              <div
                key={call.id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedCall(call)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{call.callerNumber}</span>
                      </div>
                      <Badge className={`${getStatusColor(call.status)} text-white`}>{call.status}</Badge>
                      <Badge className={getSentimentColor(call.sentiment)}>{call.sentiment}</Badge>
                      <Badge variant="outline">{call.language}</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{call.summary}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {call.timestamp}
                      </span>
                      <span className="flex items-center gap-1">
                        <Volume2 className="h-3 w-3" />
                        {call.duration}
                      </span>
                      {call.reportGenerated && <Badge className="bg-green-100 text-green-800">Report Generated</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Play className="h-3 w-3 mr-1" />
                      Play
                    </Button>
                    <Button size="sm" variant="outline">
                      View Report
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call Detail Modal */}
      {selectedCall && (
        <Card>
          <CardHeader>
            <CardTitle>Call Details - {selectedCall.callerNumber}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <p className="text-sm text-gray-600">{selectedCall.duration}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Language</label>
                  <p className="text-sm text-gray-600">{selectedCall.language}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Sentiment</label>
                  <Badge className={getSentimentColor(selectedCall.sentiment)}>{selectedCall.sentiment}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge className={`${getStatusColor(selectedCall.status)} text-white`}>{selectedCall.status}</Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Full Transcription</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">{selectedCall.transcription}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">AI Summary</label>
                <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">{selectedCall.summary}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button>Generate Report</Button>
                <Button variant="outline">Download Audio</Button>
                <Button variant="outline" onClick={() => setSelectedCall(null)}>
                  Close
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
