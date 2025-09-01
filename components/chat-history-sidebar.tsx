"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Edit2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/use-language";
import type { Conversation } from "@/types/chat";

interface ChatHistorySidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
}

export function ChatHistorySidebar({
  conversations,
  currentConversationId,
  onConversationSelect,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
}: ChatHistorySidebarProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleNewChat = () => {
    onNewConversation();
    router.push("/chat");
  };

  const handleConversationClick = (conversationId: string) => {
    onConversationSelect(conversationId);
    router.push(`/chat?room=${conversationId}`);
  };

  const handleRename = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleRenameSubmit = (conversationId: string) => {
    if (editTitle.trim()) {
      onRenameConversation(conversationId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle("");
  };

  const handleDelete = (conversationId: string) => {
    onDeleteConversation(conversationId);
    if (currentConversationId === conversationId) {
      router.push("/chat");
    }
  };

  return (
    <Sidebar className="border-r border-border max-h-[calc(100vh-58px)]">
      <SidebarHeader className="p-4">
        <Button
          onClick={handleNewChat}
          className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("newChat")}
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("chatHistory")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  {t("noConversations")}
                </div>
              ) : (
                conversations.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <SidebarMenuButton
                      isActive={
                        currentConversationId === String(conversation.id)
                      }
                      onClick={() =>
                        handleConversationClick(String(conversation.id))
                      }
                      className="w-full justify-start"
                    >
                      <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                      {editingId === conversation.id ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() =>
                            handleRenameSubmit(String(conversation.id))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleRenameSubmit(String(conversation.id));
                            } else if (e.key === "Escape") {
                              setEditingId(null);
                              setEditTitle("");
                            }
                          }}
                          className="flex-1 bg-transparent border-none outline-none text-sm"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="flex-1 truncate text-left">
                          {conversation.title}
                        </span>
                      )}
                    </SidebarMenuButton>

                    <SidebarMenuAction showOnHover>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleRename(conversation)}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            {t("rename")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDelete(String(conversation.id))
                            }
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t("delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
