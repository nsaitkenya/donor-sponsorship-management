import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { PortalHeader } from "@/components/portal-header"

export default function DonationSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader />

      <main className="flex-1 bg-muted/30 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle className="h-10 w-10" />
              </div>
            </div>
            <CardTitle className="text-2xl">Thank You for Your Donation!</CardTitle>
            <CardDescription className="text-base">
              Your generous contribution is making a real difference in a student's life. You'll receive a confirmation
              email shortly with your donation receipt.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">What happens next?</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>You'll receive a tax-deductible receipt via email</li>
                <li>Your donation will be processed within 24 hours</li>
                <li>Track your impact in your donor dashboard</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link href="/portal/donor">Back to Dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/portal/donor/donate">Make Another Donation</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
