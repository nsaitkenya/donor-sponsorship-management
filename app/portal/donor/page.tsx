'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PortalLayout } from '@/components/portal-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Heart, TrendingUp, Users, Calendar, ArrowRight } from 'lucide-react'

export default function DonorDashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [donor, setDonor] = useState<any>(null)
  const [donations, setDonations] = useState<any[]>([])
  const [sponsorships, setSponsorsips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (!authUser) {
          console.log('[v0] No authenticated user found, redirecting to login')
          router.push('/auth/login')
          return
        }

        setUser(authUser)
        console.log('[v0] User authenticated:', authUser.email)

        // Fetch profile
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', authUser.id).single()

        setProfile(profileData)

        // Fetch donor data
        const { data: donorData } = await supabase.from('donors').select('*').eq('user_id', authUser.id).single()

        setDonor(donorData)

        if (donorData?.id) {
          // Fetch donations
          const { data: donationsData } = await supabase
            .from('donations')
            .select('*')
            .eq('donor_id', donorData.id)
            .order('created_at', { ascending: false })
            .limit(5)

          setDonations(donationsData || [])

          // Fetch sponsorships
          const { data: sponsorshipsData } = await supabase
            .from('sponsorships')
            .select('*, students(*)')
            .eq('donor_id', donorData.id)
            .eq('status', 'active')

          setSponsorsips(sponsorshipsData || [])
        }
      } catch (error) {
        console.error('[v0] Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase, router])

  if (loading) {
    return (
      <PortalLayout userEmail={user?.email} userName={profile?.full_name} userRole="donor">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </PortalLayout>
    )
  }

  if (!user) {
    return null
  }

  const totalDonated = donor?.total_donated || 0
  const donationCount = donor?.donation_count || 0
  const activeSponsorships = sponsorships?.length || 0

  return (
    <PortalLayout userEmail={user.email} userName={profile?.full_name || undefined} userRole="donor">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.full_name || 'Donor'}!</h1>
          <p className="text-muted-foreground">Here's an overview of your impact at Starehe Boys Centre</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {totalDonated.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Lifetime contributions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Donations</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{donationCount}</div>
              <p className="text-xs text-muted-foreground">Total transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sponsorships</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSponsorships}</div>
              <p className="text-xs text-muted-foreground">Students supported</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Member Since</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {donor?.created_at ? new Date(donor.created_at).getFullYear() : '2024'}
              </div>
              <p className="text-xs text-muted-foreground">Year joined</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Make a difference today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-between">
                <Link href="/portal/donor/donate">
                  Make a Donation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-between bg-transparent">
                <Link href="/portal/donor/sponsor">
                  Sponsor a Student
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-between bg-transparent">
                <Link href="/campaigns">
                  View Campaigns
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Donations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>Your latest contributions</CardDescription>
            </CardHeader>
            <CardContent>
              {donations && donations.length > 0 ? (
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {donation.currency} {donation.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(donation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          donation.payment_status === 'completed'
                            ? 'default'
                            : donation.payment_status === 'pending'
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {donation.payment_status}
                      </Badge>
                    </div>
                  ))}
                  <Button asChild variant="link" className="w-full">
                    <Link href="/portal/donor/donations">View All Donations</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No donations yet</p>
                  <Button asChild>
                    <Link href="/portal/donor/donate">Make Your First Donation</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active Sponsorships */}
        {sponsorships && sponsorships.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Sponsored Students</CardTitle>
              <CardDescription>Students you're currently supporting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sponsorships.map((sponsorship) => (
                  <Card key={sponsorship.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-muted" />
                          <div>
                            <p className="font-semibold">
                              {sponsorship.students?.first_name} {sponsorship.students?.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">{sponsorship.students?.grade_level}</p>
                          </div>
                        </div>
                        <div className="text-sm">
                          <p className="text-muted-foreground">
                            KES {sponsorship.amount.toLocaleString()} / {sponsorship.frequency}
                          </p>
                        </div>
                        <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                          <Link href={`/portal/donor/sponsorships/${sponsorship.id}`}>View Progress</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PortalLayout>
  )
}
