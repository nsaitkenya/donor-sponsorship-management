import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Activity, AlertCircle, CheckCircle, XCircle } from "lucide-react"

export default async function AuditLogs() {
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

  // Fetch audit logs
  const { data: logs } = await supabase
    .from("audit_logs")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(100)

  const actionIcons: Record<string, any> = {
    create: CheckCircle,
    update: Activity,
    delete: XCircle,
    login: Activity,
    logout: Activity,
  }

  const actionColors: Record<string, string> = {
    create: "bg-green-100 text-green-800",
    update: "bg-blue-100 text-blue-800",
    delete: "bg-red-100 text-red-800",
    login: "bg-purple-100 text-purple-800",
    logout: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Audit Logs</h1>
          <p className="text-muted-foreground">System activity and security logs</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>Recent system activities and user actions</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search logs..." className="pl-9 w-64" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="login">Login</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logs && logs.length > 0 ? (
                logs.map((log) => {
                  const Icon = actionIcons[log.action] || AlertCircle
                  return (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="mt-1">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={actionColors[log.action] || actionColors.update}>
                            {log.action.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{log.entity_type}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          By {(log.profiles as any)?.full_name || "System"} (
                          {(log.profiles as any)?.email || "system@starehe.ac.ke"})
                        </div>
                        {log.details && (
                          <div className="text-sm text-muted-foreground">{JSON.stringify(log.details)}</div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No audit logs found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
