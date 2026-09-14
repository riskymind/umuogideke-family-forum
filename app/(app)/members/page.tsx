import { requireAdminSession } from "@/lib/session";
import { getForumStats } from "@/lib/stats";
import { fmt } from "@/lib/dues";
import { MembersPageClient } from "@/components/members/MembersPageClient";
import type { MemberCardData } from "@/components/members/MemberCard";
import type { ProfileMember } from "@/components/members/MemberProfileModal";

export default async function MembersPage() {
  await requireAdminSession();
  const stats = await getForumStats();

  const members: MemberCardData[] = stats.members.map((m, index) => {
    const owed = stats.owedByMember.get(m.id) ?? 0;
    return {
      id: m.id,
      name: m.name,
      phone: m.phone,
      status: m.status,
      owed,
      owedLabel: owed > 0 ? `₦${fmt(owed)} owed` : "Paid up",
      index,
    };
  });

  const profiles: Record<string, ProfileMember> = {};
  stats.members.forEach((m, index) => {
    profiles[m.id] = {
      id: m.id,
      name: m.name,
      phone: m.phone,
      joinDate: m.joinDate,
      status: m.status,
      index,
      owed: stats.owedByMember.get(m.id) ?? 0,
      meetingRows: m.meetingPayments
        .slice()
        .sort((a, b) => a.meeting.date.getTime() - b.meeting.date.getTime())
        .map((p) => ({
          meetingId: p.meetingId,
          label: `${p.meeting.title} — ${p.meeting.date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`,
          paid: p.paid,
        })),
      levyRows: m.levyPayments
        .slice()
        .sort((a, b) => a.levy.date.getTime() - b.levy.date.getTime())
        .map((p) => ({
          levyId: p.levyId,
          label: p.levy.name,
          paid: p.paid,
          amount: p.levy.amount,
        })),
    };
  });

  return <MembersPageClient members={members} profiles={profiles} isAdmin />;
}
