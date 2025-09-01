"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Loader2, MessageSquare, Scale } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import type { Message } from "@/types/chat";

interface ChatInterfaceProps {
  messages?: Message[];
  onSendMessage?: (content: string) => Promise<void>;
  isLoading?: boolean;
  showSidebar?: boolean;
  currentConversationId?: string | null;
}

export function ChatInterface({
  messages = [],
  onSendMessage,
  isLoading = false,
  showSidebar = false,
  currentConversationId,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { t } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const messageContent = input.trim();
    setInput("");
    setIsSending(true);

    try {
      if (onSendMessage) {
        await onSendMessage(messageContent);
      } else {
        // Fallback to original implementation for backward compatibility
        console.log("[v0] No onSendMessage handler provided");
      }
    } catch (error) {
      console.error("[v0] Chat error:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (!showSidebar || !currentConversationId) {
    return (
      <div className="flex flex-col h-full bg-background mx-auto">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-4">
              {t("newChat")}
            </h1>
            <p className="text-muted-foreground mb-8">
              Start a conversation with your GPT assistant
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                disabled={isSending}
                className="w-full"
              />
              <Button
                type="submit"
                disabled={!input.trim() || isSending}
                className="w-full"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  if (isLoading) {
    return <div>Loading</div>;
  }
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Scale className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-card-foreground">
              GPT Assistant
            </h1>
            <p className="text-sm text-muted-foreground">{}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Start a conversation...</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type_user ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type_user ? "bg-secondary" : "bg-primary"
                }`}
              >
                {message.type_user ? (
                  <User className="h-4 w-4 text-secondary-foreground" />
                ) : (
                  <Scale className="h-4 w-4 text-primary-foreground" />
                )}
              </div>

              <Card
                className={`max-w-[80%] p-4 ${
                  message.type_user
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-card text-card-foreground"
                }`}
              >
                <p
                  dangerouslySetInnerHTML={{ __html: message.prompt }}
                  className="text-sm leading-relaxed"
                ></p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </Card>
            </div>
          ))
        )}

        {(isLoading || isSending) && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Scale className="h-4 w-4 text-primary-foreground" />
            </div>
            <Card className="bg-card text-card-foreground p-4">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Assistant is typing...
                </p>
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t bg-card px-6 py-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              disabled={isSending}
              className="pr-12 bg-input border-border focus:ring-ring"
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || isSending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-2 text-center">
          GPT Assistant can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  );
}
