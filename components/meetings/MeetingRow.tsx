"use client";

import { Card } from "@/components/ui/Card";
import { UploadMinutesButton } from "@/components/meetings/UploadMinutesButton";
import { dateLabel, fmt } from "@/lib/dues";

export interface MeetingRowData {
  id: string;
  title: string;
  date: Date;
  duesAmount: number;
  minutesName: string | null;
  minutesUrl: string | null;
  paidCount: number;
  memberCount: number;
}

export function MeetingRow({
  meeting,
  isAdmin,
  onOpenAttendance,
  onEdit,
  onDelete,
  onRemoveMinutes,
}: {
  meeting: MeetingRowData;
  isAdmin: boolean;
  onOpenAttendance: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRemoveMinutes?: (id: string) => void;
}) {
  const hasMinutes = Boolean(meeting.minutesName);
  return (
    <Card className="p-5.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-base font-semibold text-ink">{meeting.title}</div>
          <div className="mt-0.5 text-[13px] text-muted">
            {dateLabel(meeting.date)} · ₦{fmt(meeting.duesAmount)} dues · {meeting.paidCount}/
            {meeting.memberCount} paid · ₦{fmt(meeting.paidCount * meeting.duesAmount)} collected
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          {meeting.minutesName && meeting.minutesUrl ? (
            <a
              href={meeting.minutesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-3 py-1.5 text-xs font-semibold no-underline cursor-pointer"
              style={{ background: "var(--color-green-bg)", color: "var(--color-green)" }}
            >
              📄 {meeting.minutesName}
            </a>
          ) : meeting.minutesName ? (
            <div
              className="rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ background: "var(--color-green-bg)", color: "var(--color-green)" }}
            >
              📄 {meeting.minutesName}
            </div>
          ) : isAdmin ? (
            <UploadMinutesButton meetingId={meeting.id} />
          ) : (
            <div className="text-xs text-muted-light">Minutes pending</div>
          )}
          {isAdmin && hasMinutes && (
            <UploadMinutesButton
              meetingId={meeting.id}
              label="Replace"
              busyLabel="Replacing…"
              className="rounded-md bg-chip-bg px-3 py-2 text-xs font-semibold text-ink cursor-pointer disabled:opacity-60"
            />
          )}
          {isAdmin && hasMinutes && onRemoveMinutes && (
            <button
              onClick={() => onRemoveMinutes(meeting.id)}
              aria-label="Remove minutes"
              className="rounded-md px-3 py-2 text-xs font-semibold cursor-pointer"
              style={{ background: "var(--color-red-bg)", color: "var(--color-terracotta)" }}
            >
              Remove
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => onOpenAttendance(meeting.id)}
              className="rounded-md px-3.5 py-2 text-xs font-semibold text-cream cursor-pointer"
              style={{ background: "var(--color-ink)" }}
            >
              Record Payments
            </button>
          )}
          {isAdmin && onEdit && (
            <button
              onClick={() => onEdit(meeting.id)}
              aria-label="Edit meeting"
              className="rounded-md bg-chip-bg px-3 py-2 text-xs font-semibold text-ink cursor-pointer"
            >
              Edit
            </button>
          )}
          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(meeting.id)}
              aria-label="Delete meeting"
              className="rounded-md px-3 py-2 text-xs font-semibold cursor-pointer"
              style={{ background: "var(--color-red-bg)", color: "var(--color-terracotta)" }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
