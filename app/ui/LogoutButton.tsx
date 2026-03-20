"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({ className, children }: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    router.push("/");
    router.refresh();
  }

  return (
    <button className={className} onClick={handleLogout}>
      {children || "Sign Out"}
    </button>
  );
}
