"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal, ModalTitle, ModalActions } from "@/components/ui/Modal";
import { deleteMember } from "@/actions/members";
import type { ProfileMember } from "@/components/members/MemberProfileModal";
import { toast, errorMessage } from "@/lib/toast";

export function DeleteMemberModal({
  member,
  onClose,
}: {
  member: ProfileMember;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      try {
        await deleteMember(member.id);
        toast.success(`${member.name} removed`);
        router.refresh();
        onClose();
      } catch (err) {
        toast.error(errorMessage(err, "Failed to delete member"));
      }
    });
  }

  return (
    <Modal onClose={onClose} maxWidth={380}>
      <ModalTitle>Delete Member</ModalTitle>
      <div className="text-sm text-muted">
        Remove <span className="font-semibold text-ink">{member.name}</span> and all of their
        recorded dues and levy payments? This cannot be undone.
      </div>
      <ModalActions
        onCancel={onClose}
        onConfirm={submit}
        confirmLabel={pending ? "Deleting…" : "Delete Member"}
      />
    </Modal>
  );
}
