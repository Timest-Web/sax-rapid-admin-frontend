/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

export type ApiResponse<T> = { success: boolean; message: string; data: T };

function unwrap<T>(payload: ApiResponse<T> | T): T {
  return (payload as any)?.data ?? (payload as T);
}

export type ChatMessage = {
  id: string;
  conversationId: string;

  senderId: string;
  senderName: string;
  senderImageUrl: string | null;

  content: string | null;
  imageUrl: string | null;

  isRead: boolean;
  isFlagged: boolean;

  createdAt: string;
};

export type Conversation = {
  id: string;

  buyerId: string;
  buyerName: string;
  buyerImageUrl: string | null;

  vendorId: string;
  vendorName: string;
  vendorImageUrl: string | null;

  orderId: string;

  lastMessage: ChatMessage | null;
  unreadCount: number;

  createdAt: string;
  lastMessageAt: string | null;
};

export type UnreadCountResponse = { unreadCount: number };

export async function startOrGetConversation(payload: {
  vendorId: string;
  orderId: string; // can be "ORD-..." (backend resolves) or uuid depending on your system
  initialMessage: string;
}) {
  const res = await apiClient.post<ApiResponse<Conversation>>(
    "/api/Chat/conversations",
    payload,
  );
  return res.data.data;
}

export async function getConversations() {
  const res = await apiClient.get<ApiResponse<Conversation[]>>(
    "/api/Chat/conversations",
  );
  return res.data.data;
}

export async function getConversation(conversationId: string) {
  const res = await apiClient.get<ApiResponse<Conversation>>(
    `/api/Chat/conversations/${conversationId}`,
  );
  return res.data.data;
}

// IMPORTANT: your real response is an ARRAY (not paginated object)
export async function getMessages(conversationId: string, page = 1, pageSize = 50) {
  const res = await apiClient.get<ApiResponse<ChatMessage[]>>(
    `/api/Chat/conversations/${conversationId}/messages`,
    { params: { page, pageSize } },
  );
  return res.data.data;
}

export async function sendMessage(payload: {
  conversationId: string; // MUST be conversation.id, not message.id
  content: string;
  imageUrl?: string | null;
}) {
  const res = await apiClient.post<ApiResponse<ChatMessage>>(
    "/api/Chat/messages",
    payload,
  );
  return res.data.data;
}

export async function markRead(conversationId: string) {
  const res = await apiClient.patch<ApiResponse<boolean>>(
    `/api/Chat/conversations/${conversationId}/read`,
  );
  return res.data.data;
}

export async function getUnreadCount() {
  const res = await apiClient.get<ApiResponse<UnreadCountResponse>>(
    "/api/Chat/unread-count",
  );
  return res.data.data; // { unreadCount: number }
}

export async function flagMessage(messageId: string) {
  const res = await apiClient.patch<ApiResponse<boolean>>(
    `/api/Chat/messages/${messageId}/flag`,
  );
  return res.data.data;
}