import { Card } from "@/components/ui/Card";

export function StatCard({
  label,
  value,
  valueColor,
  valueSize = 32,
}: {
  label: string;
  value: React.ReactNode;
  valueColor?: string;
  valueSize?: number;
}) {
  return (
    <Card className="p-5">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</div>
      <div
        className="mt-2 font-serif font-bold text-ink"
        style={{ fontSize: valueSize, color: valueColor }}
      >
        {value}
      </div>
    </Card>
  );
}
