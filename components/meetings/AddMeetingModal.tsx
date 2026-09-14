"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal, ModalTitle, ModalActions } from "@/components/ui/Modal";
import { TextInput } from "@/components/ui/Field";
import { addMeeting } from "@/actions/meetings";
import { toast, errorMessage } from "@/lib/toast";

export function AddMeetingModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().slice(0, 10));
  const [duesAmount, setDuesAmount] = useState("200");

  function submit() {
    if (!title.trim()) return;
    startTransition(async () => {
      try {
        await addMeeting({ title, meetingDate, duesAmount });
        toast.success(`"${title.trim()}" created`);
        router.refresh();
        onClose();
      } catch (err) {
        toast.error(errorMessage(err, "Failed to create meeting"));
      }
    });
  }

  return (
    <Modal onClose={onClose}>
      <ModalTitle>New Meeting</ModalTitle>
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
        confirmLabel={pending ? "Creating…" : "Create"}
      />
    </Modal>
  );
}
