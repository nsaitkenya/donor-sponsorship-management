"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PortalHeader } from "@/components/portal-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DonatePage() {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [donationType, setDonationType] = useState("one_time")
  const [paymentMethod, setPaymentMethod] = useState("mpesa")
  const [message, setMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const presetAmounts = ["1000", "5000", "10000", "25000", "50000"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Get donor profile
      const { data: donor } = await supabase.from("donors").select("id").eq("user_id", user.id).single()

      if (!donor) throw new Error("Donor profile not found")

      const finalAmount = amount === "custom" ? Number.parseFloat(customAmount) : Number.parseFloat(amount)

      if (!finalAmount || finalAmount <= 0) {
        throw new Error("Please enter a valid amount")
      }

      // Create donation record
      const { error: donationError } = await supabase.from("donations").insert({
        donor_id: donor.id,
        amount: finalAmount,
        currency: "KES",
        donation_type: donationType,
        payment_method: paymentMethod,
        payment_status: "pending",
        is_anonymous: isAnonymous,
        message: message || null,
        transaction_reference: `TXN-${Date.now()}`,
      })

      if (donationError) throw donationError

      // Redirect to success page
      router.push("/portal/donor/donate/success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader />

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
              <CardTitle className="text-2xl">Make a Donation</CardTitle>
              <CardDescription>Your contribution transforms lives through education</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount Selection */}
                <div className="space-y-3">
                  <Label>Select Amount (KES)</Label>
                  <RadioGroup value={amount} onValueChange={setAmount}>
                    <div className="grid grid-cols-3 gap-3">
                      {presetAmounts.map((preset) => (
                        <div key={preset}>
                          <RadioGroupItem value={preset} id={preset} className="peer sr-only" />
                          <Label
                            htmlFor={preset}
                            className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            {Number.parseInt(preset).toLocaleString()}
                          </Label>
                        </div>
                      ))}
                      <div>
                        <RadioGroupItem value="custom" id="custom" className="peer sr-only" />
                        <Label
                          htmlFor="custom"
                          className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          Custom
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                  {amount === "custom" && (
                    <Input
                      type="number"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      min="1"
                    />
                  )}
                </div>

                {/* Donation Type */}
                <div className="space-y-3">
                  <Label>Donation Type</Label>
                  <RadioGroup value={donationType} onValueChange={setDonationType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="one_time" id="one_time" />
                      <Label htmlFor="one_time" className="cursor-pointer">
                        One-time Donation
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="recurring" id="recurring" />
                      <Label htmlFor="recurring" className="cursor-pointer">
                        Monthly Recurring
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Payment Method */}
                <div className="space-y-3">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mpesa">M-Pesa</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div className="space-y-3">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Share why you're donating or leave a message of encouragement"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Anonymous */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="anonymous" className="cursor-pointer">
                    Make this donation anonymous
                  </Label>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Proceed to Payment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
