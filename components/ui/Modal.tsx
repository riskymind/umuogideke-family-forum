"use client";

import { useRef } from "react";
import { gsap, animationConfig } from "@/lib/gsap";
import { useGsapReveal } from "@/hooks/useGsap";

export function Modal({
  onClose,
  children,
  maxWidth = 400,
}: {
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: number;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGsapReveal(
    ({ reducedMotion }) => {
      if (reducedMotion) {
        gsap.set([overlayRef.current, panelRef.current], { opacity: 1, clearProps: "transform" });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: animationConfig.ease.standard } });
      tl.from(overlayRef.current, { opacity: 0, duration: animationConfig.duration.fast }).from(
        panelRef.current,
        { opacity: 0, y: 12, scale: 0.97, duration: animationConfig.duration.normal },
        "-=0.1"
      );

      return () => {
        tl.kill();
      };
    },
    { scope: overlayRef }
  );

  return (
    <div
      ref={overlayRef}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: "rgba(43,33,24,0.4)" }}
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-lg bg-surface p-7 max-h-[85vh] overflow-y-auto"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 font-serif text-[19px] font-bold text-ink">{children}</div>
  );
}

export function ModalActions({
  onCancel,
  onConfirm,
  confirmLabel,
  cancelLabel = "Cancel",
}: {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  cancelLabel?: string;
}) {
  return (
    <div className="mt-6 flex gap-2.5">
      <button
        onClick={onCancel}
        className="flex-1 rounded-md bg-chip-bg py-2.5 text-sm font-semibold text-ink cursor-pointer"
      >
        {cancelLabel}
      </button>
      <button
        onClick={onConfirm}
        className="flex-1 rounded-md bg-terracotta py-2.5 text-sm font-semibold text-cream cursor-pointer"
      >
        {confirmLabel}
      </button>
    </div>
  );
}
