"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export interface NavItem {
  key: string;
  label: string;
  href: string;
}

export function Shell({
  navItems,
  currentUserName,
  roleLabel,
  children,
}: {
  navItems: NavItem[];
  currentUserName: string;
  roleLabel: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full bg-cream">
      {/* Mobile topbar */}
      <div className="fixed top-0 left-0 right-0 z-30 flex h-14 items-center gap-3 bg-sidebar px-4 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="flex flex-col gap-1 p-1.5 cursor-pointer"
        >
          <span className="block h-0.5 w-5 bg-cream" />
          <span className="block h-0.5 w-5 bg-cream" />
          <span className="block h-0.5 w-5 bg-cream" />
        </button>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden">
          <Image
            src="/umuogideke.jpeg"
            alt="Umuogideke Family Forum logo"
            width={28}
            height={28}
            className="h-full w-full object-cover"
          />
        </div>
        <span className="font-serif text-[15px] font-semibold text-cream">
          Umuogideke Family Forum
        </span>
      </div>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.4)" }}
        />
      )}

      <div
        className={`fixed md:static top-0 bottom-0 left-0 z-40 flex w-59 shrink-0 flex-col bg-sidebar p-[22px_14px] transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="mb-4 flex items-center gap-2.5 border-b border-sidebar-border px-2 pb-5.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl">
            <Image
              src="/umuogideke.jpeg"
              alt="Umuogideke Family Forum logo"
              width={36}
              height={36}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="font-serif text-[15px] font-semibold leading-tight text-cream">
            Umuogideke
            <br />
            Family Forum
          </div>
        </div>
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium"
                style={
                  active
                    ? { background: "var(--color-terracotta)", color: "var(--color-cream)" }
                    : { color: "var(--color-sidebar-muted)" }
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex-1" />
        <div className="mt-2.5 border-t border-sidebar-border pt-3.5">
          <div className="text-sm font-semibold text-sidebar-muted">{currentUserName}</div>
          <div className="mb-2.5 text-[11px] uppercase tracking-wide text-sidebar-faint">
            {roleLabel}
          </div>
          <button
            onClick={() => signOut({ redirectTo: "/login" })}
            className="text-sm font-medium cursor-pointer"
            style={{ color: "var(--color-terracotta-soft)" }}
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="min-w-0 flex-1 overflow-y-auto px-4 py-5 mt-14 md:mt-0 md:px-10 md:py-8">
        {children}
      </div>
    </div>
  );
}
