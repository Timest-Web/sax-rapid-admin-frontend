import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersKeys } from "../keys";
import { activateUser, suspendUser } from "../api";
import { getErrorMessage } from "@/src/lib/get-error";

export function useSuspendUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      suspendUser(userId, reason),

    onMutate: () => {
      const id = toast.loading("Suspending user...");
      return { toastId: id };
    },

    onSuccess: async (res, _vars, ctx) => {
      toast.success(res?.message ?? "User suspended", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: usersKeys.all });
    },

    onError: (err, _vars, ctx) => {
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },
  });
}

export function useActivateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => activateUser(userId),

    onMutate: () => {
      const id = toast.loading("Activating user...");
      return { toastId: id };
    },

    onSuccess: async (res, _vars, ctx) => {
      toast.success(res?.message ?? "User activated", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: usersKeys.all });
    },

    onError: (err, _vars, ctx) => {
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },
  });
}
