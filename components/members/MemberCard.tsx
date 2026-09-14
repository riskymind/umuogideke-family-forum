"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { avatarColor, initials } from "@/lib/dues";

export interface MemberCardData {
  id: string;
  name: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
  owed: number;
  owedLabel: string;
  index: number;
}

export function MemberCard({
  member,
  onOpen,
}: {
  member: MemberCardData;
  onOpen: (id: string) => void;
}) {
  const isActive = member.status === "ACTIVE";
  return (
    <div
      onClick={() => onOpen(member.id)}
      className="cursor-pointer"
    >
      <Card className="p-4.5">
        <div className="mb-3 flex items-center gap-3">
          <div
            className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-full text-[15px] font-bold text-cream"
            style={{ background: avatarColor(member.index) }}
          >
            {initials(member.name)}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold text-ink">{member.name}</div>
            <div className="text-xs text-muted">{member.phone}</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Badge
            style={
              isActive
                ? { background: "var(--color-green-bg)", color: "var(--color-green)" }
                : { background: "var(--color-chip-bg)", color: "var(--color-muted-light)" }
            }
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
          <div
            className="text-[13px] font-semibold"
            style={{ color: member.owed > 0 ? "var(--color-terracotta)" : "var(--color-green)" }}
          >
            {member.owedLabel}
          </div>
        </div>
      </Card>
    </div>
  );
}
