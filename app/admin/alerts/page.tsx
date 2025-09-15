import { AlertBroadcasting } from "@/components/admin/alerts/alert-broadcasting"

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Alert Broadcasting</h1>
        <p className="text-gray-600">Send emergency alerts and notifications</p>
      </div>
      <AlertBroadcasting />
    </div>
  )
}
