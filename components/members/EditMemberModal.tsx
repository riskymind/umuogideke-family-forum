"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal, ModalTitle, ModalActions } from "@/components/ui/Modal";
import { TextInput, SelectInput } from "@/components/ui/Field";
import { updateMember } from "@/actions/members";
import type { ProfileMember } from "@/components/members/MemberProfileModal";
import { toast, errorMessage } from "@/lib/toast";

export function EditMemberModal({
  member,
  onClose,
}: {
  member: ProfileMember;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(member.name);
  const [phone, setPhone] = useState(member.phone);
  const [joinDate, setJoinDate] = useState(member.joinDate.toISOString().slice(0, 10));
  const [status, setStatus] = useState<"Active" | "Inactive">(
    member.status === "ACTIVE" ? "Active" : "Inactive"
  );

  function submit() {
    if (!name.trim()) return;
    startTransition(async () => {
      try {
        await updateMember(member.id, { name, phone, joinDate, status });
        toast.success(`${name.trim()} updated`);
        router.refresh();
        onClose();
      } catch (err) {
        toast.error(errorMessage(err, "Failed to update member"));
      }
    });
  }

  return (
    <Modal onClose={onClose}>
      <ModalTitle>Edit Member</ModalTitle>
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
        confirmLabel={pending ? "Saving…" : "Save Changes"}
      />
    </Modal>
  );
}
