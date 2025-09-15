import { EmergencyReportForm } from "@/components/emergency-report-form"

export default function EmergencyReportPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Emergency Report</h1>
        <p className="text-slate-600">Report ocean hazards and emergencies in real-time</p>
      </div>
      <EmergencyReportForm />
    </div>
  )
}
