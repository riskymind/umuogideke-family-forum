import { requireAdminSession } from "@/lib/session";
import { getForumStats } from "@/lib/stats";
import { fmt } from "@/lib/dues";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";

export default async function ReportsPage() {
  await requireAdminSession();
  const stats = await getForumStats();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-serif text-[26px] font-bold text-ink">Reports</div>
          <div className="mt-1 text-sm text-muted">Book-keeping summary</div>
        </div>
        <a
          href="/api/reports/export"
          className="rounded-md px-5 py-2.5 text-sm font-semibold text-cream no-underline"
          style={{ background: "var(--color-ink)" }}
        >
          Export CSV
        </a>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Dues Collected"
          value={`₦${fmt(stats.duesCollected)}`}
          valueColor="var(--color-green)"
          valueSize={26}
        />
        <StatCard
          label="Levies Collected"
          value={`₦${fmt(stats.leviesCollected)}`}
          valueColor="var(--color-green)"
          valueSize={26}
        />
        <StatCard
          label="Total Outstanding"
          value={`₦${fmt(stats.totalOutstanding)}`}
          valueColor="var(--color-terracotta)"
          valueSize={26}
        />
        <StatCard label="Compliance Rate" value={`${stats.complianceRate}%`} valueSize={26} />
      </div>

      <Card className="p-5.5">
        <div className="mb-3.5 font-serif text-[17px] font-bold text-ink">Who Owes What</div>
        {stats.debtorList.map((d) => (
          <div
            key={d.id}
            className="flex items-center justify-between border-b border-border-light py-2.5 last:border-b-0"
          >
            <div className="text-sm font-medium text-ink">{d.name}</div>
            <div className="text-sm font-semibold text-terracotta">₦{fmt(d.owed)}</div>
          </div>
        ))}
        {stats.noDefaulters && (
          <div className="py-2 text-[13px] text-muted">Everyone is up to date 🎉</div>
        )}
      </Card>
    </div>
  );
}
