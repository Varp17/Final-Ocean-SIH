import { PushNotificationService } from "@/components/push-notification-service"

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Notification Management</h1>
          <p className="text-slate-600">Manage push notifications and SMS broadcasting for Atlas-Alert</p>
        </div>

        <PushNotificationService />
      </div>
    </div>
  )
}
