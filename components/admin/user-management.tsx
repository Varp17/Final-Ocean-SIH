"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit, Trash2, Shield, Crown } from "lucide-react"

interface AdminUser {
  id: string
  name: string
  email: string
  role: "admin" | "analyst" | "citizen" | "authority"
  status: "active" | "inactive" | "suspended"
  lastActive: string
  reportsSubmitted: number
  verificationRate: number
}

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

  // Mock users data
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: "1",
      name: "Dr. Rajesh Kumar",
      email: "rajesh.kumar@coastalguard.gov.in",
      role: "admin",
      status: "active",
      lastActive: "2 minutes ago",
      reportsSubmitted: 0,
      verificationRate: 0,
    },
    {
      id: "2",
      name: "Priya Sharma",
      email: "priya.sharma@weather.gov.in",
      role: "analyst",
      status: "active",
      lastActive: "15 minutes ago",
      reportsSubmitted: 234,
      verificationRate: 94,
    },
    {
      id: "3",
      name: "Mumbai Port Authority",
      email: "alerts@mumbaiport.gov.in",
      role: "authority",
      status: "active",
      lastActive: "1 hour ago",
      reportsSubmitted: 89,
      verificationRate: 98,
    },
    {
      id: "4",
      name: "Arjun Patel",
      email: "arjun.patel@gmail.com",
      role: "citizen",
      status: "active",
      lastActive: "3 hours ago",
      reportsSubmitted: 12,
      verificationRate: 75,
    },
    {
      id: "5",
      name: "Suspicious User",
      email: "fake@example.com",
      role: "citizen",
      status: "suspended",
      lastActive: "2 days ago",
      reportsSubmitted: 45,
      verificationRate: 15,
    },
  ])

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-purple-600" />
      case "analyst":
        return <Shield className="h-4 w-4 text-blue-600" />
      case "authority":
        return <Shield className="h-4 w-4 text-emerald-600" />
      case "citizen":
        return <Shield className="h-4 w-4 text-slate-600" />
      default:
        return <Shield className="h-4 w-4 text-slate-600" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "analyst":
        return "bg-blue-100 text-blue-800"
      case "authority":
        return "bg-emerald-100 text-emerald-800"
      case "citizen":
        return "bg-slate-100 text-slate-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "suspended":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="analyst">Analyst</SelectItem>
                <SelectItem value="authority">Authority</SelectItem>
                <SelectItem value="citizen">Citizen</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account with appropriate role and permissions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter full name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="citizen">Citizen</SelectItem>
                        <SelectItem value="analyst">Analyst</SelectItem>
                        <SelectItem value="authority">Authority</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddUserOpen(false)}>Create User</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={`/ceholder-svg-key-5y9lr.jpg?key=5y9lr&height=40&width=40`} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-slate-900">{user.name}</span>
                      {getRoleIcon(user.role)}
                    </div>
                    <div className="text-sm text-slate-600">{user.email}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getRoleColor(user.role)}>{user.role.toUpperCase()}</Badge>
                      <Badge variant={getStatusVariant(user.status)}>{user.status.toUpperCase()}</Badge>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="text-sm text-slate-600">Last active: {user.lastActive}</div>
                  {user.role !== "admin" && (
                    <div className="text-xs text-slate-500">
                      {user.reportsSubmitted} reports • {user.verificationRate}% accuracy
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{users.filter((u) => u.role === "admin").length}</div>
              <div className="text-sm text-slate-600">Administrators</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{users.filter((u) => u.role === "analyst").length}</div>
              <div className="text-sm text-slate-600">Analysts</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {users.filter((u) => u.role === "authority").length}
              </div>
              <div className="text-sm text-slate-600">Authorities</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-600">
                {users.filter((u) => u.role === "citizen").length}
              </div>
              <div className="text-sm text-slate-600">Citizens</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
