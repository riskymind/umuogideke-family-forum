"use client";

import { type ReactNode, useRef } from "react";
import { gsap, animationConfig } from "@/lib/gsap";
import { useGsapReveal } from "@/hooks/useGsap";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
}

/**
 * Single-element entrance: fades and slides content in once on mount.
 * Falls back to an immediate, fully-visible state when the user prefers
 * reduced motion.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = animationConfig.duration.slow,
  y = 24,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGsapReveal(
    ({ reducedMotion }) => {
      if (reducedMotion) {
        gsap.set(ref.current, { opacity: 1, clearProps: "transform" });
        return;
      }

      gsap.from(ref.current, {
        opacity: 0,
        y,
        duration,
        delay,
        ease: animationConfig.ease.standard,
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
