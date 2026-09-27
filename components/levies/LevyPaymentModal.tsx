"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal, ModalTitle, ModalActions } from "@/components/ui/Modal";
import { FieldLabel, TextInput } from "@/components/ui/Field";
import { clearLevyPayment, recordLevyPayment } from "@/actions/levies";
import { fmt } from "@/lib/dues";
import { toast, errorMessage } from "@/lib/toast";

export interface LevyPaymentTarget {
  levyId: string;
  levyName: string;
  minimum: number;
  memberId: string;
  memberName: string;
  /** Amount already recorded, or null when the member hasn't paid. */
  amountPaid: number | null;
}

export function LevyPaymentModal({
  target,
  onClose,
}: {
  target: LevyPaymentTarget;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [amount, setAmount] = useState(String(target.amountPaid ?? target.minimum));
  const isPaid = target.amountPaid !== null;

  function submit() {
    const value = Number(amount);
    if (!Number.isInteger(value) || value < target.minimum) {
      toast.error(`Amount must be at least ₦${fmt(target.minimum)}`);
      return;
    }
    startTransition(async () => {
      try {
        await recordLevyPayment(target.levyId, target.memberId, amount);
        toast.success(`${target.memberName} paid ₦${fmt(value)}`);
        router.refresh();
        onClose();
      } catch (err) {
        toast.error(errorMessage(err, "Failed to record payment"));
      }
    });
  }

  function markUnpaid() {
    startTransition(async () => {
      try {
        await clearLevyPayment(target.levyId, target.memberId);
        toast.success(`${target.memberName} marked as unpaid`);
        router.refresh();
        onClose();
      } catch (err) {
        toast.error(errorMessage(err, "Failed to update payment"));
      }
    });
  }

  return (
    <Modal onClose={onClose}>
      <ModalTitle>{isPaid ? "Edit Payment" : "Record Payment"}</ModalTitle>
      <div className="mb-3.5 text-[13px] text-muted">
        {target.memberName} · {target.levyName}
      </div>
      <FieldLabel>Amount paid (minimum ₦{fmt(target.minimum)})</FieldLabel>
      <TextInput
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount paid (₦)"
        inputMode="numeric"
        autoFocus
      />
      {isPaid && (
        <button
          onClick={markUnpaid}
          className="mt-3 text-xs font-semibold text-terracotta cursor-pointer"
        >
          Mark as unpaid
        </button>
      )}
      <ModalActions
        onCancel={onClose}
        onConfirm={submit}
        confirmLabel={pending ? "Saving…" : "Save Payment"}
      />
    </Modal>
  );
}
