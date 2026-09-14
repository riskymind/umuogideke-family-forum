import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      role: "admin" | "member";
      memberId?: string;
      name?: string | null;
    };
  }
}

type ExtraTokenFields = {
  role?: "admin" | "member";
  memberId?: string;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      id: "admin-credentials",
      name: "Admin",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username;
        const password = credentials?.password;
        if (typeof username !== "string" || typeof password !== "string") return null;

        const admin = await prisma.admin.findUnique({ where: { username } });
        if (!admin) return null;

        const valid = await bcrypt.compare(password, admin.passwordHash);
        if (!valid) return null;

        return { id: admin.id, name: "Family Admin", role: "admin" as const };
      },
    }),
    Credentials({
      id: "member-credentials",
      name: "Member",
      credentials: {
        memberId: { label: "Member", type: "text" },
        pin: { label: "PIN", type: "text" },
      },
      async authorize(credentials) {
        const memberId = credentials?.memberId;
        const pin = credentials?.pin;
        if (typeof memberId !== "string" || typeof pin !== "string") return null;
        if (pin.length !== 4) return null;

        const member = await prisma.member.findUnique({ where: { id: memberId } });
        if (!member) return null;

        const last4 = member.phone.replace(/\D/g, "").slice(-4);
        if (last4 !== pin) return null;

        return {
          id: member.id,
          name: member.name,
          role: "member" as const,
          memberId: member.id,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const t = token as typeof token & ExtraTokenFields;
      if (user) {
        const u = user as { role?: "admin" | "member"; memberId?: string };
        t.role = u.role;
        t.memberId = u.memberId;
        t.name = user.name;
      }
      return t;
    },
    async session({ session, token }) {
      const t = token as typeof token & ExtraTokenFields;
      session.user.role = t.role ?? "member";
      session.user.memberId = t.memberId;
      session.user.name = t.name;
      return session;
    },
  },
});
