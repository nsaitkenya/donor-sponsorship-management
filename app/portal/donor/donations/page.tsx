"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { PortalLayout } from "@/components/portal-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"

export default function DonationsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [donations, setDonations] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

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
      setUser(user)

      const { data: donor } = await supabase.from("donors").select("*").eq("user_id", user.id).single()

      if (donor) {
        const { data } = await supabase
          .from("donations")
          .select("*")
          .eq("donor_id", donor.id)
          .order("created_at", { ascending: false })

        setDonations(data || [])
      }

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
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/portal/donor">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Donation History</CardTitle>
          <CardDescription>View all your contributions to Starehe Boys Centre</CardDescription>
        </CardHeader>
        <CardContent>
          {donations.length > 0 ? (
            <div className="space-y-4">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-lg">
                        {donation.currency} {donation.amount.toLocaleString()}
                      </p>
                      <Badge
                        variant={
                          donation.payment_status === "completed"
                            ? "default"
                            : donation.payment_status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {donation.payment_status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(donation.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Payment Method: {donation.payment_method.replace("_", " ")}
                    </p>
                    {donation.message && <p className="text-sm italic">{donation.message}</p>}
                  </div>
                  {donation.payment_status === "completed" && (
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Receipt
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No donations yet</p>
              <Button asChild>
                <Link href="/portal/donor/donate">Make Your First Donation</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </PortalLayout>
  )
}
