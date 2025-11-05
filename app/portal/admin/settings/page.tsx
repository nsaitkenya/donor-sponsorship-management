import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Settings, CreditCard, Building } from "lucide-react"
import { updateSystemSettings } from "@/lib/actions/admin-actions"

export default async function SystemSettings() {
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

  const { data: settings } = await supabase.from("system_settings").select("*").single()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">System Settings</h1>
          <p className="text-muted-foreground">Configure system parameters and preferences</p>
        </div>

        <form action={updateSystemSettings} className="grid gap-6 max-w-4xl">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic system configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_name">Site Name</Label>
                <Input
                  id="site_name"
                  name="site_name"
                  defaultValue={settings?.site_name || "Starehe Boys Centre"}
                  placeholder="Starehe Boys Centre - Donor Management"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    defaultValue={settings?.contact_email || ""}
                    placeholder="info@starehe.ac.ke"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    defaultValue={settings?.contact_phone || ""}
                    placeholder="+254 20 2712903"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Settings
              </CardTitle>
              <CardDescription>Configure M-Pesa payment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mpesa_paybill">M-Pesa Paybill Number</Label>
                  <Input
                    id="mpesa_paybill"
                    name="mpesa_paybill"
                    defaultValue={settings?.mpesa_paybill || ""}
                    placeholder="123456"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mpesa_account">M-Pesa Account Number</Label>
                  <Input
                    id="mpesa_account"
                    name="mpesa_account"
                    defaultValue={settings?.mpesa_account || ""}
                    placeholder="Account Number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Bank Details
              </CardTitle>
              <CardDescription>Bank account information for transfers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bank_name">Bank Name</Label>
                <Input
                  id="bank_name"
                  name="bank_name"
                  defaultValue={settings?.bank_name || ""}
                  placeholder="Kenya Commercial Bank"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bank_account_number">Account Number</Label>
                  <Input
                    id="bank_account_number"
                    name="bank_account_number"
                    defaultValue={settings?.bank_account_number || ""}
                    placeholder="1234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank_account_name">Account Name</Label>
                  <Input
                    id="bank_account_name"
                    name="bank_account_name"
                    defaultValue={settings?.bank_account_name || ""}
                    placeholder="Starehe Boys Centre"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
