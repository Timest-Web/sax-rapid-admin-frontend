/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

type MaybeWrapped<T> = T | { success: boolean; message: string; data: T };
const unwrap = <T,>(payload: MaybeWrapped<T>): T =>
  (payload as any)?.data ?? (payload as T);

export type PromotionStats = {
  totalCampaigns: number;
  activeCampaigns: number;
  totalBudgetSpent: number;
  totalImpressions: number;
  currency: string;
};

export type CampaignStatus = { id: number; name: string };

export type CampaignListItem = {
  id: string; // uuid
  campaignId: string; // CAM-001
  name: string;
  vendorName: string;
  budget: number;
  currency: string;
  impressions: number;
  status: CampaignStatus; // {id,name}
  adType: string;
  startDate: string;
  endDate: string;
  createdAt: string;
};

export type CampaignsQuery = {
  Status?: string;
  DateFrom?: string;
  DateTo?: string;
  AdType?: string;
  PageNumber?: number;
  PageSize?: number;
};

export async function getPromotionStats() {
  const res = await apiClient.get<MaybeWrapped<PromotionStats>>(
    "/api/admin/promotions/stats",
  );
  return unwrap(res.data);
}

export async function getCampaigns(params?: CampaignsQuery) {
  // Swagger says paginated, but your response shows: data: CampaignListItem[]
  const res = await apiClient.get<MaybeWrapped<CampaignListItem[]>>(
    "/api/admin/promotions/campaigns",
    { params },
  );
  return unwrap(res.data);
}

export type CreateCampaignInput = {
  name: string;
  tagline: string;
  headline: string;
  subHeadline: string;
  backgroundImageUrl: string;
  themeColorHex: string;
  callToActionText: string;
  targetUrl: string;
  badgeTitle: string;
  badgeSubtitle: string;
  description: string;
  budget: number;
  currency: string;
  startDate: string; // ISO
  endDate: string;   // ISO
  vendorId: string;  // uuid
  targetAudience: string;
  adType: string;
};

export async function createCampaign(payload: CreateCampaignInput) {
  const res = await apiClient.post<MaybeWrapped<unknown>>(
    "/api/admin/promotions/campaigns",
    payload,
  );
  return unwrap(res.data);
}

export async function updateCampaignStatus(campaignId: string, status: string) {
  const res = await apiClient.patch<MaybeWrapped<unknown>>(
    `/api/admin/promotions/campaigns/${campaignId}/status`,
    { status },
  );
  return unwrap(res.data);
}

export type UpdateCampaignInput = {
  name: string;
  tagline: string;
  headline: string;
  subHeadline: string;
  backgroundImageUrl: string;
  themeColorHex: string;
  callToActionText: string;
  targetUrl: string;
  badgeTitle: string;
  badgeSubtitle: string;
  description: string;
  budget: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: string;
  adType: string;
};

export async function updateCampaign(campaignId: string, payload: UpdateCampaignInput) {
  const res = await apiClient.put<MaybeWrapped<unknown>>(
    `/api/admin/promotions/campaigns/${campaignId}`,
    payload,
  );
  return unwrap(res.data);
}