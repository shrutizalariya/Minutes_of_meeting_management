"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "./ui/Toast";
import ToastTrigger from "./components/ToastTrigger";
import { Suspense } from "react";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ToastProvider>
        <Suspense fallback={null}>
          <ToastTrigger />
        </Suspense>
        {children}
      </ToastProvider>
    </SessionProvider>
  );
}
