import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PortalHeader } from "@/components/portal-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { updateDonorProfile } from "@/lib/actions/donor-actions"

export default async function DonorProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  const { data: donor } = await supabase.from("donors").select("*").eq("user_id", user.id).single()

  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader userEmail={user.email} userName={profile?.full_name || undefined} />

      <main className="flex-1 bg-muted/30">
        <div className="container py-8 max-w-3xl">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/portal/donor">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Edit Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={updateDonorProfile} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input id="full_name" name="full_name" defaultValue={profile?.full_name || ""} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" defaultValue={profile?.phone || ""} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization_name">Organization Name (Optional)</Label>
                  <Input
                    id="organization_name"
                    name="organization_name"
                    defaultValue={donor?.organization_name || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" defaultValue={donor?.address || ""} />
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" defaultValue={donor?.city || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" defaultValue={donor?.country || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input id="postal_code" name="postal_code" defaultValue={donor?.postal_code || ""} />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
