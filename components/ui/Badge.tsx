export function Badge({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className="inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={style}
    >
      {children}
    </span>
  );
}

export const paidBadgeStyle: React.CSSProperties = {
  background: "var(--color-green-bg)",
  color: "var(--color-green)",
};

export const unpaidBadgeStyle: React.CSSProperties = {
  background: "var(--color-red-bg)",
  color: "var(--color-terracotta)",
};

export const pendingBadgeStyle: React.CSSProperties = {
  background: "var(--color-gold-bg)",
  color: "var(--color-gold)",
};
