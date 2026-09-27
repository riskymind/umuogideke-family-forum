"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { auth, signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MIN_PASSWORD_LENGTH = 8;

export interface LoginResult {
  error?: string;
}

export async function loginAsAdmin(username: string, password: string): Promise<LoginResult> {
  try {
    await signIn("admin-credentials", {
      username,
      password,
      redirectTo: "/dashboard",
    });
    return {};
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Incorrect username or password." };
    }
    throw err;
  }
}

export async function loginAsMember(memberId: string, pin: string): Promise<LoginResult> {
  try {
    await signIn("member-credentials", {
      memberId,
      pin,
      redirectTo: "/dashboard",
    });
    return {};
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "That doesn't match our records. Check the last 4 digits of your phone." };
    }
    throw err;
  }
}

export interface ChangePasswordResult {
  error?: string;
}

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResult> {
  const session = await auth();
  if (!session || session.user.role !== "admin" || !session.user.adminId) {
    return { error: "Not authorized." };
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return { error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
  }

  const admin = await prisma.admin.findUnique({ where: { id: session.user.adminId } });
  if (!admin) return { error: "Admin account not found." };

  const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!valid) return { error: "Current password is incorrect." };

  if (await bcrypt.compare(newPassword, admin.passwordHash)) {
    return { error: "New password must be different from the current one." };
  }

  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash: await bcrypt.hash(newPassword, 10) },
  });
  return {};
}
