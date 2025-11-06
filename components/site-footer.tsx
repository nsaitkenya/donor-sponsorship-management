import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section with Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="https://stareheboyscentre.org/wp-content/uploads/2025/05/Starehe-Boys-Centre-Logo.png"
                alt="Starehe Boys Centre Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
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
                <div className="flex flex-col gap-1">
                  <span>Waruinge Street, Starehe</span>
                  <span>Nairobi, Kenya</span>
                  <span>P.O. Box 30178 00100 GPO</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+254727531001" className="hover:text-foreground transition-colors">
                  +254 727 531 001
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:info@stareheboyscentre.ac.ke" className="hover:text-foreground transition-colors">
                  info@stareheboyscentre.ac.ke
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.tiktok.com/@starehehoys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="TikTok"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.08 1.61 2.89 2.89 0 0 1 4.51-2.86v-3.66a6.62 6.62 0 0 0-6.59 6.61 6.61 6.61 0 0 0 7.97 6.51v-3.66a3.81 3.81 0 0 0 2.41-.81v3.66a8.47 8.47 0 0 1-8.38-8.32 8.46 8.46 0 0 1 8.38-8.32v3.65a4.2 4.2 0 0 0-3.16 1.56v-2.66Z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/stareheboyscentre/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.281-.073-1.689-.073-4.948 0-3.259.014-3.668.072-4.948.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001Z" />
                </svg>
              </a>
              <a
                href="https://x.com/Starehe_Boys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.174-6.72-5.902 6.72h-3.31l7.73-8.835L2.56 2.25h6.772l4.692 6.202 5.48-6.202zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/stareheboyscentre"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
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
            <a
              href="https://nsait.co.ke/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Powered by NSAIT
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
