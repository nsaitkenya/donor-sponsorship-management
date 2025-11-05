"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
            SBC
          </div>
          <span className="font-semibold text-lg hidden sm:inline-block">Starehe Boys Centre</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/campaigns"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Campaigns
          </Link>
          <Link
            href="/students"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Students
          </Link>
          <Link
            href="/impact"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Impact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-up">Donate Now</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <nav className="container flex flex-col gap-4 py-4">
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/campaigns"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Campaigns
            </Link>
            <Link
              href="/students"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Students
            </Link>
            <Link
              href="/impact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Impact
            </Link>
            <Link
              href="/auth/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors sm:hidden"
            >
              Sign In
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
