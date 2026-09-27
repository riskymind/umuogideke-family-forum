import { prisma } from "@/lib/prisma";
import { levyCollected, shortName } from "@/lib/dues";

/**
 * Central place that mirrors the design prototype's `renderVals()` money math:
 * owed = sum of unpaid meeting dues + sum of unpaid levies.
 */
export async function getForumStats() {
  // $transaction (array form) runs these three reads over a single pooled
  // connection instead of Promise.all's three concurrent ones — matters on a
  // connection-limited serverless Postgres (Neon, etc.) where every page here
  // calls getForumStats().
  const [members, meetings, levies] = await prisma.$transaction([
    prisma.member.findMany({
      include: {
        meetingPayments: { include: { meeting: true } },
        levyPayments: { include: { levy: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.meeting.findMany({
      include: { payments: true },
      orderBy: { date: "asc" },
    }),
    prisma.levy.findMany({
      include: { payments: true },
      orderBy: { date: "asc" },
    }),
  ]);

  const duesCollected = meetings.reduce(
    (sum, mt) => sum + mt.payments.filter((p) => p.paid).length * mt.duesAmount,
    0
  );
  const duesTotal = meetings.reduce((sum, mt) => sum + mt.payments.length * mt.duesAmount, 0);
  // Levy amounts are minimums: collected uses what was actually paid, while
  // outstanding only counts the minimum owed by members who haven't paid, so
  // one member's overpayment never offsets another's debt.
  const leviesCollected = levies.reduce((sum, lv) => sum + levyCollected(lv), 0);
  const leviesTotal = levies.reduce((sum, lv) => sum + lv.payments.length * lv.amount, 0);
  const leviesOutstanding = levies.reduce(
    (sum, lv) => sum + lv.payments.filter((p) => !p.paid).length * lv.amount,
    0
  );
  const duesOutstanding = duesTotal - duesCollected;
  const totalOutstanding = duesOutstanding + leviesOutstanding;
  const complianceRate = duesTotal ? Math.round((duesCollected / duesTotal) * 100) : 100;

  const owedByMember = new Map<string, number>();
  for (const m of members) {
    let owed = 0;
    for (const p of m.meetingPayments) if (!p.paid) owed += p.meeting.duesAmount;
    for (const p of m.levyPayments) if (!p.paid) owed += p.levy.amount;
    owedByMember.set(m.id, owed);
  }

  const debtorList = members
    .map((m) => ({ id: m.id, name: shortName(m.name), owed: owedByMember.get(m.id) ?? 0 }))
    .filter((d) => d.owed > 0)
    .sort((a, b) => b.owed - a.owed);

  return {
    members,
    meetings,
    levies,
    duesCollected,
    duesTotal,
    leviesCollected,
    leviesTotal,
    duesOutstanding,
    totalOutstanding,
    complianceRate,
    owedByMember,
    debtorList,
    noDefaulters: debtorList.length === 0,
  };
}

export type ForumStats = Awaited<ReturnType<typeof getForumStats>>;
