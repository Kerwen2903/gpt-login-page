"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Loader2, Scale } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your GPT assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate API call to GPT service
      // In a real implementation, this would call your GPT API endpoint
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 2000)
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about "${userMessage.content}". This is a simulated response from your GPT assistant. In a real implementation, this would connect to your AI service to provide intelligent responses based on your query.`,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("[v0] Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, I encountered an error while processing your request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

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
            <p className="text-sm text-muted-foreground">
              AI-powered conversation
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === "user" ? "bg-secondary" : "bg-primary"
              }`}
            >
              {message.role === "user" ? (
                <User className="h-4 w-4 text-secondary-foreground" />
              ) : (
                <Scale className="h-4 w-4 text-primary-foreground" />
              )}
            </div>

            <Card
              className={`max-w-[80%] p-4 ${
                message.role === "user"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-card text-card-foreground"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </Card>
          </div>
        ))}

        {isLoading && (
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
              disabled={isLoading}
              className="pr-12 bg-input border-border focus:ring-ring"
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? (
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
