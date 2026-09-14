"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { dateLabel, fmt } from "@/lib/dues";
import { toggleLevyPayment } from "@/actions/levies";

export interface LevyCardData {
  id: string;
  name: string;
  amount: number;
  date: Date;
  collected: number;
  target: number;
  memberRows: { memberId: string; name: string; paid: boolean }[];
}

export function LevyCard({
  levy,
  isAdmin,
  onEdit,
  onDelete,
}: {
  levy: LevyCardData;
  isAdmin: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function toggle(memberId: string) {
    if (!isAdmin) return;
    startTransition(async () => {
      await toggleLevyPayment(levy.id, memberId);
      router.refresh();
    });
  }

  return (
    <Card className="p-5.5">
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-base font-semibold text-ink">{levy.name}</div>
          <div className="mt-0.5 text-[13px] text-muted">
            {dateLabel(levy.date)} · ₦{fmt(levy.amount)} per member
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-lg font-bold" style={{ color: "var(--color-green)" }}>
              ₦{fmt(levy.collected)}
            </div>
            <div className="text-xs text-muted-light">of ₦{fmt(levy.target)} target</div>
          </div>
          {isAdmin && (onEdit || onDelete) && (
            <div className="flex items-center gap-1.5">
              {onEdit && (
                <button
                  onClick={() => onEdit(levy.id)}
                  aria-label="Edit levy"
                  className="rounded-md bg-chip-bg px-3 py-2 text-xs font-semibold text-ink cursor-pointer"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(levy.id)}
                  aria-label="Delete levy"
                  className="rounded-md px-3 py-2 text-xs font-semibold cursor-pointer"
                  style={{ background: "var(--color-red-bg)", color: "var(--color-terracotta)" }}
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {levy.memberRows.map((row) => (
          <div
            key={row.memberId}
            onClick={() => toggle(row.memberId)}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 ${
              isAdmin ? "cursor-pointer" : ""
            }`}
            style={
              row.paid
                ? { background: "var(--color-green-bg)", color: "var(--color-green)" }
                : { background: "var(--color-chip-bg)", color: "var(--color-muted)" }
            }
          >
            <span className="text-xs font-medium">{row.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
