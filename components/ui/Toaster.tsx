"use client";

import { useEffect, useState } from "react";
import { subscribeToasts, dismissToast, type ToastMessage } from "@/lib/toast";

export function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => subscribeToasts(setToasts), []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-100 flex w-[min(340px,calc(100vw-2.5rem))] flex-col gap-2.5">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => dismissToast(t.id)}
          role={t.variant === "error" ? "alert" : "status"}
          className="cursor-pointer rounded-md border px-4 py-3 text-sm font-medium shadow-sm"
          style={
            t.variant === "success"
              ? {
                  background: "var(--color-green-bg)",
                  color: "var(--color-green)",
                  borderColor: "var(--color-green-bg)",
                }
              : {
                  background: "var(--color-red-bg)",
                  color: "var(--color-terracotta)",
                  borderColor: "var(--color-red-bg)",
                }
          }
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
