"use client";

import { useState } from "react";
import { Stagger } from "@/components/animations/Stagger";
import { MemberCard, type MemberCardData } from "@/components/members/MemberCard";
import { AddMemberModal } from "@/components/members/AddMemberModal";
import { EditMemberModal } from "@/components/members/EditMemberModal";
import { DeleteMemberModal } from "@/components/members/DeleteMemberModal";
import { MemberProfileModal, type ProfileMember } from "@/components/members/MemberProfileModal";

export function MembersPageClient({
  members,
  profiles,
  isAdmin,
}: {
  members: MemberCardData[];
  profiles: Record<string, ProfileMember>;
  isAdmin: boolean;
}) {
  const [modal, setModal] = useState<"add" | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="font-serif text-[26px] font-bold text-ink">Members</div>
          <div className="mt-1 text-sm text-muted">{members.length} registered members</div>
        </div>
        {isAdmin && (
          <button
            onClick={() => setModal("add")}
            className="rounded-md bg-terracotta px-5 py-2.5 text-sm font-semibold text-cream cursor-pointer"
          >
            + Add Member
          </button>
        )}
      </div>

      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {members.map((m) => (
          <MemberCard key={m.id} member={m} onOpen={setProfileId} />
        ))}
      </Stagger>

      {modal === "add" && <AddMemberModal onClose={() => setModal(null)} />}
      {profileId && profiles[profileId] && (
        <MemberProfileModal
          member={profiles[profileId]}
          isAdmin={isAdmin}
          onClose={() => setProfileId(null)}
          onEdit={
            isAdmin
              ? () => {
                  setEditId(profileId);
                  setProfileId(null);
                }
              : undefined
          }
          onDelete={
            isAdmin
              ? () => {
                  setDeleteId(profileId);
                  setProfileId(null);
                }
              : undefined
          }
        />
      )}
      {editId && profiles[editId] && (
        <EditMemberModal member={profiles[editId]} onClose={() => setEditId(null)} />
      )}
      {deleteId && profiles[deleteId] && (
        <DeleteMemberModal member={profiles[deleteId]} onClose={() => setDeleteId(null)} />
      )}
    </div>
  );
}
