import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { LoginForm } from "@/components/login/LoginForm";

export default async function LoginPage() {
  // Nothing else here reads request data, so without this the page is
  // prerendered at build time and keeps listing members deleted since.
  await connection();

  const members = await prisma.member.findMany({
    where: { status: "ACTIVE" },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-cream p-6">
      <LoginForm members={members} />
    </div>
  );
}
