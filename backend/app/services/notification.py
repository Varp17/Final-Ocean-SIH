"""
Notification service for SMS, email, and push notifications
"""
import asyncio
from typing import List, Dict
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models.db_models import Alert, Zone, Report, User
from ..config import settings

async def send_alert_notifications(alert_id: int):
    """
    Send alert notifications via multiple channels
    """
    db = SessionLocal()
    try:
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if not alert:
            return
        
        sms_count = 0
        
        # Send to authorities
        if "sms" in alert.channels:
            authority_count = await send_authority_notifications(alert)
            sms_count += authority_count
        
        # Send to citizens in affected area
        if alert.zone_id:
            citizen_count = await send_citizen_notifications(alert, db)
            sms_count += citizen_count
        
        # Update alert status
        alert.status = "sent"
        alert.sms_count = sms_count
        alert.authority_notified = True
        db.commit()
        
    finally:
        db.close()

async def send_authority_notifications(alert: Alert) -> int:
    """
    Send notifications to relevant authorities
    """
    # Determine hazard type from alert or related report
    hazard_type = "general"
    if alert.report_id:
        db = SessionLocal()
        try:
            report = db.query(Report).filter(Report.id == alert.report_id).first()
            if report:
                hazard_type = report.hazard_type
        finally:
            db.close()
    
    # Get authority contacts
    authority_info = settings.authority_contacts.get(hazard_type, 
        settings.authority_contacts.get("oil_spill"))  # Default fallback
    
    sms_count = 0
    
    # Send SMS to authority phones
    for phone in authority_info.get("phones", []):
        success = await send_sms(
            phone, 
            f"ATLAS-ALERT: {alert.message} - Authority: {authority_info['agency']}"
        )
        if success:
            sms_count += 1
    
    # Send emails (mock implementation)
    for email in authority_info.get("emails", []):
        await send_email(email, "Ocean Hazard Alert", alert.message)
    
    return sms_count

async def send_citizen_notifications(alert: Alert, db: Session) -> int:
    """
    Send notifications to citizens in affected area
    """
    if not alert.zone_id:
        return 0
    
    zone = db.query(Zone).filter(Zone.id == alert.zone_id).first()
    if not zone:
        return 0
    
    # Find users within the zone (mock implementation)
    # In production, would use PostGIS spatial queries
    affected_users = db.query(User).filter(
        User.last_known_lat.isnot(None),
        User.last_known_lon.isnot(None)
    ).limit(100).all()  # Limit for demo
    
    sms_count = 0
    
    for user in affected_users:
        if user.phone_hash:  # Only send to users with phone numbers
            # In production, would unhash phone number securely
            mock_phone = "+91" + "9" * 10  # Mock phone number
            
            message = f"OCEAN ALERT: {alert.message} Stay safe and follow official guidance. Atlas-Alert"
            success = await send_sms(mock_phone, message)
            if success:
                sms_count += 1
    
    return sms_count

async def send_sms(phone: str, message: str) -> bool:
    """
    Send SMS using Twilio or MSG91
    """
    try:
        # Mock SMS sending - in production would use actual Twilio/MSG91 API
        await asyncio.sleep(0.1)  # Simulate API call
        
        print(f"[SMS] Sent to {phone}: {message[:50]}...")
        
        # Mock 95% success rate
        import random
        return random.random() < 0.95
        
    except Exception as e:
        print(f"SMS sending failed: {e}")
        return False

async def send_email(email: str, subject: str, body: str) -> bool:
    """
    Send email notification
    """
    try:
        # Mock email sending
        await asyncio.sleep(0.1)
        
        print(f"[EMAIL] Sent to {email}: {subject}")
        return True
        
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False

async def send_push_notification(user_tokens: List[str], title: str, body: str) -> int:
    """
    Send push notifications to mobile devices
    """
    success_count = 0
    
    for token in user_tokens:
        try:
            # Mock push notification
            await asyncio.sleep(0.05)
            print(f"[PUSH] Sent to {token[:20]}...: {title}")
            success_count += 1
        except Exception as e:
            print(f"Push notification failed: {e}")
    
    return success_count

def get_notification_analytics() -> Dict:
    """
    Get notification system analytics
    """
    db = SessionLocal()
    try:
        total_alerts = db.query(Alert).count()
        sent_alerts = db.query(Alert).filter(Alert.status == "sent").count()
        total_sms = db.query(Alert).with_entities(
            db.func.sum(Alert.sms_count)
        ).scalar() or 0
        
        return {
            "total_alerts": total_alerts,
            "sent_alerts": sent_alerts,
            "total_sms_sent": total_sms,
            "delivery_rate": sent_alerts / total_alerts if total_alerts > 0 else 0
        }
    
    finally:
        db.close()
