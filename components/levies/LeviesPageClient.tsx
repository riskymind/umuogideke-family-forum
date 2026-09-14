"use client";

import { useState } from "react";
import { Stagger } from "@/components/animations/Stagger";
import { LevyCard, type LevyCardData } from "@/components/levies/LevyCard";
import { AddLevyModal } from "@/components/levies/AddLevyModal";
import { EditLevyModal } from "@/components/levies/EditLevyModal";
import { DeleteLevyModal } from "@/components/levies/DeleteLevyModal";

export function LeviesPageClient({
  levies,
  isAdmin,
}: {
  levies: LevyCardData[];
  isAdmin: boolean;
}) {
  const [modal, setModal] = useState<"add" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const editLevy = levies.find((lv) => lv.id === editId);
  const deleteLevy = levies.find((lv) => lv.id === deleteId);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="font-serif text-[26px] font-bold text-ink">Levies</div>
          <div className="mt-1 text-sm text-muted">
            Weddings, burials &amp; other one-off contributions
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => setModal("add")}
            className="rounded-md bg-terracotta px-5 py-2.5 text-sm font-semibold text-cream cursor-pointer"
          >
            + New Levy
          </button>
        )}
      </div>

      <Stagger className="flex flex-col gap-3.5">
        {levies.map((lv) => (
          <LevyCard
            key={lv.id}
            levy={lv}
            isAdmin={isAdmin}
            onEdit={isAdmin ? setEditId : undefined}
            onDelete={isAdmin ? setDeleteId : undefined}
          />
        ))}
      </Stagger>

      {modal === "add" && <AddLevyModal onClose={() => setModal(null)} />}
      {editLevy && <EditLevyModal levy={editLevy} onClose={() => setEditId(null)} />}
      {deleteLevy && <DeleteLevyModal levy={deleteLevy} onClose={() => setDeleteId(null)} />}
    </div>
  );
}
