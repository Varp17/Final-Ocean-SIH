from fastapi import WebSocket
from typing import Dict, List
import json
import asyncio


class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_rooms: Dict[str, List[str]] = {}  # user_id -> [room_ids]

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        print(f"🔌 Client {client_id} connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            print(f"🔌 Client {client_id} disconnected. Total connections: {len(self.active_connections)}")

    async def send_personal_message(self, message: str, client_id: str):
        if client_id in self.active_connections:
            websocket = self.active_connections[client_id]
            try:
                await websocket.send_text(message)
            except:
                self.disconnect(client_id)

    async def broadcast_to_all(self, message: dict):
        """Broadcast message to all connected clients"""
        if self.active_connections:
            message_str = json.dumps(message)
            disconnected = []

            for client_id, websocket in self.active_connections.items():
                try:
                    await websocket.send_text(message_str)
                except:
                    disconnected.append(client_id)

            # Clean up disconnected clients
            for client_id in disconnected:
                self.disconnect(client_id)

    async def broadcast_to_room(self, room_id: str, message: dict):
        """Broadcast message to specific room (e.g., geographic area)"""
        message_str = json.dumps(message)

        for user_id, rooms in self.user_rooms.items():
            if room_id in rooms and user_id in self.active_connections:
                try:
                    await self.active_connections[user_id].send_text(message_str)
                except:
                    self.disconnect(user_id)

    async def join_room(self, user_id: str, room_id: str):
        """Add user to a room for targeted broadcasts"""
        if user_id not in self.user_rooms:
            self.user_rooms[user_id] = []
        if room_id not in self.user_rooms[user_id]:
            self.user_rooms[user_id].append(room_id)

    async def leave_room(self, user_id: str, room_id: str):
        """Remove user from a room"""
        if user_id in self.user_rooms and room_id in self.user_rooms[user_id]:
            self.user_rooms[user_id].remove(room_id)


def websocket_manager():
    return None