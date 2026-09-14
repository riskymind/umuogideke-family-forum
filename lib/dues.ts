/**
 * Shared formatting / money-math helpers, ported 1:1 from the Umuogideke
 * Family Forum design prototype so the real app matches its behavior.
 */

export function fmt(n: number): string {
  return Math.round(n).toLocaleString("en-NG");
}

/** Strip the "Chief " honorific and the family surname to get a short display name. */
export function shortName(name: string): string {
  return name.replace("Chief ", "");
}

export function initials(name: string): string {
  const cleaned = name
    .replace("Chief ", "")
    .replaceAll("Umuogideke-", "")
    .replaceAll("Umuogideke", "")
    .trim();
  const parts = cleaned.split(" ").filter(Boolean);
  const value = ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
  return value || name[0]?.toUpperCase() || "?";
}

export function dateLabel(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function shortDateLabel(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export const AVATAR_COLORS = [
  "#A6472A",
  "#3F6B4A",
  "#B8862F",
  "#6B5D4F",
  "#7C3319",
  "#3E5C76",
];

export function avatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

type PaymentLike = { paid: boolean };

export interface OwedInput {
  meetingPayments: { paid: boolean; meeting: { duesAmount: number } }[];
  levyPayments: { paid: boolean; levy: { amount: number } }[];
}

/** Total amount a member currently owes across unpaid meeting dues and unpaid levies. */
export function computeMemberOwed(member: OwedInput): number {
  let owed = 0;
  for (const p of member.meetingPayments) {
    if (!p.paid) owed += p.meeting.duesAmount;
  }
  for (const p of member.levyPayments) {
    if (!p.paid) owed += p.levy.amount;
  }
  return owed;
}

export function paidCount(payments: PaymentLike[]): number {
  return payments.filter((p) => p.paid).length;
}
