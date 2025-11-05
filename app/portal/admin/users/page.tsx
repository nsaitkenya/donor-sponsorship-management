import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, UserCog } from "lucide-react"
import { updateUserRole } from "@/lib/actions/admin-actions"

export default async function UsersManagement() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/portal/donor")
  }

  // Fetch all users
  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  const roleColors: Record<string, string> = {
    admin: "bg-red-100 text-red-800",
    finance_officer: "bg-blue-100 text-blue-800",
    sponsorship_officer: "bg-green-100 text-green-800",
    resource_mobilization: "bg-purple-100 text-purple-800",
    donor: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search users..." className="pl-9 w-64" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="finance_officer">Finance</SelectItem>
                    <SelectItem value="sponsorship_officer">Sponsorship</SelectItem>
                    <SelectItem value="resource_mobilization">Resource Mobilization</SelectItem>
                    <SelectItem value="donor">Donor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users?.map((userItem) => (
                <div
                  key={userItem.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCog className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{userItem.full_name || "Unnamed User"}</div>
                      <div className="text-sm text-muted-foreground">{userItem.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={roleColors[userItem.role] || roleColors.donor}>
                      {userItem.role.replace("_", " ").toUpperCase()}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {new Date(userItem.created_at).toLocaleDateString()}
                    </div>
                    <form action={updateUserRole.bind(null, userItem.id, userItem.role)}>
                      <Select name="role" defaultValue={userItem.role}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="donor">Donor</SelectItem>
                          <SelectItem value="finance_officer">Finance Officer</SelectItem>
                          <SelectItem value="sponsorship_officer">Sponsorship Officer</SelectItem>
                          <SelectItem value="resource_mobilization">Resource Mobilization</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
