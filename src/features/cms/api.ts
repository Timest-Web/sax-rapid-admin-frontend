/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

type MaybeWrapped<T> = T | { success: boolean; message: string; data: T };
const unwrap = <T,>(payload: MaybeWrapped<T>): T =>
  (payload as any)?.data ?? (payload as T);

export type CmsStats = {
  totalPages: number;
  publishedPages: number;
  draftPages: number;
  lastUpdated: string; // ISO
};

export type CmsPageListItem = {
  id: string;
  title: string;
  slug: string;
  status: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
};

export type CmsPagesQuery = {
  Status?: string;
  Search?: string;
  DateFrom?: string;
  DateTo?: string;
  PageNumber?: number;
  PageSize?: number;
};

export async function getCmsStats() {
  const res = await apiClient.get<MaybeWrapped<CmsStats>>("/api/admin/cms/stats");
  return unwrap(res.data);
}

export async function getCmsPages(params?: CmsPagesQuery) {
  // swagger says paginated, but your response shows data: CmsPageListItem[]
  const res = await apiClient.get<MaybeWrapped<CmsPageListItem[]>>(
    "/api/admin/cms/pages",
    { params },
  );
  return unwrap(res.data);
}

export type UpsertCmsPageInput = {
  title: string;
  slug: string;
  content: string;
  status: string;
};

export async function createCmsPage(payload: UpsertCmsPageInput) {
  const res = await apiClient.post<MaybeWrapped<CmsPageListItem>>(
    "/api/admin/cms/pages",
    payload,
  );
  return unwrap(res.data);
}

export async function updateCmsPage(pageId: string, payload: UpsertCmsPageInput) {
  const res = await apiClient.put<MaybeWrapped<CmsPageListItem>>(
    `/api/admin/cms/pages/${pageId}`,
    payload,
  );
  return unwrap(res.data);
}

export async function deleteCmsPage(pageId: string) {
  const res = await apiClient.delete<MaybeWrapped<unknown>>(
    `/api/admin/cms/pages/${pageId}`,
  );
  return unwrap(res.data);
}