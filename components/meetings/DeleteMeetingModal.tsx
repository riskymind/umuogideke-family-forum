"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal, ModalTitle, ModalActions } from "@/components/ui/Modal";
import { deleteMeeting } from "@/actions/meetings";
import type { MeetingRowData } from "@/components/meetings/MeetingRow";
import { toast, errorMessage } from "@/lib/toast";

export function DeleteMeetingModal({
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
        await deleteMeeting(meeting.id);
        toast.success(`"${meeting.title}" deleted`);
        router.refresh();
        onClose();
      } catch (err) {
        toast.error(errorMessage(err, "Failed to delete meeting"));
      }
    });
  }

  return (
    <Modal onClose={onClose} maxWidth={380}>
      <ModalTitle>Delete Meeting</ModalTitle>
      <div className="text-sm text-muted">
        Remove <span className="font-semibold text-ink">{meeting.title}</span> and all of its
        recorded attendance and dues payments? This cannot be undone.
      </div>
      <ModalActions
        onCancel={onClose}
        onConfirm={submit}
        confirmLabel={pending ? "Deleting…" : "Delete Meeting"}
      />
    </Modal>
  );
}
