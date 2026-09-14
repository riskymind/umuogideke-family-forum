"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins once, in this single client-safe module. Importing
// components should pull gsap/ScrollTrigger from here rather than
// registering the plugin themselves.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
export { animationConfig } from "./config";
export { prefersReducedMotion } from "./utils";
