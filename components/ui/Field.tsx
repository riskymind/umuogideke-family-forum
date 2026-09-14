"use client";

import { InputHTMLAttributes, SelectHTMLAttributes, useState } from "react";

const fieldClass =
  "w-full rounded-md border border-border bg-cream px-3 py-2.5 text-sm font-sans text-ink outline-none focus:border-terracotta";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldClass} ${props.className ?? ""}`} />;
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
      {off && (
        <path
          d="M3 3l18 18"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

/**
 * A masked-by-default text input (password, PIN, etc.) with a button to
 * reveal/hide the value. Ignores an explicit `type` prop — it manages its
 * own "password" / "text" toggle.
 */
export function PasswordInput({
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`${fieldClass} pr-10 ${className ?? ""}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide value" : "Show value"}
        aria-pressed={visible}
        tabIndex={-1}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 text-muted-light hover:text-muted cursor-pointer"
      >
        <EyeIcon off={visible} />
      </button>
    </div>
  );
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${fieldClass} ${props.className ?? ""}`} />;
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-1.5 text-xs font-semibold text-muted">{children}</div>;
}
