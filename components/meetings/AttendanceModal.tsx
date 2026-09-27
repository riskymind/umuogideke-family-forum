"use client";

import { useOptimistic, useTransition } from "react";
import { Modal } from "@/components/ui/Modal";
import { Badge, paidBadgeStyle, unpaidBadgeStyle } from "@/components/ui/Badge";
import { dateLabel } from "@/lib/dues";
import { toggleMeetingPayment } from "@/actions/meetings";

export interface AttendanceMeeting {
  id: string;
  title: string;
  date: Date;
  duesAmount: number;
  rows: { memberId: string; name: string; paid: boolean }[];
}

export function AttendanceModal({
  meeting,
  onClose,
}: {
  meeting: AttendanceMeeting;
  onClose: () => void;
}) {
  const [, startTransition] = useTransition();
  // Flip the badge on the current frame instead of waiting for the server
  // round-trip — on slow mobile connections the list otherwise looks frozen,
  // which invites repeat taps that toggle the payment straight back.
  const [rows, toggleRow] = useOptimistic(meeting.rows, (current, memberId: string) =>
    current.map((row) => (row.memberId === memberId ? { ...row, paid: !row.paid } : row))
  );

  function toggle(memberId: string) {
    startTransition(async () => {
      toggleRow(memberId);
      // The action's revalidatePath("/meetings") refreshes this route with fresh props.
      await toggleMeetingPayment(meeting.id, memberId);
    });
  }

  return (
    <Modal onClose={onClose} maxWidth={420}>
      <div className="mb-1 font-serif text-[19px] font-bold text-ink">{meeting.title}</div>
      <div className="mb-4.5 text-[13px] text-muted">
        {dateLabel(meeting.date)} · tap to toggle ₦{meeting.duesAmount.toLocaleString()} dues
      </div>
      {rows.map((row) => (
        <button
          type="button"
          key={row.memberId}
          onClick={() => toggle(row.memberId)}
          className="flex w-full cursor-pointer items-center justify-between border-b border-border-light py-2.5 text-left"
        >
          <div className="text-sm font-medium text-ink">{row.name}</div>
          <Badge style={row.paid ? paidBadgeStyle : unpaidBadgeStyle}>
            {row.paid ? "Paid" : "Unpaid"}
          </Badge>
        </button>
      ))}
      <button
        onClick={onClose}
        className="mt-5.5 w-full rounded-md py-2.5 text-center text-sm font-semibold text-cream cursor-pointer"
        style={{ background: "var(--color-ink)" }}
      >
        Done
      </button>
    </Modal>
  );
}
