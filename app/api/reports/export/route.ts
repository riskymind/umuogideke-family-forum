import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getForumStats } from "@/lib/stats";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const stats = await getForumStats();

  let csv = "Member,Phone,Status,Total Owed (NGN)\n";
  for (const m of stats.members) {
    const owed = stats.owedByMember.get(m.id) ?? 0;
    const status = m.status === "ACTIVE" ? "Active" : "Inactive";
    csv += `"${m.name}","${m.phone}","${status}","${owed}"\n`;
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="umuogideke-dues-report.csv"',
    },
  });
}
