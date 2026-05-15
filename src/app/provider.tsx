"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import AxiosAuthSync from "./auth_sync";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <AxiosAuthSync />
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}