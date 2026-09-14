"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/gsap";

type ScopeRef = RefObject<HTMLElement | null>;

/**
 * Thin wrapper around `useGSAP` that resolves the user's reduced-motion
 * preference once per run and hands it to the callback, so every animation
 * component checks it the same way instead of re-implementing the guard.
 *
 * Cleanup follows `useGSAP`'s own context rules: return a function from
 * `callback` (e.g. `tl.kill`) and it runs automatically on unmount / re-run.
 */
export function useGsapReveal(
  callback: (context: { reducedMotion: boolean }) => void | (() => void),
  { scope, dependencies }: { scope?: ScopeRef; dependencies?: unknown[] } = {}
) {
  useGSAP(
    () => callback({ reducedMotion: prefersReducedMotion() }),
    // `useGSAP` treats a *present* `dependencies` key (even `undefined`) as
    // "use this as the effect's dep array", which React then runs on every
    // render. Only include the key when a dependency array was actually
    // given, so the default stays "run once on mount".
    dependencies ? { scope, dependencies } : { scope }
  );
}
