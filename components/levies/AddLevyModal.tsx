"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal, ModalTitle, ModalActions } from "@/components/ui/Modal";
import { TextInput } from "@/components/ui/Field";
import { addLevy } from "@/actions/levies";
import { toast, errorMessage } from "@/lib/toast";

export function AddLevyModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [levyName, setLevyName] = useState("");
  const [levyAmount, setLevyAmount] = useState("");
  const [levyDate, setLevyDate] = useState(new Date().toISOString().slice(0, 10));

  function submit() {
    if (!levyName.trim() || !levyAmount) return;
    startTransition(async () => {
      try {
        await addLevy({ levyName, levyAmount, levyDate });
        toast.success(`"${levyName.trim()}" created`);
        router.refresh();
        onClose();
      } catch (err) {
        toast.error(errorMessage(err, "Failed to create levy"));
      }
    });
  }

  return (
    <Modal onClose={onClose}>
      <ModalTitle>New Levy</ModalTitle>
      <div className="flex flex-col gap-3.5">
        <TextInput
          value={levyName}
          onChange={(e) => setLevyName(e.target.value)}
          placeholder="e.g. Wedding levy — Ada's daughter"
        />
        <TextInput
          value={levyAmount}
          onChange={(e) => setLevyAmount(e.target.value)}
          placeholder="Amount per member (₦)"
          inputMode="numeric"
        />
        <TextInput type="date" value={levyDate} onChange={(e) => setLevyDate(e.target.value)} />
      </div>
      <ModalActions
        onCancel={onClose}
        onConfirm={submit}
        confirmLabel={pending ? "Creating…" : "Create Levy"}
      />
    </Modal>
  );
}
