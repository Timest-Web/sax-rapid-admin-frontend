import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { approveVendor, rejectVendor, suspendVendor } from "../api";
import { vendorKeys } from "../key";
import { getErrorMessage } from "@/src/lib/get-error";


export function useApproveVendor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vendorId: string) => approveVendor(vendorId),
    onMutate: () => ({ toastId: toast.loading("Approving vendor...") }),
    onSuccess: async (res, vendorId, ctx) => {
      toast.success(res?.message ?? "Vendor approved", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: vendorKeys.all });
      await qc.invalidateQueries({ queryKey: vendorKeys.detail(vendorId) });
    },
    onError: (err, _vendorId, ctx) => {
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },
  });
}

export function useRejectVendor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ vendorId, reason }: { vendorId: string; reason: string }) =>
      rejectVendor(vendorId, reason),
    onMutate: () => ({ toastId: toast.loading("Rejecting vendor...") }),
    onSuccess: async (res, vars, ctx) => {
      toast.success(res?.message ?? "Vendor rejected", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: vendorKeys.all });
      await qc.invalidateQueries({ queryKey: vendorKeys.detail(vars.vendorId) });
    },
    onError: (err, _vars, ctx) => {
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },
  });
}

export function useSuspendVendor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ vendorId, reason }: { vendorId: string; reason: string }) =>
      suspendVendor(vendorId, reason),
    onMutate: () => ({ toastId: toast.loading("Suspending store...") }),
    onSuccess: async (res, vars, ctx) => {
      toast.success(res?.message ?? "Store suspended", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: vendorKeys.all });
      await qc.invalidateQueries({ queryKey: vendorKeys.detail(vars.vendorId) });
    },
    onError: (err, _vars, ctx) => {
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },
  });
}