/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
};

export type MaybeWrapped<T> = T | ApiResponse<T>;

function unwrap<T>(payload: MaybeWrapped<T>): T {
  return (payload as any)?.data ?? (payload as T);
}

export type NotificationDto = {
  id: string;
  title: string;
  body: string;
  type: string;
  referenceId: string | null;
  referenceType: string | null;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
};

export type NotificationsPage = {
  items: NotificationDto[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  unreadCount: number;
};

export type NotificationCountDto = {
  total: number;
  unread: number;
};

export type NotificationsQuery = {
  page: number;
  pageSize: number;
  unreadOnly?: boolean;
};

export async function getNotifications(query: NotificationsQuery) {
  const res = await apiClient.get<ApiResponse<NotificationsPage>>("/api/Notifications", {
    params: {
      page: query.page,
      pageSize: query.pageSize,
      unreadOnly: query.unreadOnly ?? false,
    },
  });
  return unwrap(res.data);
}

export async function getNotificationCount() {
  const res = await apiClient.get<ApiResponse<NotificationCountDto>>(
    "/api/Notifications/count",
  );
  return unwrap(res.data);
}

export async function markNotificationRead(notificationId: string) {
  const res = await apiClient.patch<ApiResponse<boolean> | any>(
    `/api/Notifications/${notificationId}/read`,
  );
  return unwrap(res.data);
}

export async function markAllNotificationsRead() {
  const res = await apiClient.patch<ApiResponse<boolean> | any>(
    "/api/Notifications/read-all",
  );
  return unwrap(res.data);
}

export async function deleteNotification(notificationId: string) {
  const res = await apiClient.delete<ApiResponse<boolean> | any>(
    `/api/Notifications/${notificationId}`,
  );
  return unwrap(res.data);
}

/** Admin send (NOT broadcast) */
export type AdminSendNotificationInput = {
  userId: string;
  title: string;
  body: string;
  type: string;
  referenceId?: string;
  referenceType?: string;
};

export async function adminSendNotification(payload: AdminSendNotificationInput) {
  const res = await apiClient.post<ApiResponse<boolean> | any>(
    "/api/Notifications/admin/send",
    payload,
  );
  return unwrap(res.data);
}