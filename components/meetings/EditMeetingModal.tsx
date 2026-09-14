"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal, ModalTitle, ModalActions } from "@/components/ui/Modal";
import { TextInput } from "@/components/ui/Field";
import { updateMeeting } from "@/actions/meetings";
import type { MeetingRowData } from "@/components/meetings/MeetingRow";
import { toast, errorMessage } from "@/lib/toast";

export function EditMeetingModal({
  meeting,
  onClose,
}: {
  meeting: MeetingRowData;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(meeting.title);
  const [meetingDate, setMeetingDate] = useState(meeting.date.toISOString().slice(0, 10));
  const [duesAmount, setDuesAmount] = useState(String(meeting.duesAmount));

  function submit() {
    if (!title.trim()) return;
    startTransition(async () => {
      try {
        await updateMeeting(meeting.id, { title, meetingDate, duesAmount });
        toast.success(`"${title.trim()}" updated`);
        router.refresh();
        onClose();
      } catch (err) {
        toast.error(errorMessage(err, "Failed to update meeting"));
      }
    });
  }

  return (
    <Modal onClose={onClose}>
      <ModalTitle>Edit Meeting</ModalTitle>
      <div className="flex flex-col gap-3.5">
        <TextInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Meeting title"
        />
        <TextInput
          type="date"
          value={meetingDate}
          onChange={(e) => setMeetingDate(e.target.value)}
        />
        <TextInput
          value={duesAmount}
          onChange={(e) => setDuesAmount(e.target.value)}
          placeholder="Dues per member (₦)"
          inputMode="numeric"
        />
      </div>
      <ModalActions
        onCancel={onClose}
        onConfirm={submit}
        confirmLabel={pending ? "Saving…" : "Save Changes"}
      />
    </Modal>
  );
}
