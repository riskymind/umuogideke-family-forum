import { requireSession } from "@/lib/session";
import { getForumStats } from "@/lib/stats";
import { fmt, dateLabel, shortName } from "@/lib/dues";
import { Stagger } from "@/components/animations/Stagger";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge, paidBadgeStyle, pendingBadgeStyle } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await requireSession();
  const isAdmin = session.user.role === "admin";
  const stats = await getForumStats();

  let greeting = "Welcome back Admin";
  if (!isAdmin && session.user.memberId) {
    const member = await prisma.member.findUnique({
      where: { id: session.user.memberId },
      select: { name: true },
    });
    if (member) greeting = `Welcome, ${shortName(member.name).split(" ")[0]}`
  }

  const upcoming = stats.meetings.find((mt) => !mt.minutesName);
  const nextMeetingLabel = upcoming ? dateLabel(upcoming.date) : "—";

  const recentMeetings = stats.meetings.slice().reverse().slice(0, 4);
  const topDefaulters = stats.debtorList.slice(0, 4);

  const todayLabel = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <div className="mb-1 font-serif text-[26px] font-bold text-ink">{greeting}</div>
      <div className="mb-7 text-sm text-muted">{todayLabel}</div>

      <Stagger className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Members" value={stats.members.length} />
        <StatCard
          label="Dues Collected"
          value={`₦${fmt(stats.duesCollected)}`}
          valueColor="var(--color-green)"
        />
        <StatCard label="Next Meeting" value={nextMeetingLabel} valueSize={20} />
      </Stagger>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5.5">
          <div className="mb-3.5 font-serif text-[17px] font-bold text-ink">Recent Meetings</div>
          {recentMeetings.map((mt) => {
            const paidCount = mt.payments.filter((p) => p.paid).length;
            return (
              <div
                key={mt.id}
                className="flex items-center justify-between gap-3 border-b border-border-light py-3 last:border-b-0"
              >
                <div className="flex-1">
                  <div className="text-sm font-semibold text-ink">{mt.title}</div>
                  <div className="mt-0.5 text-xs text-muted">
                    {dateLabel(mt.date)} · {paidCount}/{stats.members.length} paid
                  </div>
                </div>
                {mt.minutesName && mt.minutesUrl ? (
                  <a
                    href={mt.minutesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline cursor-pointer"
                  >
                    <Badge style={paidBadgeStyle}>Minutes uploaded</Badge>
                  </a>
                ) : (
                  <Badge style={mt.minutesName ? paidBadgeStyle : pendingBadgeStyle}>
                    {mt.minutesName ? "Minutes uploaded" : "Pending"}
                  </Badge>
                )}
              </div>
            );
          })}
        </Card>
        <Card className="p-5.5">
          <div className="mb-3.5 font-serif text-[17px] font-bold text-ink">Defaulters</div>
          {topDefaulters.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between border-b border-border-light py-2.5 last:border-b-0"
            >
              <div className="text-[13px] font-medium text-ink">{d.name}</div>
              <div className="text-[13px] font-semibold text-terracotta">₦{fmt(d.owed)}</div>
            </div>
          ))}
          {stats.noDefaulters && (
            <div className="py-2 text-[13px] text-muted">Everyone is up to date 🎉</div>
          )}
        </Card>
      </div>
    </div>
  );
}
