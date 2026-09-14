import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { Shell, type NavItem } from "@/components/layout/Shell";
import { shortName } from "@/lib/dues";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const isAdmin = session.user.role === "admin";

  const navDefs: [string, string, string][] = isAdmin
    ? [
        ["dashboard", "/dashboard", "Dashboard"],
        ["members", "/members", "Members"],
        ["meetings", "/meetings", "Meetings & Minutes"],
        ["payments", "/payments", "Dues Ledger"],
        ["levies", "/levies", "Levies"],
        ["reports", "/reports", "Reports"],
      ]
    : [
        ["dashboard", "/dashboard", "My Dashboard"],
        ["meetings", "/meetings", "Meetings & Minutes"],
        ["payments", "/payments", "My Dues"],
        ["levies", "/levies", "Levies"],
      ];

  const navItems: NavItem[] = navDefs.map(([key, href, label]) => ({ key, href, label }));

  let currentUserName = "Family Admin";
  if (!isAdmin && session.user.memberId) {
    const member = await prisma.member.findUnique({
      where: { id: session.user.memberId },
      select: { name: true },
    });
    currentUserName = member ? shortName(member.name) : "Member";
  }

  return (
    <Shell
      navItems={navItems}
      currentUserName={currentUserName}
      roleLabel={isAdmin ? "Administrator" : "Member · view only"}
    >
      {children}
    </Shell>
  );
}
