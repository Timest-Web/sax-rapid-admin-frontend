import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    tokenExpiresAt?: string;
    user?: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      role?: string;
    };
  }
}