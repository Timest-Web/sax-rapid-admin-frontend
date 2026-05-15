/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://saxrapid.up.railway.app";

type LoginOrRefreshResponse =
  | {
      success?: boolean;
      message?: string;
      data?: any;
    }
  | any; // refresh endpoint sample looks like it returns the object directly

async function refreshAccessToken(token: any) {
  try {
    const res = await axios.post<LoginOrRefreshResponse>(
      `${API_BASE_URL}/api/Auth/refresh-token`,
      { refreshToken: token.refreshToken },
      { headers: { "Content-Type": "application/json" } },
    );

    // normalize response shape (refresh might return object directly or {data})
    const refreshed = res.data?.data ?? res.data;

    return {
      ...token,
      accessToken: refreshed.token,
      refreshToken: refreshed.refreshToken ?? token.refreshToken,
      tokenExpiresAt: refreshed.tokenExpiresAt, // ISO string
      role: refreshed.role ?? token.role,
      // you can also refresh user fields if they can change:
      user: {
        ...(token.user || {}),
        id: refreshed.userId ?? token.user?.id,
        email: refreshed.email ?? token.user?.email,
        firstName: refreshed.firstName ?? token.user?.firstName,
        lastName: refreshed.lastName ?? token.user?.lastName,
      },
      error: undefined,
    };
  } catch (e) {
    // Refresh failed => force re-login
    return { ...token, error: "RefreshAccessTokenError" as const };
  }
}

const handler = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const res = await axios.post(
          `${API_BASE_URL}/api/Auth/login`,
          { email: credentials.email, password: credentials.password },
          { headers: { "Content-Type": "application/json" } },
        );

        const payload = res.data;
        if (!payload?.success) return null;

        const d = payload.data;

        return {
          id: d.userId,
          email: d.email,
          firstName: d.firstName,
          lastName: d.lastName,
          role: d.role,

          accessToken: d.token,
          refreshToken: d.refreshToken,
          tokenExpiresAt: d.tokenExpiresAt,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // 1) First login: store everything in JWT
      if (user) {
        token.user = {
          id: (user as any).id,
          email: (user as any).email,
          firstName: (user as any).firstName,
          lastName: (user as any).lastName,
        };

        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.tokenExpiresAt = (user as any).tokenExpiresAt;
        return token;
      }

      // 2) Subsequent calls: if access token still valid, return it
      const expiresAtMs = token.tokenExpiresAt
        ? new Date(token.tokenExpiresAt as string).getTime()
        : 0;

      // refresh 60s early
      const shouldRefresh = Date.now() >= expiresAtMs - 60_000;

      if (!shouldRefresh) return token;

      // 3) Expired/near-expiry: refresh
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      (session as any).user = token.user;
      (session as any).role = token.role;
      (session as any).accessToken = token.accessToken;
      (session as any).error = token.error; // if refresh fails
      return session;
    },
  },
});

export { handler as GET, handler as POST };
