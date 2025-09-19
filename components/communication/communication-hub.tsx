"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WhatsAppBotInterface } from "./whatsapp-bot-interface"
import { VoiceBotInterface } from "./voice-bot-interface"
import { SatelliteCommunication } from "./satellite-communication"
import { MessageSquare, Phone, Satellite } from "lucide-react"

export function CommunicationHub() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communication Hub</h1>
          <p className="text-gray-600">Multi-channel communication management for disaster response</p>
        </div>
      </div>

      <Tabs defaultValue="whatsapp" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            WhatsApp Bot
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Voice Bot
          </TabsTrigger>
          <TabsTrigger value="satellite" className="flex items-center gap-2">
            <Satellite className="h-4 w-4" />
            Satellite Comm
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp">
          <WhatsAppBotInterface />
        </TabsContent>

        <TabsContent value="voice">
          <VoiceBotInterface />
        </TabsContent>

        <TabsContent value="satellite">
          <SatelliteCommunication />
        </TabsContent>
      </Tabs>
    </div>
  )
}
