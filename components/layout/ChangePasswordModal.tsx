"use client";

import { useState, useTransition } from "react";
import { Modal, ModalTitle, ModalActions } from "@/components/ui/Modal";
import { FieldLabel, PasswordInput } from "@/components/ui/Field";
import { changeAdminPassword } from "@/actions/auth";
import { toast, errorMessage } from "@/lib/toast";

export function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [pending, startTransition] = useTransition();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    setError(null);
    if (!currentPassword || !newPassword) {
      setError("Fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }
    startTransition(async () => {
      try {
        const result = await changeAdminPassword(currentPassword, newPassword);
        if (result.error) {
          setError(result.error);
          return;
        }
        toast.success("Password changed");
        onClose();
      } catch (err) {
        toast.error(errorMessage(err, "Failed to change password"));
      }
    });
  }

  return (
    <Modal onClose={onClose}>
      <ModalTitle>Change Password</ModalTitle>
      <div className="flex flex-col gap-3.5">
        <div>
          <FieldLabel>Current password</FieldLabel>
          <PasswordInput
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus
          />
        </div>
        <div>
          <FieldLabel>New password (at least 8 characters)</FieldLabel>
          <PasswordInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div>
          <FieldLabel>Confirm new password</FieldLabel>
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        {error && <div className="text-[13px] text-terracotta">{error}</div>}
      </div>
      <ModalActions
        onCancel={onClose}
        onConfirm={submit}
        confirmLabel={pending ? "Saving…" : "Change Password"}
      />
    </Modal>
  );
}
