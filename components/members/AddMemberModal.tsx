"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal, ModalTitle, ModalActions } from "@/components/ui/Modal";
import { TextInput, SelectInput } from "@/components/ui/Field";
import { addMember } from "@/actions/members";
import { toast, errorMessage } from "@/lib/toast";

export function AddMemberModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [joinDate, setJoinDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  function submit() {
    if (!name.trim()) return;
    startTransition(async () => {
      try {
        await addMember({ name, phone, joinDate, status });
        toast.success(`${name.trim()} added`);
        router.refresh();
        onClose();
      } catch (err) {
        toast.error(errorMessage(err, "Failed to add member"));
      }
    });
  }

  return (
    <Modal onClose={onClose}>
      <ModalTitle>Add Member</ModalTitle>
      <div className="flex flex-col gap-3.5">
        <TextInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
        />
        <TextInput
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
        />
        <TextInput
          type="date"
          value={joinDate}
          onChange={(e) => setJoinDate(e.target.value)}
        />
        <SelectInput value={status} onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </SelectInput>
      </div>
      <ModalActions
        onCancel={onClose}
        onConfirm={submit}
        confirmLabel={pending ? "Adding…" : "Add Member"}
      />
    </Modal>
  );
}
