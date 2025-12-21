"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { PortalLayout } from "@/components/portal-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react"

export default function FinancePortalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalRevenue: 0, pendingAmount: 0, completedCount: 0, pendingCount: 0 })
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profile?.role !== "finance_officer" && profile?.role !== "admin") {
        router.push("/portal/donor")
        return
      }

      const { data: allDonations } = await supabase.from("donations").select("*")

      const totalRevenue =
        allDonations?.reduce((sum, d) => (d.payment_status === "completed" ? sum + Number(d.amount) : sum), 0) || 0
      const pendingAmount =
        allDonations?.reduce((sum, d) => (d.payment_status === "pending" ? sum + Number(d.amount) : sum), 0) || 0
      const completedCount = allDonations?.filter((d) => d.payment_status === "completed").length || 0
      const pendingCount = allDonations?.filter((d) => d.payment_status === "pending").length || 0

      setStats({ totalRevenue, pendingAmount, completedCount, pendingCount })

      const { data: transactions } = await supabase
        .from("donations")
        .select("*, donors(*, profiles(full_name, email))")
        .order("created_at", { ascending: false })
        .limit(10)

      setRecentTransactions(transactions || [])
      setLoading(false)
    }
    loadData()
  }, [router])

  if (loading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center min-h-screen">Loading...</div>
      </PortalLayout>
    )
  }

  return (
    <PortalLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Finance Portal</h1>
        <p className="text-muted-foreground">Monitor and manage all financial transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All completed donations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {stats.pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedCount}</div>
            <p className="text-xs text-muted-foreground">Verified transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingCount}</div>
            <p className="text-xs text-muted-foreground">Needs verification</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest donation activity requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">
                        {transaction.currency} {transaction.amount.toLocaleString()}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          transaction.payment_status === "completed"
                            ? "bg-primary/10 text-primary"
                            : transaction.payment_status === "pending"
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {transaction.payment_status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {transaction.donors?.profiles?.full_name || "Anonymous"} • {transaction.donors?.profiles?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleString()} • {transaction.payment_method}
                    </p>
                    {transaction.transaction_reference && (
                      <p className="text-xs text-muted-foreground font-mono">
                        Ref: {transaction.transaction_reference}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No transactions found</div>
          )}
        </CardContent>
      </Card>
    </PortalLayout>
  )
}
