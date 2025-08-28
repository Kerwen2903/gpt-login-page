"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Settings, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to your GPT Assistant dashboard. Choose an option below to get started.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-accent" />
                <span>Start Chat</span>
              </CardTitle>
              <CardDescription>Begin a conversation with your AI assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/chat">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Open Chat</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-accent" />
                <span>Usage Stats</span>
              </CardTitle>
              <CardDescription>View your conversation history and usage</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                View Stats
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-accent" />
                <span>Settings</span>
              </CardTitle>
              <CardDescription>Customize your AI assistant preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile">
                <Button variant="outline" className="w-full bg-transparent">
                  Open Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  )
}
