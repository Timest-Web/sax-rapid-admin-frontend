import ResetPasswordView from "@/src/views/auth/reset_password";
import React, { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <ResetPasswordView />
    </Suspense>
  );
}
