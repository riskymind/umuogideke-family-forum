"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    throw new Error("Not authorized");
  }
  return session;
}

const DEFAULT_DUES_AMOUNT = 200;

export interface AddMeetingInput {
  title: string;
  meetingDate: string;
}

export async function addMeeting(input: AddMeetingInput) {
  await requireAdmin();
  const title = input.title.trim();
  if (!title) return;

  const members = await prisma.member.findMany({ select: { id: true } });

  const meeting = await prisma.meeting.create({
    data: {
      title,
      date: new Date(input.meetingDate),
      duesAmount: DEFAULT_DUES_AMOUNT,
    },
  });

  await prisma.meetingPayment.createMany({
    data: members.map((m) => ({ meetingId: meeting.id, memberId: m.id, paid: false })),
  });

  revalidatePath("/meetings");
  revalidatePath("/dashboard");
  revalidatePath("/payments");
  revalidatePath("/reports");
}

export async function toggleMeetingPayment(meetingId: string, memberId: string) {
  await requireAdmin();

  const payment = await prisma.meetingPayment.findUnique({
    where: { meetingId_memberId: { meetingId, memberId } },
  });
  if (!payment) return;

  await prisma.meetingPayment.update({
    where: { id: payment.id },
    data: { paid: !payment.paid },
  });

  revalidatePath("/meetings");
  revalidatePath("/dashboard");
  revalidatePath("/payments");
  revalidatePath("/members");
  revalidatePath("/reports");
}

export async function setMeetingMinutes(meetingId: string, url: string, name: string) {
  await requireAdmin();
  await prisma.meeting.update({
    where: { id: meetingId },
    data: { minutesUrl: url, minutesName: name },
  });
  revalidatePath("/meetings");
}

export interface UpdateMeetingInput {
  title: string;
  meetingDate: string;
}

export async function updateMeeting(meetingId: string, input: UpdateMeetingInput) {
  await requireAdmin();
  const title = input.title.trim();
  if (!title) return;

  await prisma.meeting.update({
    where: { id: meetingId },
    data: { title, date: new Date(input.meetingDate) },
  });

  revalidatePath("/meetings");
  revalidatePath("/dashboard");
  revalidatePath("/payments");
  revalidatePath("/reports");
}

export async function deleteMeeting(meetingId: string) {
  await requireAdmin();
  await prisma.meeting.delete({ where: { id: meetingId } });

  revalidatePath("/meetings");
  revalidatePath("/dashboard");
  revalidatePath("/payments");
  revalidatePath("/members");
  revalidatePath("/reports");
}
