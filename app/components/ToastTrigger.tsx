"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useToast } from "@/app/ui/Toast";

export default function ToastTrigger() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const info = searchParams.get("info");

    if (success) {
      showToast(success, "success");
      removeParam("success");
    } else if (error) {
      showToast(error, "error");
      removeParam("error");
    } else if (info) {
      showToast(info, "info");
      removeParam("info");
    }

    function removeParam(key: string) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl);
    }
  }, [searchParams, pathname, router, showToast]);

  return null;
}
