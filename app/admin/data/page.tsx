"use client"

import { AIDataAnalyzer } from "@/components/admin/data/ai-data-analyzer"

export default function AdminDataPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">AI Data Management</h1>
          <p className="text-slate-600 mt-2">Advanced data analysis and management powered by AI integrations</p>
        </div>
      </div>

      <AIDataAnalyzer />
    </div>
  )
}
