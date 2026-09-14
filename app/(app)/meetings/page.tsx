import { requireSession } from "@/lib/session";
import { getForumStats } from "@/lib/stats";
import { shortName } from "@/lib/dues";
import { MeetingsPageClient } from "@/components/meetings/MeetingsPageClient";
import type { MeetingRowData } from "@/components/meetings/MeetingRow";
import type { AttendanceMeeting } from "@/components/meetings/AttendanceModal";

export default async function MeetingsPage() {
  const session = await requireSession();
  const isAdmin = session.user.role === "admin";
  const stats = await getForumStats();

  // stats.meetings is ordered oldest-first (shared with dashboard/payments,
  // which rely on that order); sort a copy here so the latest meeting shows first.
  const meetings: MeetingRowData[] = stats.meetings
    .slice()
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map((mt) => ({
      id: mt.id,
      title: mt.title,
      date: mt.date,
      duesAmount: mt.duesAmount,
      minutesName: mt.minutesName,
      minutesUrl: mt.minutesUrl,
      paidCount: mt.payments.filter((p) => p.paid).length,
      memberCount: stats.members.length,
    }));

  const attendance: Record<string, AttendanceMeeting> = {};
  if (isAdmin) {
    for (const mt of stats.meetings) {
      attendance[mt.id] = {
        id: mt.id,
        title: mt.title,
        date: mt.date,
        rows: stats.members.map((m) => {
          const payment = m.meetingPayments.find((p) => p.meetingId === mt.id);
          return { memberId: m.id, name: shortName(m.name), paid: payment?.paid ?? false };
        }),
      };
    }
  }

  return <MeetingsPageClient meetings={meetings} attendance={attendance} isAdmin={isAdmin} />;
}
