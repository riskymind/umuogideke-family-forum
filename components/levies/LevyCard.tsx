"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { dateLabel, fmt } from "@/lib/dues";
import { LevyPaymentModal } from "@/components/levies/LevyPaymentModal";

export interface LevyCardData {
  id: string;
  name: string;
  /** Minimum each member must pay; members may pay more. */
  amount: number;
  date: Date;
  collected: number;
  target: number;
  memberRows: { memberId: string; name: string; paid: boolean; amountPaid: number | null }[];
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
  const [payingMemberId, setPayingMemberId] = useState<string | null>(null);
  const [membersOpen, setMembersOpen] = useState(false);
  const payingRow = levy.memberRows.find((row) => row.memberId === payingMemberId);
  const paidCount = levy.memberRows.filter((row) => row.paid).length;

  return (
    <>
      <Card className="p-5.5">
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-ink">{levy.name}</div>
            <div className="mt-0.5 text-[13px] text-muted">
              {dateLabel(levy.date)} · min. ₦{fmt(levy.amount)} per member
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
        <button
          type="button"
          onClick={() => setMembersOpen((open) => !open)}
          aria-expanded={membersOpen}
          className="flex w-full items-center justify-between rounded-md bg-chip-bg px-3 py-2.5 text-left text-[13px] font-semibold text-ink cursor-pointer"
        >
          <span>
            Members · {paidCount} of {levy.memberRows.length} paid
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`transition-transform ${membersOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {membersOpen && (
          <div className="mt-3 flex flex-wrap gap-2">
            {levy.memberRows.map((row) => (
              <div
                key={row.memberId}
                onClick={() => isAdmin && setPayingMemberId(row.memberId)}
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
                {row.paid && row.amountPaid !== null && row.amountPaid > levy.amount && (
                  <span className="text-xs font-semibold">₦{fmt(row.amountPaid)}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
      {payingRow && (
        <LevyPaymentModal
          target={{
            levyId: levy.id,
            levyName: levy.name,
            minimum: levy.amount,
            memberId: payingRow.memberId,
            memberName: payingRow.name,
            amountPaid: payingRow.paid ? (payingRow.amountPaid ?? levy.amount) : null,
          }}
          onClose={() => setPayingMemberId(null)}
        />
      )}
    </>
  );
}
