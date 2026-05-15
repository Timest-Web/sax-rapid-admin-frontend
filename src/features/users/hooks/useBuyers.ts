/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { usersKeys } from "../keys";
import { getBuyers } from "../api";


export function useBuyers(params?: { page?: number; pageSize?: number }) {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;

  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: usersKeys.list({ role: "Buyer", page, pageSize }),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getBuyers(page, pageSize),

    // Optimization knobs:
    staleTime: 60_000,      // treat data as fresh for 1 minute (no refetch spam)
    gcTime: 10 * 60_000,    // keep in cache for 10 mins after unused
    refetchOnWindowFocus: false,
  });
}