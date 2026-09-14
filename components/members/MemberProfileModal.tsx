"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Badge, paidBadgeStyle, unpaidBadgeStyle } from "@/components/ui/Badge";
import { avatarColor, initials, dateLabel, fmt } from "@/lib/dues";
import { toggleMeetingPayment } from "@/actions/meetings";
import { toggleLevyPayment } from "@/actions/levies";

export interface ProfileMember {
  id: string;
  name: string;
  phone: string;
  joinDate: Date;
  status: "ACTIVE" | "INACTIVE";
  index: number;
  owed: number;
  meetingRows: { meetingId: string; label: string; paid: boolean }[];
  levyRows: { levyId: string; label: string; paid: boolean; amount: number }[];
}

export function MemberProfileModal({
  member,
  isAdmin,
  onClose,
  onEdit,
  onDelete,
}: {
  member: ProfileMember;
  isAdmin: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function toggleMeeting(meetingId: string) {
    if (!isAdmin) return;
    startTransition(async () => {
      await toggleMeetingPayment(meetingId, member.id);
      router.refresh();
    });
  }

  function toggleLevy(levyId: string) {
    if (!isAdmin) return;
    startTransition(async () => {
      await toggleLevyPayment(levyId, member.id);
      router.refresh();
    });
  }

  return (
    <Modal onClose={onClose} maxWidth={460}>
      <div className="mb-5 flex items-start justify-between gap-3.5">
        <div className="flex items-center gap-3.5">
          <div
            className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full text-lg font-bold text-cream"
            style={{ background: avatarColor(member.index), width: 52, height: 52 }}
          >
            {initials(member.name)}
          </div>
          <div>
            <div className="font-serif text-[19px] font-bold text-ink">{member.name}</div>
            <div className="text-[13px] text-muted">
              {member.phone} · Joined {dateLabel(member.joinDate)}
            </div>
          </div>
        </div>
        {isAdmin && (onEdit || onDelete) && (
          <div className="flex shrink-0 items-center gap-1.5">
            {onEdit && (
              <button
                onClick={onEdit}
                aria-label="Edit member"
                className="rounded-md bg-chip-bg px-2.5 py-1.5 text-xs font-semibold text-ink cursor-pointer"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                aria-label="Delete member"
                className="rounded-md px-2.5 py-1.5 text-xs font-semibold cursor-pointer"
                style={{ background: "var(--color-red-bg)", color: "var(--color-terracotta)" }}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mb-4.5 flex items-center justify-between rounded-md bg-cream px-4 py-3.5">
        <div className="text-[13px] text-muted">Total outstanding</div>
        <div className="text-[15px] font-bold text-terracotta">₦{fmt(member.owed)}</div>
      </div>

      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        Meeting Dues
      </div>
      {member.meetingRows.map((row) => (
        <div
          key={row.meetingId}
          onClick={() => toggleMeeting(row.meetingId)}
          className={`flex items-center justify-between border-b border-border-light py-2.5 ${
            isAdmin ? "cursor-pointer" : ""
          }`}
        >
          <div className="text-[13px] text-ink">{row.label}</div>
          <Badge style={row.paid ? paidBadgeStyle : unpaidBadgeStyle}>
            {row.paid ? "Paid ₦200" : "Unpaid"}
          </Badge>
        </div>
      ))}

      <div className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-muted">
        Levies
      </div>
      {member.levyRows.map((row) => (
        <div
          key={row.levyId}
          onClick={() => toggleLevy(row.levyId)}
          className={`flex items-center justify-between border-b border-border-light py-2.5 ${
            isAdmin ? "cursor-pointer" : ""
          }`}
        >
          <div className="text-[13px] text-ink">{row.label}</div>
          <Badge style={row.paid ? paidBadgeStyle : unpaidBadgeStyle}>
            {row.paid ? `Paid ₦${fmt(row.amount)}` : `Owes ₦${fmt(row.amount)}`}
          </Badge>
        </div>
      ))}

      <button
        onClick={onClose}
        className="mt-5.5 w-full rounded-md bg-chip-bg py-2.5 text-center text-sm font-semibold text-ink cursor-pointer"
      >
        Close
      </button>
    </Modal>
  );
}
