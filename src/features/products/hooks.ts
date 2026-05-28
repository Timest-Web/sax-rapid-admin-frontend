/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
    createProduct,
    CreateProductInput,
    deleteProduct,
  getAdminProducts,
  getProductById,
  getProductsByVendor,
  updateProduct,
  UpdateProductInput,
  VendorProductsQuery,
  type AdminProductsQuery,
} from "./api";
import { productKeys } from "./key";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";
import {
  approveAdminProduct,
  rejectAdminProduct,
  flagAdminProduct,
  type AdminProductListItem,
  type Paginated,
  type ProductDetails,
} from "./api";

export function useAdminProducts(query: AdminProductsQuery) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: productKeys.list(query),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getAdminProducts(query),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}

export function useProduct(productId?: string) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;

  return useQuery({
    queryKey: productId
      ? productKeys.detail(productId)
      : ["admin-products", "detail", "missing"],
    enabled: !!productId && status === "authenticated" && !!accessToken,
    queryFn: () => getProductById(productId!),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

function patchLists(
  qc: ReturnType<typeof useQueryClient>,
  productId: string,
  patch: (p: AdminProductListItem) => AdminProductListItem,
) {
  qc.setQueriesData<Paginated<AdminProductListItem>>(
    { queryKey: productKeys.lists() },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        items: old.items.map((p) => (p.id === productId ? patch(p) : p)),
      };
    },
  );
}

export function useApproveProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => approveAdminProduct(productId),
    onMutate: () => ({ toastId: toast.loading("Approving product...") }),
    onSuccess: (res, productId, ctx) => {
      toast.success(res?.message ?? "Product approved", { id: ctx?.toastId });

      // patch lists
      patchLists(qc, productId, (p) => ({
        ...p,
        status: "Active",
        rejectionReason: null,
      }));

      // patch detail (if loaded)
      qc.setQueryData<ProductDetails>(productKeys.detail(productId), (old) =>
        old ? { ...old, status: "Active", isActive: true } : old,
      );
    },
    onError: (err, _productId, ctx) =>
      toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useRejectProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      reason,
    }: {
      productId: string;
      reason: string;
    }) => rejectAdminProduct(productId, reason),
    onMutate: () => ({ toastId: toast.loading("Rejecting product...") }),
    onSuccess: (res, vars, ctx) => {
      toast.success(res?.message ?? "Product rejected", { id: ctx?.toastId });

      patchLists(qc, vars.productId, (p) => ({
        ...p,
        status: "Rejected",
        rejectionReason: vars.reason,
      }));

      qc.setQueryData<ProductDetails>(
        productKeys.detail(vars.productId),
        (old) => (old ? { ...old, status: "Rejected" } : old),
      );
    },
    onError: (err, _vars, ctx) =>
      toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useFlagProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => flagAdminProduct(productId),
    onMutate: () => ({ toastId: toast.loading("Flagging product...") }),
    onSuccess: (res, productId, ctx) => {
      toast.success(res?.message ?? "Product flagged", { id: ctx?.toastId });

      patchLists(qc, productId, (p) => ({ ...p, status: "Pending" }));

      qc.setQueryData<ProductDetails>(productKeys.detail(productId), (old) =>
        old ? { ...old, status: "Pending" } : old,
      );
    },
    onError: (err, _productId, ctx) =>
      toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}



export function useCreateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductInput) => createProduct(payload),
    onMutate: () => ({ toastId: toast.loading("Creating product...") }),
    onSuccess: async (created, _vars, ctx) => {
      toast.success("Product created", { id: ctx?.toastId });

      // seed detail cache
      qc.setQueryData<ProductDetails>(productKeys.detail(created.id), created);

      // simplest (and correct): refresh lists
      await qc.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (err, _vars, ctx) => {
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, payload }: { productId: string; payload: UpdateProductInput }) =>
      updateProduct(productId, payload),
    onMutate: () => ({ toastId: toast.loading("Saving changes...") }),
    onSuccess: async (updated, _vars, ctx) => {
      toast.success("Product updated", { id: ctx?.toastId });

      qc.setQueryData<ProductDetails>(productKeys.detail(updated.id), updated);
      await qc.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (err, _vars, ctx) => {
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onMutate: () => ({ toastId: toast.loading("Deleting product...") }),
    onSuccess: async (_res, productId, ctx) => {
      toast.success("Product deleted", { id: ctx?.toastId });

      qc.removeQueries({ queryKey: productKeys.detail(productId) });
      await qc.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (err, _vars, ctx) => {
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },
  });
}


export function useAdminProductCount(statusFilter?: "Pending" | "Rejected" | "Active") {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: productKeys.count(statusFilter),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: async () => {
      const res = await getAdminProducts({
        pageNumber: 1,
        pageSize: 1, // we only need totalCount
        status: statusFilter,
      });
      return res.totalCount ?? 0;
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useVendorProducts(userId?: string, query?: VendorProductsQuery) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey:
      userId && query
        ? productKeys.vendorProducts(userId, query)
        : ["admin-products", "vendor-products", "missing"],
    enabled: status === "authenticated" && !!accessToken && role === "Admin" && !!userId && !!query,
    queryFn: () => getProductsByVendor(userId!, query!),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}
