/**
 * Minimal pub-sub toast store. No external dependency — client components
 * call `toast.success(...)` / `toast.error(...)` (e.g. after a server action
 * resolves or rejects) and <Toaster /> (mounted once in the root layout)
 * renders whatever is currently queued.
 */

export type ToastVariant = "success" | "error";

export interface ToastMessage {
  id: number;
  variant: ToastVariant;
  message: string;
}

type Listener = (toasts: ToastMessage[]) => void;

const TOAST_DURATION_MS = 3500;

let toasts: ToastMessage[] = [];
let nextId = 1;
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener(toasts);
}

export function subscribeToasts(listener: Listener): () => void {
  listeners.add(listener);
  listener(toasts);
  return () => listeners.delete(listener);
}

export function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

function push(variant: ToastVariant, message: string) {
  const id = nextId++;
  toasts = [...toasts, { id, variant, message }];
  emit();
  setTimeout(() => dismissToast(id), TOAST_DURATION_MS);
}

export const toast = {
  success: (message: string) => push("success", message),
  error: (message: string) => push("error", message),
};

/** Pull a readable message out of whatever a server action rejected with. */
export function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}
