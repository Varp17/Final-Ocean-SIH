"use client"

import type React from "react"
import { useState } from "react"
import { AdminSidebar } from "@/components/admin/shared/admin-sidebar"
import { AdminHeader } from "@/components/admin/shared/admin-header"
import { PermissionGuard } from "@/components/admin/shared/permission-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <PermissionGuard requiredRole="admin">
      <div className="flex h-screen bg-gray-50">
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        <div
          className={`
          fixed inset-y-0 left-0 z-50 lg:static lg:inset-0 lg:z-auto
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <AdminSidebar onMobileClose={() => setIsMobileSidebarOpen(false)} />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <AdminHeader onMobileMenuClick={() => setIsMobileSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </PermissionGuard>
  )
}
