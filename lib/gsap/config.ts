/**
 * Centralized GSAP animation tokens. Keep durations, easing and stagger
 * values here so the motion language can be tuned in one place instead of
 * being hand-tuned per component.
 */
export const animationConfig = {
  duration: {
    fast: 0.25,
    normal: 0.6,
    slow: 0.9,
  },

  ease: {
    standard: "power3.out",
    smooth: "power2.inOut",
    exit: "power2.in",
  },

  stagger: {
    small: 0.06,
    normal: 0.1,
  },
} as const;
