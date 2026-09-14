"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal, ModalTitle, ModalActions } from "@/components/ui/Modal";
import { removeMeetingMinutes } from "@/actions/meetings";
import type { MeetingRowData } from "@/components/meetings/MeetingRow";
import { toast, errorMessage } from "@/lib/toast";

export function DeleteMinutesModal({
  meeting,
  onClose,
}: {
  meeting: MeetingRowData;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      try {
        await removeMeetingMinutes(meeting.id);
        toast.success("Minutes removed");
        router.refresh();
        onClose();
      } catch (err) {
        toast.error(errorMessage(err, "Failed to remove minutes"));
      }
    });
  }

  return (
    <Modal onClose={onClose} maxWidth={380}>
      <ModalTitle>Remove Minutes</ModalTitle>
      <div className="text-sm text-muted">
        Remove the uploaded minutes (
        <span className="font-semibold text-ink">{meeting.minutesName}</span>) from{" "}
        <span className="font-semibold text-ink">{meeting.title}</span>? An admin can upload a new
        file afterwards.
      </div>
      <ModalActions
        onCancel={onClose}
        onConfirm={submit}
        confirmLabel={pending ? "Removing…" : "Remove Minutes"}
      />
    </Modal>
  );
}
