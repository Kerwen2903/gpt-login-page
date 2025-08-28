"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShouldRedirect(true)
      // Redirect to login after a brief delay to show loading state
      setTimeout(() => {
        window.location.href = "/"
      }, 1000)
    }
  }, [isLoading, isAuthenticated])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-accent" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (shouldRedirect || !isAuthenticated) {
    return (
      fallback || (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-accent" />
            <p className="text-muted-foreground">Redirecting to login...</p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
