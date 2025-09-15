"""
WebSocket connection manager for real-time updates
"""
from fastapi import WebSocket
from typing import List
import json

class WebSocketManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: dict):
        """Broadcast message to all connected clients"""
        message_str = json.dumps(message)
        for connection in self.active_connections:
            try:
                await connection.send_text(message_str)
            except:
                # Remove broken connections
                self.active_connections.remove(connection)

    async def broadcast_new_report(self, report_data: dict):
        """Broadcast new report to all clients"""
        await self.broadcast({
            "type": "new_report",
            "data": report_data
        })

    async def broadcast_new_zone(self, zone_data: dict):
        """Broadcast new zone creation to all clients"""
        await self.broadcast({
            "type": "new_zone",
            "data": zone_data
        })

    async def broadcast_alert_issued(self, alert_data: dict):
        """Broadcast alert issuance to all clients"""
        await self.broadcast({
            "type": "alert_issued",
            "data": alert_data
        })
