"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { ChatInterface } from "@/components/chat-interface"

export default function ChatPage() {
  return (
    <ProtectedLayout>
      <div className="h-[calc(100vh-120px)]">
        <ChatInterface />
      </div>
    </ProtectedLayout>
  )
}
