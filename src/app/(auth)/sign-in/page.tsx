import { Suspense } from "react";
import AdminLoginView from "@/src/views/auth/sign_in";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminLoginView />
    </Suspense>
  );
}