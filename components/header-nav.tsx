"use client"

import type { User } from "@/lib/auth"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import { AuthDialog } from "@/components/auth-dialog"
import Link from "next/link"

interface HeaderNavProps {
  user: User | null
}

export function HeaderNav({ user }: HeaderNavProps) {
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg className="h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="9" strokeWidth="2" />
                <path strokeWidth="2" d="M12 6v6l4 2" />
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground">Horologica</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary">
            Discover
          </Link>
          <Link href="/sellers" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Sellers
          </Link>
          {user && (
            <>
              <Link href="/saved" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Saved
              </Link>
              <Link href="/alerts" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Alerts
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? <UserMenu user={user} /> : <Button onClick={() => setAuthOpen(true)}>Sign In</Button>}
        </div>
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  )
}
