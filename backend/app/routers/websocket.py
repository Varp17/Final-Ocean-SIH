"""
WebSocket API endpoints
Real-time communication endpoints
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ..websocket_manager import WebSocketManager

router = APIRouter(prefix="/ws", tags=["WebSocket"])
websocket_manager = WebSocketManager()

@router.websocket("/realtime")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await websocket_manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            # Echo back for testing
            await websocket_manager.send_personal_message(f"Echo: {data}", websocket)
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket)
