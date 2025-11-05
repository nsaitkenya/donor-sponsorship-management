import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                SBC
              </div>
              <span className="font-semibold">Starehe Boys Centre</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Transforming lives through education and empowering young men to become leaders of tomorrow.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
              <Link href="/campaigns" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Campaigns
              </Link>
              <Link href="/students" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Students
              </Link>
              <Link href="/impact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Our Impact
              </Link>
            </nav>
          </div>

          {/* Get Involved */}
          <div className="space-y-4">
            <h3 className="font-semibold">Get Involved</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/auth/sign-up"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Become a Donor
              </Link>
              <Link href="/students" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sponsor a Student
              </Link>
              <Link href="/campaigns" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Support a Campaign
              </Link>
              <Link
                href="/portal/donor"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Donor Portal
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Us</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Starehe Boys Centre, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+254 700 000 000</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>info@starehe.ac.ke</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Starehe Boys Centre. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
