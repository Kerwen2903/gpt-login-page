"use client"

import type React from "react"

import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { LogOut, User, MessageSquare, BarChart3 } from "lucide-react"
import Link from "next/link"

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { user, logout } = useAuth()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card border-border">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-foreground">G</span>
                </div>
                <h1 className="text-xl font-semibold text-card-foreground">GPT Assistant</h1>
              </Link>

              <nav className="hidden md:flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-card-foreground">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-card-foreground">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Welcome, {user?.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2 border-border hover:bg-muted bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">{children}</main>
      </div>
    </AuthGuard>
  )
}
