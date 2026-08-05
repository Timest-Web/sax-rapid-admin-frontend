/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";

import { chatKeys } from "./key";
import {
  flagMessage,
  getConversation,
  getConversations,
  getMessages,
  getUnreadCount,
  markRead,
  sendMessage,
  startOrGetConversation,
  type ChatMessage,
} from "./api";

function hasAnyRole(role: unknown, allowed: string[]) {
  if (!role) return false;
  if (Array.isArray(role)) return role.some((r) => allowed.includes(String(r)));
  return allowed.includes(String(role));
}

function useEnabledAdmin() {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role;

  const enabled =
    status === "authenticated" &&
    !!accessToken &&
    hasAnyRole(role, ["SuperAdmin", "Admin", "Account", "Sales"]);

  return { enabled };
}

export function useConversations() {
  const { enabled } = useEnabledAdmin();
  return useQuery({
    queryKey: chatKeys.conversations(),
    enabled,
    queryFn: getConversations,
    staleTime: 10_000,
    refetchOnWindowFocus: false,
    refetchInterval: 10_000, // inbox polling (optional)
  });
}

export function useConversation(conversationId?: string) {
  const { enabled } = useEnabledAdmin();
  return useQuery({
    queryKey: conversationId ? chatKeys.conversation(conversationId) : ["admin-chat", "conversation", "missing"],
    enabled: enabled && !!conversationId,
    queryFn: () => getConversation(conversationId!),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useMessages(conversationId?: string, page = 1, pageSize = 50) {
  const { enabled } = useEnabledAdmin();
  return useQuery({
    queryKey: conversationId ? [chatKeys.messages(conversationId), page, pageSize] : ["admin-chat", "messages", "missing"],
    enabled: enabled && !!conversationId,
    queryFn: () => getMessages(conversationId!, page, pageSize),
    staleTime: 1_000,
    refetchOnWindowFocus: false,
    refetchInterval: 2_000, // conversation polling (optional)
  });
}

export function useUnreadCount() {
  const { enabled } = useEnabledAdmin();
  return useQuery({
    queryKey: chatKeys.unreadCount(),
    enabled,
    queryFn: getUnreadCount,
    staleTime: 5_000,
    refetchOnWindowFocus: false,
    refetchInterval: 7_000,
  });
}

export function useStartConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: startOrGetConversation,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: chatKeys.conversations() });
      await qc.invalidateQueries({ queryKey: chatKeys.unreadCount() });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sendMessage,

    onMutate: async (vars) => {
      // lightweight optimistic append (optional but nice)
      const temp: ChatMessage = {
        id: `temp-${Date.now()}`,
        conversationId: vars.conversationId,
        senderId: "me",
        senderName: "You",
        senderImageUrl: null,
        content: vars.content,
        imageUrl: vars.imageUrl ?? null,
        isRead: true,
        isFlagged: false,
        createdAt: new Date().toISOString(),
      };

      const key = [chatKeys.messages(vars.conversationId), 1, 50];
      const prev = qc.getQueryData<ChatMessage[]>(key);

      qc.setQueryData<ChatMessage[]>(key, (old) => (old ? [...old, temp] : [temp]));
      return { prev, key };
    },

    onError: (err, _vars, ctx) => {
      if (ctx?.prev) (qc as any).setQueryData(ctx.key, ctx.prev);
      toast.error(getErrorMessage(err));
    },

    onSuccess: async (_msg, vars) => {
      await qc.invalidateQueries({ queryKey: chatKeys.conversations() });
      await qc.invalidateQueries({ queryKey: chatKeys.unreadCount() });
      await qc.invalidateQueries({ queryKey: chatKeys.messages(vars.conversationId) });
    },
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) => markRead(conversationId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: chatKeys.conversations() });
      await qc.invalidateQueries({ queryKey: chatKeys.unreadCount() });
    },
  });
}

export function useFlagMessage() {
  return useMutation({
    mutationFn: (messageId: string) => flagMessage(messageId),
    onSuccess: () => toast.success("Message flagged"),
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}