import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-1 bg-cream p-6 text-center">
      <div className="mb-2 text-4xl">🔎</div>
      <div className="font-serif text-[22px] font-bold text-ink">Page not found</div>
      <div className="mt-1 max-w-sm text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </div>
      <Link
        href="/dashboard"
        className="mt-6 rounded-md bg-terracotta px-5 py-2.5 text-sm font-semibold text-cream no-underline"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
