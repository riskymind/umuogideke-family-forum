"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal, ModalTitle, ModalActions } from "@/components/ui/Modal";
import { deleteLevy } from "@/actions/levies";
import type { LevyCardData } from "@/components/levies/LevyCard";
import { toast, errorMessage } from "@/lib/toast";

export function DeleteLevyModal({
  levy,
  onClose,
}: {
  levy: LevyCardData;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      try {
        await deleteLevy(levy.id);
        toast.success(`"${levy.name}" deleted`);
        router.refresh();
        onClose();
      } catch (err) {
        toast.error(errorMessage(err, "Failed to delete levy"));
      }
    });
  }

  return (
    <Modal onClose={onClose} maxWidth={380}>
      <ModalTitle>Delete Levy</ModalTitle>
      <div className="text-sm text-muted">
        Remove <span className="font-semibold text-ink">{levy.name}</span> and all of its recorded
        payments? This cannot be undone.
      </div>
      <ModalActions
        onCancel={onClose}
        onConfirm={submit}
        confirmLabel={pending ? "Deleting…" : "Delete Levy"}
      />
    </Modal>
  );
}
