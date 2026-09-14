import { requireSession } from "@/lib/session";
import { getForumStats } from "@/lib/stats";
import { shortName } from "@/lib/dues";
import { LeviesPageClient } from "@/components/levies/LeviesPageClient";
import type { LevyCardData } from "@/components/levies/LevyCard";

export default async function LeviesPage() {
  const session = await requireSession();
  const isAdmin = session.user.role === "admin";
  const stats = await getForumStats();

  const levies: LevyCardData[] = stats.levies.map((lv) => {
    const collected = lv.payments.filter((p) => p.paid).length * lv.amount;
    return {
      id: lv.id,
      name: lv.name,
      amount: lv.amount,
      date: lv.date,
      collected,
      target: lv.payments.length * lv.amount,
      memberRows: stats.members.map((m) => {
        const payment = m.levyPayments.find((p) => p.levyId === lv.id);
        return { memberId: m.id, name: shortName(m.name), paid: payment?.paid ?? false };
      }),
    };
  });

  return <LeviesPageClient levies={levies} isAdmin={isAdmin} />;
}
