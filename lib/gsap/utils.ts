/**
 * Whether the user has asked their OS for reduced motion. Safe to call
 * during SSR (returns false, matching a static/no-JS render).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
