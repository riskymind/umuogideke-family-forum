import "dotenv/config";
import { PrismaClient, MemberStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Ported 1:1 from the design prototype's seed data so the app matches the mockup.
const MEMBER_SEED = [
  { id: "m1", name: "Chief Okechukwu Umuogideke", phone: "0803 111 2201", joinDate: "2015-01-10", status: "Active" },
  { id: "m2", name: "Ngozi Umuogideke-Eze", phone: "0805 222 3302", joinDate: "2015-01-10", status: "Active" },
  { id: "m3", name: "Chidi Umuogideke", phone: "0806 333 4403", joinDate: "2016-03-22", status: "Active" },
  { id: "m4", name: "Adaeze Umuogideke", phone: "0807 444 5504", joinDate: "2016-03-22", status: "Active" },
  { id: "m5", name: "Emeka Umuogideke", phone: "0808 555 6605", joinDate: "2017-06-14", status: "Active" },
  { id: "m6", name: "Ifeoma Umuogideke-Nwosu", phone: "0809 666 7706", joinDate: "2018-02-02", status: "Active" },
  { id: "m7", name: "Obinna Umuogideke", phone: "0810 777 8807", joinDate: "2019-09-18", status: "Active" },
  { id: "m8", name: "Chinwe Umuogideke", phone: "0811 888 9908", joinDate: "2020-11-05", status: "Active" },
  { id: "m9", name: "Kelechi Umuogideke", phone: "0812 999 0009", joinDate: "2021-04-30", status: "Inactive" },
  { id: "m10", name: "Uchenna Umuogideke", phone: "0813 000 1110", joinDate: "2022-07-19", status: "Active" },
] as const;

const MEETING_SEED = [
  { id: "mt1", title: "Q1 General Meeting", date: "2026-01-11", minutesName: "Minutes_2026-01-11.pdf" },
  { id: "mt2", title: "Ordinary Meeting", date: "2026-03-08", minutesName: "Minutes_2026-03-08.pdf" },
  { id: "mt3", title: "Ordinary Meeting", date: "2026-05-10", minutesName: "Minutes_2026-05-10.pdf" },
  { id: "mt4", title: "Mid-Year Meeting", date: "2026-07-12", minutesName: "Minutes_2026-07-12.pdf" },
  { id: "mt5", title: "September Meeting", date: "2026-09-13", minutesName: null },
] as const;

const LEVY_SEED = [
  { id: "lv1", name: "Wedding Levy — Chief's Daughter", amount: 5000, date: "2026-02-14" },
  { id: "lv2", name: "Burial Support — Pa James", amount: 10000, date: "2026-06-20" },
] as const;

const DUES_AMOUNT = 200;

async function main() {
  const adminUsername = process.env.SEED_ADMIN_USERNAME ?? "admin";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "umuogideke2026";

  await prisma.admin.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  await Promise.all(
    MEMBER_SEED.map((m) =>
      prisma.member.upsert({
        where: { id: m.id },
        update: {},
        create: {
          id: m.id,
          name: m.name,
          phone: m.phone,
          joinDate: new Date(m.joinDate),
          status: m.status === "Active" ? MemberStatus.ACTIVE : MemberStatus.INACTIVE,
        },
      })
    )
  );

  for (const [i, mt] of MEETING_SEED.entries()) {
    await prisma.meeting.upsert({
      where: { id: mt.id },
      update: {},
      create: {
        id: mt.id,
        title: mt.title,
        date: new Date(mt.date),
        duesAmount: DUES_AMOUNT,
        minutesName: mt.minutesName,
        // The mockup doesn't seed a minutes URL for its demo data — the file itself
        // never existed. Leave minutesUrl null even when minutesName is set.
      },
    });

    await Promise.all(
      MEMBER_SEED.map((m, mi) => {
        let paid = (mi * 7 + i * 3) % 5 !== 0;
        if (m.id === "m9") paid = i < 1;
        if (m.id === "m10") paid = i % 2 === 0 && i < 3;
        if (m.id === "m1") paid = true;
        if (mt.minutesName === null) paid = false;

        return prisma.meetingPayment.upsert({
          where: { meetingId_memberId: { meetingId: mt.id, memberId: m.id } },
          update: {},
          create: { meetingId: mt.id, memberId: m.id, paid },
        });
      })
    );
  }

  for (const [i, lv] of LEVY_SEED.entries()) {
    await prisma.levy.upsert({
      where: { id: lv.id },
      update: {},
      create: { id: lv.id, name: lv.name, amount: lv.amount, date: new Date(lv.date) },
    });

    await Promise.all(
      MEMBER_SEED.map((m, mi) =>
        prisma.levyPayment.upsert({
          where: { levyId_memberId: { levyId: lv.id, memberId: m.id } },
          update: {},
          create: { levyId: lv.id, memberId: m.id, paid: (mi + i) % 3 !== 0 },
        })
      )
    );
  }

  console.log("Seed complete.");
  console.log(`Admin login → username: "${adminUsername}", password: "${adminPassword}"`);
  console.log("Change these via SEED_ADMIN_USERNAME / SEED_ADMIN_PASSWORD env vars before reseeding a real deployment.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
