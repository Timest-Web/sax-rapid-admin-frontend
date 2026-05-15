/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

export type ApiResponse<T> = { success: boolean; message: string; data: T };

export type AdminOrderStats = {
  allOrders: number;
  processing: number;
  completed: number;
  disputes: number;
};

export type AdminOrderListItem = {
  orderId: string;      // "ORD-20260506-00005"
  customerName: string;
  productName: string;
  amount: number;
  currency: string;     // "NGN"
  status: string;       // "Pending" | "Confirmed" | ...
  date: string;         // ISO
};

export type AdminOrdersQuery = {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  location?: string;
  currency?: string;     // default NGN
  pageNumber?: number;   // default 1
  pageSize?: number;     // default 20
};

export type OrderUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  productSKU: string;
  variationDetails: {
    id: string;
    sku: string;
    price: number;
    salePrice: number;
    salePriceStartDate: string;
    salePriceEndDate: string;
    effectivePrice: number;
    stockQuantity: number;
    isInStock: boolean;
    attributes: Record<string, string>;
  } | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type OrderDetails = {
  id: string;                 // UUID
  orderNumber: string;        // string (often same as ORD-...)
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subTotal: number;
  taxAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  trackingNumber: string | null;
  createdAt: string;
  paidAt: string | null;
  deliveredAt: string | null;
  user: OrderUser;
  items: OrderItem[];
};

export async function getAdminOrderStats() {
  const res = await apiClient.get<ApiResponse<AdminOrderStats>>("/api/Orders/admin/stats");
  return res.data.data;
}

export async function getAdminOrders(params: AdminOrdersQuery) {
  const res = await apiClient.get<ApiResponse<AdminOrderListItem[]>>("/api/Orders/admin", {
    params: {
      currency: "NGN",
      pageNumber: 1,
      pageSize: 20,
      ...params,
    },
  });
  return res.data.data;
}

export async function getOrderById(orderId: string) {
  const res = await apiClient.get<ApiResponse<OrderDetails>>(`/api/Orders/${orderId}`);
  return res.data.data;
}

export async function updateOrderStatus(orderId: string, status: string) {
  const res = await apiClient.put<ApiResponse<OrderDetails>>(
    `/api/Orders/${orderId}/status`,
    { status }
  );
  return res.data.data;
}

export async function cancelOrder(orderId: string) {
  // Swagger says it returns string, sometimes wrapped.
  const res = await apiClient.post<any>(`/api/Orders/${orderId}/cancel`);
  return (res.data?.data ?? res.data) as string;
}