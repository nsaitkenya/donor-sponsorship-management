import type React from "react"
import { PortalHeader } from "./portal-header"
import { PortalNav } from "./portal-nav"

interface PortalLayoutProps {
  children: React.ReactNode
  userEmail?: string
  userName?: string
  userRole?: string
}

export function PortalLayout({ children, userEmail, userName, userRole = "donor" }: PortalLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader userEmail={userEmail} userName={userName} userRole={userRole} />
      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 border-r bg-muted/40">
          <PortalNav role={userRole} />
        </aside>
        <main className="flex-1 bg-muted/30">
          <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
