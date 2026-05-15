/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { setAccessToken } from "../lib/axios";

export default function AxiosAuthSync() {
  const { data: session } = useSession();

  const token = (session as any)?.accessToken as string | undefined;

  useEffect(() => {
    setAccessToken(token);
  }, [token]);

  return null;
}
