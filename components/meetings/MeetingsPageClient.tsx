"use client";

import { useState } from "react";
import { Stagger } from "@/components/animations/Stagger";
import { MeetingRow, type MeetingRowData } from "@/components/meetings/MeetingRow";
import { AddMeetingModal } from "@/components/meetings/AddMeetingModal";
import { EditMeetingModal } from "@/components/meetings/EditMeetingModal";
import { DeleteMeetingModal } from "@/components/meetings/DeleteMeetingModal";
import { DeleteMinutesModal } from "@/components/meetings/DeleteMinutesModal";
import { AttendanceModal, type AttendanceMeeting } from "@/components/meetings/AttendanceModal";

export function MeetingsPageClient({
  meetings,
  attendance,
  isAdmin,
}: {
  meetings: MeetingRowData[];
  attendance: Record<string, AttendanceMeeting>;
  isAdmin: boolean;
}) {
  const [modal, setModal] = useState<"add" | null>(null);
  const [attendanceId, setAttendanceId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [removeMinutesId, setRemoveMinutesId] = useState<string | null>(null);

  const editMeeting = meetings.find((mt) => mt.id === editId);
  const deleteMeeting = meetings.find((mt) => mt.id === deleteId);
  const removeMinutesMeeting = meetings.find((mt) => mt.id === removeMinutesId);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="font-serif text-[26px] font-bold text-ink">Meetings &amp; Minutes</div>
          <div className="mt-1 text-sm text-muted">Dues: ₦200 per meeting</div>
        </div>
        {isAdmin && (
          <button
            onClick={() => setModal("add")}
            className="rounded-md bg-terracotta px-5 py-2.5 text-sm font-semibold text-cream cursor-pointer"
          >
            + New Meeting
          </button>
        )}
      </div>

      <Stagger className="flex flex-col gap-3.5">
        {meetings.map((mt) => (
          <MeetingRow
            key={mt.id}
            meeting={mt}
            isAdmin={isAdmin}
            onOpenAttendance={setAttendanceId}
            onEdit={isAdmin ? setEditId : undefined}
            onDelete={isAdmin ? setDeleteId : undefined}
            onRemoveMinutes={isAdmin ? setRemoveMinutesId : undefined}
          />
        ))}
      </Stagger>

      {modal === "add" && <AddMeetingModal onClose={() => setModal(null)} />}
      {attendanceId && attendance[attendanceId] && (
        <AttendanceModal
          meeting={attendance[attendanceId]}
          onClose={() => setAttendanceId(null)}
        />
      )}
      {editMeeting && <EditMeetingModal meeting={editMeeting} onClose={() => setEditId(null)} />}
      {deleteMeeting && (
        <DeleteMeetingModal meeting={deleteMeeting} onClose={() => setDeleteId(null)} />
      )}
      {removeMinutesMeeting && (
        <DeleteMinutesModal
          meeting={removeMinutesMeeting}
          onClose={() => setRemoveMinutesId(null)}
        />
      )}
    </div>
  );
}
