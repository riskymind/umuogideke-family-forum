"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Badge, paidBadgeStyle, unpaidBadgeStyle } from "@/components/ui/Badge";
import { dateLabel } from "@/lib/dues";
import { toggleMeetingPayment } from "@/actions/meetings";

export interface AttendanceMeeting {
  id: string;
  title: string;
  date: Date;
  rows: { memberId: string; name: string; paid: boolean }[];
}

export function AttendanceModal({
  meeting,
  onClose,
}: {
  meeting: AttendanceMeeting;
  onClose: () => void;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function toggle(memberId: string) {
    startTransition(async () => {
      await toggleMeetingPayment(meeting.id, memberId);
      router.refresh();
    });
  }

  return (
    <Modal onClose={onClose} maxWidth={420}>
      <div className="mb-1 font-serif text-[19px] font-bold text-ink">{meeting.title}</div>
      <div className="mb-4.5 text-[13px] text-muted">
        {dateLabel(meeting.date)} · click to toggle ₦200 dues
      </div>
      {meeting.rows.map((row) => (
        <div
          key={row.memberId}
          onClick={() => toggle(row.memberId)}
          className="flex cursor-pointer items-center justify-between border-b border-border-light py-2.5"
        >
          <div className="text-sm font-medium text-ink">{row.name}</div>
          <Badge style={row.paid ? paidBadgeStyle : unpaidBadgeStyle}>
            {row.paid ? "Paid" : "Unpaid"}
          </Badge>
        </div>
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
