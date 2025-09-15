import { LiveInteractiveMap } from "@/components/live-interactive-map"

export default function LiveMapPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Live Ocean Hazard Map</h1>
        <p className="text-slate-600">Real-time monitoring of citizen locations and danger zones</p>
      </div>
      <LiveInteractiveMap />
    </div>
  )
}
