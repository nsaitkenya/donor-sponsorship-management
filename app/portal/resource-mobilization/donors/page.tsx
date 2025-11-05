"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { PortalHeader } from "@/components/portal-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Search, Mail, Phone } from "lucide-react"
import type { Donor } from "@/lib/types"

interface DonorWithProfile extends Donor {
  profiles?: {
    full_name: string | null
    email: string
    phone: string | null
  }
}

export default function DonorsPage() {
  const [donors, setDonors] = useState<DonorWithProfile[]>([])
  const [filteredDonors, setFilteredDonors] = useState<DonorWithProfile[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchDonors()
  }, [])

  useEffect(() => {
    filterDonors()
  }, [donors, searchTerm])

  const fetchDonors = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("donors")
      .select("*, profiles(full_name, email, phone)")
      .order("total_donated", { ascending: false })

    if (data) {
      setDonors(data as DonorWithProfile[])
    }
  }

  const filterDonors = () => {
    let filtered = donors

    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.organization_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredDonors(filtered)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader />

      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/portal/resource-mobilization">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Donor Database</CardTitle>
              <CardDescription>View and manage your donor relationships</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or organization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Donors List */}
              <div className="space-y-4">
                {filteredDonors.length > 0 ? (
                  filteredDonors.map((donor) => (
                    <div key={donor.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">
                            {donor.profiles?.full_name || donor.organization_name || "Anonymous"}
                          </p>
                          <Badge variant="outline" className="mt-1">
                            {donor.donor_type}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total Donated</p>
                          <p className="text-lg font-bold">KES {donor.total_donated.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{donor.profiles?.email || "N/A"}</span>
                        </div>
                        {donor.profiles?.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{donor.profiles.phone}</span>
                          </div>
                        )}
                        <div className="text-muted-foreground">
                          <span className="font-medium">Donations:</span> {donor.donation_count}
                        </div>
                      </div>
                      {donor.last_donation_date && (
                        <p className="text-xs text-muted-foreground">
                          Last donation: {new Date(donor.last_donation_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">No donors found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
