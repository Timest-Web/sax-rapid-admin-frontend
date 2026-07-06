/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";

import { notificationKeys } from "./key";
import {
  adminSendNotification,
  deleteNotification,
  getNotificationCount,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type AdminSendNotificationInput,
  type NotificationDto,
  type NotificationsPage,
  type NotificationsQuery,
  type NotificationCountDto,
} from "./api";

function enabledAuth(status: string, accessToken?: string) {
  return status === "authenticated" && !!accessToken;
}

function enabledAdmin(status: string, accessToken?: string, role?: string) {
  return status === "authenticated" && !!accessToken && role === "Admin";
}

/** Patch list caches */
function patchNotificationInLists(
  qc: ReturnType<typeof useQueryClient>,
  id: string,
  patch: Partial<NotificationDto>,
) {
  qc.setQueriesData<NotificationsPage>(
    { queryKey: notificationKeys.lists() },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        items: old.items.map((n) => (n.id === id ? { ...n, ...patch } : n)),
      };
    },
  );
}

function removeNotificationFromLists(qc: ReturnType<typeof useQueryClient>, id: string) {
  qc.setQueriesData<NotificationsPage>(
    { queryKey: notificationKeys.lists() },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        items: old.items.filter((n) => n.id !== id),
        totalCount: Math.max(0, (old.totalCount ?? 0) - 1),
      };
    },
  );
}

export function useNotifications(query: NotificationsQuery) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;

  return useQuery({
    queryKey: notificationKeys.list(query),
    enabled: enabledAuth(status, accessToken),
    queryFn: () => getNotifications(query),
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  });
}

export function useNotificationCount() {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;

  return useQuery({
    queryKey: notificationKeys.count(),
    enabled: enabledAuth(status, accessToken),
    queryFn: () => getNotificationCount(),
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),

    onMutate: async (id) => {
      const toastId = toast.loading("Marking as read...");
      await qc.cancelQueries({ queryKey: notificationKeys.all });

      const prevCount = qc.getQueryData<NotificationCountDto>(notificationKeys.count());
      patchNotificationInLists(qc, id, { isRead: true, readAt: new Date().toISOString() });
      if (prevCount) {
        qc.setQueryData(notificationKeys.count(), {
          ...prevCount,
          unread: Math.max(0, prevCount.unread - 1),
        });
      }

      return { toastId, prevCount };
    },

    onError: (err, _id, ctx) => {
      if (ctx?.prevCount) qc.setQueryData(notificationKeys.count(), ctx.prevCount);
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },

    onSuccess: (_ok, _id, ctx) => {
      toast.success("Marked as read", { id: ctx?.toastId });
    },

    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsRead(),

    onMutate: async () => {
      const toastId = toast.loading("Marking all as read...");
      await qc.cancelQueries({ queryKey: notificationKeys.all });

      const prevCount = qc.getQueryData<NotificationCountDto>(notificationKeys.count());

      // optimistic: set all list items to read
      qc.setQueriesData<NotificationsPage>(
        { queryKey: notificationKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            unreadCount: 0,
            items: old.items.map((n) =>
              n.isRead ? n : { ...n, isRead: true, readAt: new Date().toISOString() },
            ),
          };
        },
      );

      // optimistic count
      if (prevCount) {
        qc.setQueryData(notificationKeys.count(), { ...prevCount, unread: 0 });
      }

      return { toastId, prevCount };
    },

    onError: (err, _vars, ctx) => {
      if (ctx?.prevCount) qc.setQueryData(notificationKeys.count(), ctx.prevCount);
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },

    onSuccess: (_ok, _vars, ctx) => {
      toast.success("All notifications marked as read", { id: ctx?.toastId });
    },

    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),

    onMutate: async (id) => {
      const toastId = toast.loading("Deleting notification...");
      await qc.cancelQueries({ queryKey: notificationKeys.all });

      const prevCount = qc.getQueryData<NotificationCountDto>(notificationKeys.count());

      // We don’t know if it was unread; best effort:
      removeNotificationFromLists(qc, id);

      return { toastId, prevCount };
    },

    onError: (err, _id, ctx) => {
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },

    onSuccess: (_ok, _id, ctx) => {
      toast.success("Notification deleted", { id: ctx?.toastId });
    },

    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useAdminSendNotification() {
  const qc = useQueryClient();
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useMutation({
    mutationFn: (payload: AdminSendNotificationInput) => adminSendNotification(payload),

    onMutate: () => ({ toastId: toast.loading("Sending notification...") }),

    onSuccess: (_ok, _vars, ctx) => {
      toast.success("Notification sent", { id: ctx?.toastId });
    },

    onError: (err, _vars, ctx) => {
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },

    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}