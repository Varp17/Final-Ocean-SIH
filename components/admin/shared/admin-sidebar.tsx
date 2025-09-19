"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Activity,
  Settings,
  AlertTriangle,
  Database,
  FileText,
  Menu,
  X,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Teams", href: "/admin/teams", icon: Shield },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Monitoring", href: "/admin/monitoring", icon: Activity },
  { name: "Alerts", href: "/admin/alerts", icon: AlertTriangle },
  { name: "Data", href: "/admin/data", icon: Database },
  { name: "Audit Logs", href: "/admin/audit", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

interface AdminSidebarProps {
  onMobileClose?: () => void
}

export function AdminSidebar({ onMobileClose }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const handleLinkClick = () => {
    if (onMobileClose) {
      onMobileClose()
    }
  }

  return (
    <div
      className={cn(
        "bg-gray-900 text-white transition-all duration-300 h-full flex flex-col",
        "w-64 lg:w-64",
        isCollapsed && "lg:w-16",
      )}
    >
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-800">
        {!isCollapsed && <h2 className="text-lg sm:text-xl font-bold truncate">Atlas-Alert Admin</h2>}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-gray-800 hidden lg:flex"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>

          {onMobileClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileClose}
              className="text-white hover:bg-gray-800 lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <nav className="mt-4 sm:mt-8 flex-1 overflow-y-auto">
        <ul className="space-y-1 sm:space-y-2 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center px-3 py-2.5 sm:py-2 rounded-lg text-sm font-medium transition-colors",
                    "min-h-[44px] sm:min-h-[36px]",
                    isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white",
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span className="ml-3 truncate">{item.name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
