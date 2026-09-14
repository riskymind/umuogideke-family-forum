"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    throw new Error("Not authorized");
  }
}

export interface AddLevyInput {
  levyName: string;
  levyAmount: string;
  levyDate: string;
}

export async function addLevy(input: AddLevyInput) {
  await requireAdmin();
  const name = input.levyName.trim();
  const amount = Number(input.levyAmount) || 0;
  if (!name || !amount) return;

  const members = await prisma.member.findMany({ select: { id: true } });

  const levy = await prisma.levy.create({
    data: { name, amount, date: new Date(input.levyDate) },
  });

  await prisma.levyPayment.createMany({
    data: members.map((m) => ({ levyId: levy.id, memberId: m.id, paid: false })),
  });

  revalidatePath("/levies");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}

export interface UpdateLevyInput {
  levyName: string;
  levyAmount: string;
  levyDate: string;
}

export async function updateLevy(levyId: string, input: UpdateLevyInput) {
  await requireAdmin();
  const name = input.levyName.trim();
  const amount = Number(input.levyAmount) || 0;
  if (!name || !amount) return;

  await prisma.levy.update({
    where: { id: levyId },
    data: { name, amount, date: new Date(input.levyDate) },
  });

  revalidatePath("/levies");
  revalidatePath("/dashboard");
  revalidatePath("/members");
  revalidatePath("/reports");
}

export async function deleteLevy(levyId: string) {
  await requireAdmin();
  await prisma.levy.delete({ where: { id: levyId } });

  revalidatePath("/levies");
  revalidatePath("/dashboard");
  revalidatePath("/members");
  revalidatePath("/reports");
}

export async function toggleLevyPayment(levyId: string, memberId: string) {
  await requireAdmin();

  const payment = await prisma.levyPayment.findUnique({
    where: { levyId_memberId: { levyId, memberId } },
  });
  if (!payment) return;

  await prisma.levyPayment.update({
    where: { id: payment.id },
    data: { paid: !payment.paid },
  });

  revalidatePath("/levies");
  revalidatePath("/dashboard");
  revalidatePath("/members");
  revalidatePath("/reports");
}
