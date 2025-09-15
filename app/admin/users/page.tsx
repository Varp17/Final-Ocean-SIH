import { UserManagement } from "@/components/admin/users/user-management"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage user accounts and permissions</p>
      </div>
      <UserManagement />
    </div>
  )
}
