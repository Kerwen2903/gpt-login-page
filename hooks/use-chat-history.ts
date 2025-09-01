"use client";

import { useState, useEffect, useCallback } from "react";
import type { Conversation, Message, RoomInfo } from "@/types/chat";

export function useChatHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({
    owner_id: 0,
    room_id: 0,
    title: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load conversations from API
  const loadConversations = useCallback(async () => {
    const accessToken = localStorage.getItem("access_token");
    try {
      const response = await fetch("/api/conversations", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      // API returns { message: { rooms: [...] } } or { message: [...] }
      if (data.message?.rooms) {
        setConversations(data.message.rooms);
      } else if (Array.isArray(data.message)) {
        setConversations(data.message);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  }, []);

  // Load messages for a specific conversation
  const loadConversation = useCallback(async (conversationId: string) => {
    const accessToken = localStorage.getItem("access_token");
    try {
      setIsLoading(true);
      const response = await fetch(`/api/conversations/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.conversation) {
        setMessages(data.conversation.messages || []);
        if (data.conversation.room_info) {
          setRoomInfo(data.conversation.room_info);
        }
        setCurrentConversationId(conversationId);
      }
    } catch (error) {
      console.error("Failed to load conversation:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create new conversation
  const createConversation = useCallback(async (title?: string) => {
    const accessToken = localStorage.getItem("access_token");

    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: title || "New Chat",
        }),
      });
      const data = await response.json();
      console.log(data, "----------------------");
      if (data) {
        setConversations((prev) => [
          {
            id: data.metadata.chatroom_id,
            title: data.response,
          },
          ...prev,
        ]);

        setCurrentConversationId(data.metadata.chatroom_id);
        setMessages([]);
        return data.metadata.chatroom_id;
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
    return null;
  }, []);

  // Delete conversation
  const deleteConversation = useCallback(
    async (conversationId: string) => {
      const accessToken = localStorage.getItem("access_token");
      try {
        await fetch(`/api/conversations/${conversationId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setConversations((prev) =>
          prev.filter((c) => c.id !== Number(conversationId))
        );

        if (currentConversationId === conversationId) {
          setCurrentConversationId(null);
          setMessages([]);
        }
      } catch (error) {
        console.error("Failed to delete conversation:", error);
      }
    },
    [currentConversationId]
  );

  // Rename conversation
  const renameConversation = useCallback(
    async (conversationId: string, title: string) => {
      const accessToken = localStorage.getItem("access_token");
      try {
        const response = await fetch(`/api/conversations/${conversationId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ title }),
        });
        const data = await response.json();

        if (data.conversation) {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === Number(conversationId) ? { ...c, title } : c
            )
          );
        }
      } catch (error) {
        console.error("Failed to rename conversation:", error);
      }
    },
    []
  );

  // Send message
  const sendMessage = useCallback(
    async (content: string, conversationId?: string) => {
      const accessToken = localStorage.getItem("access_token");
      const targetConversationId = conversationId || currentConversationId;

      if (!targetConversationId) {
        // Create new conversation if none exists
        const newConversationId = await createConversation(content);
        console.error(newConversationId);
        if (newConversationId) {
          return sendMessage(content, String(newConversationId));
        }
        return;
      }

      try {
        const response = await fetch(`/api/conversations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ title: content, id: targetConversationId }),
        });
        const data = await response.json();
        console.log("--------------", data);
        if (data) {
          setMessages((prev) => [
            ...prev,
            {
              room_id: data.metadata.chatroom_id,
              prompt: content,
              type_user: true,
              created_at: "",
              id: data.metadata.chatroom_id,
            },
            {
              room_id: data.metadata.chatroom_id,
              prompt: data.response,
              type_user: false,
              created_at: "",
              id: data.metadata.chatroom_id,
            },
          ]);

          // Update conversation's last message
          setConversations((prev) =>
            prev.map((c) =>
              c.id === Number(targetConversationId)
                ? {
                    ...c,
                    lastMessage: content,
                    timestamp: new Date().toISOString(),
                  }
                : c
            )
          );
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    },
    [currentConversationId, createConversation]
  );

  // Initialize conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
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
    setMessages,
  };
}
