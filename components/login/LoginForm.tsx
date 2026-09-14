"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginAsAdmin, loginAsMember } from "@/actions/auth";
import { TextInput, SelectInput, FieldLabel, PasswordInput } from "@/components/ui/Field";
import { gsap, animationConfig } from "@/lib/gsap";
import { useGsapReveal } from "@/hooks/useGsap";

export function LoginForm({ members }: { members: { id: string; name: string }[] }) {
  const router = useRouter();
  const container = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"admin" | "member">("admin");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");

  const [memberId, setMemberId] = useState(members[0]?.id ?? "");
  const [pin, setPin] = useState("");

  useGsapReveal(
    ({ reducedMotion }) => {
      const items = [
        ".login-logo",
        ".login-heading",
        ".login-description",
        ".login-tabs",
        ".login-form",
        ".login-footer",
      ];

      if (reducedMotion) {
        gsap.set(items, { opacity: 1, clearProps: "transform" });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: animationConfig.ease.standard } });

      tl.from(".login-logo", { y: 16, opacity: 0, duration: animationConfig.duration.normal })
        .from(
          ".login-heading",
          { y: 20, opacity: 0, duration: animationConfig.duration.normal },
          "-=0.35"
        )
        .from(
          ".login-description",
          { y: 16, opacity: 0, duration: animationConfig.duration.fast },
          "-=0.3"
        )
        .from(
          ".login-tabs",
          { y: 16, opacity: 0, duration: animationConfig.duration.fast },
          "-=0.2"
        )
        .from(
          ".login-form",
          { y: 16, opacity: 0, duration: animationConfig.duration.normal },
          "-=0.15"
        )
        .from(
          ".login-footer",
          { opacity: 0, duration: animationConfig.duration.fast },
          "-=0.2"
        );

      return () => {
        tl.kill();
      };
    },
    { scope: container }
  );

  function submitAdmin() {
    setError(null);
    startTransition(async () => {
      const result = await loginAsAdmin(adminUser, adminPass);
      if (result?.error) setError(result.error);
      else router.push("/dashboard");
    });
  }

  function submitMember() {
    setError(null);
    startTransition(async () => {
      const result = await loginAsMember(memberId, pin);
      if (result?.error) setError(result.error);
      else router.push("/dashboard");
    });
  }

  return (
    <div
      ref={container}
      className="w-full max-w-100 rounded-md border border-border bg-surface px-8 py-9 shadow-[0_2px_12px_rgba(43,33,24,0.06)]"
    >
      <div className="mb-7 text-center">
        <div className="login-logo mx-auto mb-3.5 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl">
          <Image
            src="/umuogideke.jpeg"
            alt="Umuogideke Family Forum logo"
            width={86}
            height={86}
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <div className="login-heading font-serif text-[22px] font-bold text-ink">
          Umuogideke Family Forum
        </div>
        <div className="login-description mt-1 text-[13px] text-muted">
          Meetings, dues &amp; records
        </div>
      </div>

      <div className="login-tabs mb-5.5 flex rounded-md bg-chip-bg p-1">
        <button
          onClick={() => setTab("admin")}
          className="flex-1 rounded-[5px] py-2.5 text-center text-sm font-semibold cursor-pointer"
          style={
            tab === "admin"
              ? { background: "var(--color-surface)", color: "var(--color-ink)" }
              : { color: "var(--color-muted)" }
          }
        >
          Admin
        </button>
        <button
          onClick={() => setTab("member")}
          className="flex-1 rounded-[5px] py-2.5 text-center text-sm font-semibold cursor-pointer"
          style={
            tab === "member"
              ? { background: "var(--color-surface)", color: "var(--color-ink)" }
              : { color: "var(--color-muted)" }
          }
        >
          Member
        </button>
      </div>

      {tab === "admin" ? (
        <div className="login-form flex flex-col gap-3.5">
          <div>
            <FieldLabel>Username</FieldLabel>
            <TextInput
              value={adminUser}
              onChange={(e) => setAdminUser(e.target.value)}
              placeholder="admin"
            />
          </div>
          <div>
            <FieldLabel>Password</FieldLabel>
            <PasswordInput
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            onClick={submitAdmin}
            disabled={pending}
            className="mt-1.5 rounded-md bg-terracotta py-3 text-center text-sm font-semibold text-cream cursor-pointer disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in as Admin"}
          </button>
        </div>
      ) : (
        <div className="login-form flex flex-col gap-3.5">
          <div>
            <FieldLabel>Select your name</FieldLabel>
            <SelectInput value={memberId} onChange={(e) => setMemberId(e.target.value)}>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </SelectInput>
          </div>
          <div>
            <FieldLabel>Phone (last 4 digits)</FieldLabel>
            <PasswordInput
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="1234"
              maxLength={4}
              inputMode="numeric"
            />
          </div>
          <button
            onClick={submitMember}
            disabled={pending}
            className="mt-1.5 rounded-md py-3 text-center text-sm font-semibold text-cream cursor-pointer disabled:opacity-60"
            style={{ background: "var(--color-green)" }}
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-3 text-center text-xs font-medium text-terracotta">{error}</div>
      )}

      <div className="login-footer mt-6 border-t border-border-light pt-4.5 text-center text-xs text-muted-light">
        No public sign-up — accounts are created by the family admin.
      </div>
    </div>
  );
}
