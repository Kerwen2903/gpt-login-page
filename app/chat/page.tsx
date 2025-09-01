"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ProtectedLayout } from "@/components/protected-layout";
import { ChatInterface } from "@/components/chat-interface";
import { ChatHistorySidebar } from "@/components/chat-history-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useChatHistory } from "@/hooks/use-chat-history";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room");

  const {
    conversations,
    currentConversationId,
    messages,
    isLoading,
    loadConversation,
    createConversation,
    deleteConversation,
    renameConversation,
    sendMessage,
    setCurrentConversationId,
  } = useChatHistory();

  useEffect(() => {
    if (roomId && roomId !== currentConversationId) {
      loadConversation(roomId);
    } else if (!roomId && currentConversationId) {
      setCurrentConversationId(null);
    }
  }, [
    roomId,
    currentConversationId,
    loadConversation,
    setCurrentConversationId,
  ]);

  const handleNewConversation = async () => {
    await createConversation();
  };

  const handleConversationSelect = (conversationId: string) => {
    loadConversation(conversationId);
  };

  return (
    <ProtectedLayout>
      <SidebarProvider defaultOpen={conversations.length > 0}>
        <div className="flex w-full">
          {conversations.length > 0 && (
            <ChatHistorySidebar
              conversations={conversations}
              currentConversationId={currentConversationId}
              onConversationSelect={handleConversationSelect}
              onNewConversation={handleNewConversation}
              onDeleteConversation={deleteConversation}
              onRenameConversation={renameConversation}
            />
          )}

          <SidebarInset className="flex-1">
            <ChatInterface
              messages={messages}
              onSendMessage={sendMessage}
              isLoading={isLoading}
              showSidebar={conversations.length > 0}
              currentConversationId={currentConversationId}
            />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProtectedLayout>
  );
}
