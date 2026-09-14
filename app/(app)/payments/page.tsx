import { requireSession } from "@/lib/session";
import { getForumStats } from "@/lib/stats";
import { shortName } from "@/lib/dues";
import { DuesMatrix, type MatrixRow } from "@/components/payments/DuesMatrix";

export default async function PaymentsPage() {
  const session = await requireSession();
  const isAdmin = session.user.role === "admin";
  const stats = await getForumStats();

  const rows: MatrixRow[] = stats.members.map((m) => {
    const owed = m.meetingPayments.reduce(
      (sum, p) => sum + (p.paid ? 0 : p.meeting.duesAmount),
      0
    );
    return {
      memberId: m.id,
      name: shortName(m.name),
      owed,
      cells: m.meetingPayments
        .slice()
        .sort((a, b) => a.meeting.date.getTime() - b.meeting.date.getTime())
        .map((p) => ({ meetingId: p.meetingId, paid: p.paid })),
    };
  });

  const meetings = stats.meetings.map((mt) => ({ id: mt.id, date: mt.date }));

  return (
    <div>
      <div className="mb-6">
        <div className="font-serif text-[26px] font-bold text-ink">Dues Ledger</div>
        <div className="mt-1 text-sm text-muted">
          ₦200 per meeting per member · {isAdmin ? "click a cell to toggle paid/unpaid" : "view only"}
        </div>
      </div>
      <DuesMatrix meetings={meetings} rows={rows} isAdmin={isAdmin} />
    </div>
  );
}
