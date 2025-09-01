export interface Message {
  created_at: string;
  id: number;
  prompt: string;
  room_id: number;
  type_user: boolean;
}
export interface RoomInfo {
  owner_id: number;
  room_id: number;
  title: string;
}

export interface Conversation {
  id: number;
  title: string;
  user_id?: number;
  created_at?: string;
}

export interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  messages: Message[];
  isLoading: boolean;
}
