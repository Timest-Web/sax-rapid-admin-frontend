/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { categoryKeys } from "./key";
import { getCategoryTree } from "./api";
import { getErrorMessage } from "@/src/lib/get-error";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  type CreateCategoryInput,
  type UpdateCategoryInput,
  type CategoryNode,
} from "./api";
import { toast } from "sonner";

export function useCategoryTree() {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: categoryKeys.tree(),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getCategoryTree(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}


export function useCreateCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryInput) => createCategory(payload),
    onMutate: () => ({ toastId: toast.loading("Creating category...") }),
    onSuccess: async (created: CategoryNode, _vars, ctx) => {
      toast.success("Category created", { id: ctx?.toastId });
      qc.setQueryData(categoryKeys.detail(created.id), created);
      await qc.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCategoryInput }) =>
      updateCategory(id, payload),
    onMutate: () => ({ toastId: toast.loading("Updating category...") }),
    onSuccess: async (updated: CategoryNode, _vars, ctx) => {
      toast.success("Category updated", { id: ctx?.toastId });
      qc.setQueryData(categoryKeys.detail(updated.id), updated);
      await qc.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onMutate: () => ({ toastId: toast.loading("Deleting category...") }),
    onSuccess: async (_res, id, ctx) => {
      toast.success("Category deleted", { id: ctx?.toastId });
      qc.removeQueries({ queryKey: categoryKeys.detail(id) });
      await qc.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}