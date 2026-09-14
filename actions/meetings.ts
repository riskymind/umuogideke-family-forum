"use server";

import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    throw new Error("Not authorized");
  }
  return session;
}

const utapi = new UTApi();

/** Meeting minutes are only stored as a URL, so pull the UploadThing file key back out of it. */
function fileKeyFromUrl(url: string): string | null {
  try {
    const segments = new URL(url).pathname.split("/").filter(Boolean);
    return segments.at(-1) ?? null;
  } catch {
    return null;
  }
}

async function deleteMinutesFile(url: string | null | undefined) {
  if (!url) return;
  const key = fileKeyFromUrl(url);
  if (!key) return;
  try {
    await utapi.deleteFiles(key);
  } catch (err) {
    // Storage cleanup failing shouldn't block the DB update from succeeding.
    console.error("Failed to delete meeting minutes file from storage", err);
  }
}

const DEFAULT_DUES_AMOUNT = 200;

/** Parse an admin-entered dues amount, falling back to the default when blank or invalid. */
function parseDuesAmount(input: string | undefined): number {
  const amount = Number(input);
  return Number.isFinite(amount) && amount > 0 ? amount : DEFAULT_DUES_AMOUNT;
}

export interface AddMeetingInput {
  title: string;
  meetingDate: string;
  duesAmount?: string;
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
      duesAmount: parseDuesAmount(input.duesAmount),
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

  const existing = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: { minutesUrl: true },
  });

  await prisma.meeting.update({
    where: { id: meetingId },
    data: { minutesUrl: url, minutesName: name },
  });

  if (existing?.minutesUrl && existing.minutesUrl !== url) {
    await deleteMinutesFile(existing.minutesUrl);
  }

  revalidatePath("/meetings");
}

/** Remove the uploaded minutes from a meeting without deleting the meeting itself. */
export async function removeMeetingMinutes(meetingId: string) {
  await requireAdmin();

  const existing = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: { minutesUrl: true },
  });

  await prisma.meeting.update({
    where: { id: meetingId },
    data: { minutesUrl: null, minutesName: null },
  });

  await deleteMinutesFile(existing?.minutesUrl);

  revalidatePath("/meetings");
}

export interface UpdateMeetingInput {
  title: string;
  meetingDate: string;
  duesAmount?: string;
}

export async function updateMeeting(meetingId: string, input: UpdateMeetingInput) {
  await requireAdmin();
  const title = input.title.trim();
  if (!title) return;

  await prisma.meeting.update({
    where: { id: meetingId },
    data: {
      title,
      date: new Date(input.meetingDate),
      duesAmount: parseDuesAmount(input.duesAmount),
    },
  });

  revalidatePath("/meetings");
  revalidatePath("/dashboard");
  revalidatePath("/payments");
  revalidatePath("/reports");
}

export async function deleteMeeting(meetingId: string) {
  await requireAdmin();

  const existing = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: { minutesUrl: true },
  });

  await prisma.meeting.delete({ where: { id: meetingId } });
  await deleteMinutesFile(existing?.minutesUrl);

  revalidatePath("/meetings");
  revalidatePath("/dashboard");
  revalidatePath("/payments");
  revalidatePath("/members");
  revalidatePath("/reports");
}
