"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

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
