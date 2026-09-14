"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Catches errors thrown while rendering any page nested under the (app)
 * route group (dashboard, members, meetings, payments, levies, reports).
 * Renders inside the Shell, so the sidebar/topbar stay usable.
 */
export default function AppSegmentError({
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-3 text-4xl">⚠️</div>
      <div className="font-serif text-[22px] font-bold text-ink">Something went wrong</div>
      <div className="mt-2 max-w-sm text-sm text-muted">
        We ran into a problem loading this page. You can try again, or head back to your
        dashboard.
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
          href="/dashboard"
          className="rounded-md bg-chip-bg px-5 py-2.5 text-sm font-semibold text-ink no-underline"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
