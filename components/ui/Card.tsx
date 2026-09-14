export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md border border-border bg-surface ${className}`}
    >
      {children}
    </div>
  );
}
