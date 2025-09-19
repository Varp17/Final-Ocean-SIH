"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"

interface PermissionGuardProps {
  children: React.ReactNode
  requiredRole: "admin" | "analyst" | "citizen"
}

export function PermissionGuard({ children, requiredRole }: PermissionGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkPermissions = () => {
      // For demo purposes, always allow admin access
      // In production, check actual user role from auth context
      const userRole = "admin" // This would come from your auth system

      if (userRole === requiredRole || userRole === "admin") {
        setIsAuthorized(true)
      } else {
        setIsAuthorized(false)
        router.push("/")
      }
    }

    checkPermissions()
  }, [requiredRole, router])

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this area.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
