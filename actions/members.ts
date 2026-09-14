"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MemberStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    throw new Error("Not authorized");
  }
}

export interface AddMemberInput {
  name: string;
  phone: string;
  joinDate: string;
  status: "Active" | "Inactive";
}

export async function addMember(input: AddMemberInput) {
  await requireAdmin();
  const name = input.name.trim();
  if (!name) return;

  const member = await prisma.member.create({
    data: {
      name,
      phone: input.phone.trim(),
      joinDate: new Date(input.joinDate),
      status: input.status === "Active" ? MemberStatus.ACTIVE : MemberStatus.INACTIVE,
    },
  });

  // New member starts unpaid on every existing meeting/levy, matching the mockup.
  const [meetings, levies] = await Promise.all([
    prisma.meeting.findMany({ select: { id: true } }),
    prisma.levy.findMany({ select: { id: true } }),
  ]);

  await prisma.$transaction([
    ...meetings.map((mt) =>
      prisma.meetingPayment.create({
        data: { meetingId: mt.id, memberId: member.id, paid: false },
      })
    ),
    ...levies.map((lv) =>
      prisma.levyPayment.create({
        data: { levyId: lv.id, memberId: member.id, paid: false },
      })
    ),
  ]);

  revalidatePath("/members");
  revalidatePath("/dashboard");
  revalidatePath("/payments");
  revalidatePath("/levies");
  revalidatePath("/reports");
}

export interface UpdateMemberInput {
  name: string;
  phone: string;
  joinDate: string;
  status: "Active" | "Inactive";
}

export async function updateMember(id: string, input: UpdateMemberInput) {
  await requireAdmin();
  const name = input.name.trim();
  if (!name) return;

  await prisma.member.update({
    where: { id },
    data: {
      name,
      phone: input.phone.trim(),
      joinDate: new Date(input.joinDate),
      status: input.status === "Active" ? MemberStatus.ACTIVE : MemberStatus.INACTIVE,
    },
  });

  revalidatePath("/members");
  revalidatePath("/dashboard");
  revalidatePath("/payments");
  revalidatePath("/levies");
  revalidatePath("/reports");
}

export async function deleteMember(id: string) {
  await requireAdmin();
  await prisma.member.delete({ where: { id } });

  revalidatePath("/members");
  revalidatePath("/dashboard");
  revalidatePath("/payments");
  revalidatePath("/levies");
  revalidatePath("/meetings");
  revalidatePath("/reports");
}
