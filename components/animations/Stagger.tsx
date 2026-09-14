"use client";

import { type ReactNode, useRef } from "react";
import { gsap, animationConfig } from "@/lib/gsap";
import { useGsapReveal } from "@/hooks/useGsap";

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** Selector for the items to stagger, relative to the wrapper. */
  itemSelector?: string;
  y?: number;
  stagger?: number;
  /** Re-run the reveal when these change (default: mount once). */
  dependencies?: unknown[];
}

/**
 * Reveals a group of direct children (cards, rows, grid items) with a
 * staggered fade/slide once on mount. Targets `itemSelector` scoped to the
 * wrapper, so existing card/row components don't need an animation class.
 */
export function Stagger({
  children,
  className,
  itemSelector = ":scope > *",
  y = 20,
  stagger = animationConfig.stagger.normal,
  dependencies = [],
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGsapReveal(
    ({ reducedMotion }) => {
      const items = ref.current?.querySelectorAll(itemSelector);
      if (!items || items.length === 0) return;

      if (reducedMotion) {
        gsap.set(items, { opacity: 1, clearProps: "transform" });
        return;
      }

      gsap.from(items, {
        opacity: 0,
        y,
        duration: animationConfig.duration.normal,
        stagger,
        ease: animationConfig.ease.standard,
      });
    },
    { scope: ref, dependencies }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
