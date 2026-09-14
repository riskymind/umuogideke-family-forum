"use client";

import "./globals.css";

/**
 * Catches errors thrown by the root layout itself. Must render its own
 * <html>/<body> since it replaces the root layout when active — global
 * styles are re-imported above, but next/font isn't loaded here, so this
 * falls back to the serif/sans stacks defined alongside --font-serif and
 * --font-sans in globals.css.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-1 bg-cream p-6 text-center">
          <div className="mb-2 text-4xl">⚠️</div>
          <div className="font-serif text-[22px] font-bold text-ink">
            The Umuogideke Family Forum is unavailable
          </div>
          <div className="mt-1 max-w-sm text-sm text-muted">
            Something went wrong while loading the app. Please try again.
          </div>
          {error.digest && (
            <div className="mt-2 text-xs text-muted-light">Reference: {error.digest}</div>
          )}
          <button
            onClick={() => retry()}
            className="mt-6 rounded-md bg-terracotta px-5 py-2.5 text-sm font-semibold text-cream cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
