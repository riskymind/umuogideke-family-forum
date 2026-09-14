"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Root-level error boundary. Catches errors thrown outside the (app) route
 * group (e.g. the redirect on "/", the login page) and errors thrown by the
 * (app) layout itself (session/member lookups), which sit above
 * app/(app)/error.tsx and so aren't caught by it.
 */
export default function RootError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-1 bg-cream p-6 text-center">
      <div className="mb-2 text-4xl">⚠️</div>
      <div className="font-serif text-[22px] font-bold text-ink">Something went wrong</div>
      <div className="mt-1 max-w-sm text-sm text-muted">
        The Umuogideke Family Forum ran into a problem. You can try again, or sign in again.
      </div>
      {error.digest && (
        <div className="mt-2 text-xs text-muted-light">Reference: {error.digest}</div>
      )}
      <div className="mt-6 flex gap-2.5">
        <button
          onClick={() => retry()}
          className="rounded-md bg-terracotta px-5 py-2.5 text-sm font-semibold text-cream cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/login"
          className="rounded-md bg-chip-bg px-5 py-2.5 text-sm font-semibold text-ink no-underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
