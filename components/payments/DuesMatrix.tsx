"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleMeetingPayment } from "@/actions/meetings";
import { fmt, shortDateLabel } from "@/lib/dues";

export interface MatrixRow {
  memberId: string;
  name: string;
  owed: number;
  cells: { meetingId: string; paid: boolean }[];
}

export function DuesMatrix({
  meetings,
  rows,
  isAdmin,
}: {
  meetings: { id: string; date: Date }[];
  rows: MatrixRow[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function toggle(meetingId: string, memberId: string) {
    if (!isAdmin) return;
    startTransition(async () => {
      await toggleMeetingPayment(meetingId, memberId);
      router.refresh();
    });
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border bg-surface">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <th className="sticky left-0 border-b border-border bg-surface px-4 py-3.5 text-left text-[11px] uppercase tracking-wide text-muted">
              Member
            </th>
            {meetings.map((mt) => (
              <th
                key={mt.id}
                className="whitespace-nowrap border-b border-border px-2.5 py-3.5 text-center text-[11px] uppercase tracking-wide text-muted"
              >
                {shortDateLabel(mt.date)}
              </th>
            ))}
            <th className="border-b border-border px-4 py-3.5 text-right text-[11px] uppercase tracking-wide text-muted">
              Owed
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.memberId}>
              <td className="sticky left-0 whitespace-nowrap border-b border-border-light bg-surface px-4 py-3 font-medium text-ink">
                {row.name}
              </td>
              {row.cells.map((cell) => (
                <td
                  key={cell.meetingId}
                  onClick={() => toggle(cell.meetingId, row.memberId)}
                  className={`border-b border-border-light p-2.5 text-center ${
                    isAdmin ? "cursor-pointer" : ""
                  }`}
                >
                  <div
                    className="mx-auto flex h-[26px] w-[26px] items-center justify-center rounded-md text-[13px] font-bold"
                    style={
                      cell.paid
                        ? { background: "var(--color-green-bg)", color: "var(--color-green)" }
                        : { background: "var(--color-red-bg)", color: "var(--color-terracotta)" }
                    }
                  >
                    {cell.paid ? "✓" : "·"}
                  </div>
                </td>
              ))}
              <td className="whitespace-nowrap border-b border-border-light px-4 py-3 text-right font-semibold text-terracotta">
                ₦{fmt(row.owed)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
