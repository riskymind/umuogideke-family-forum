-- AlterTable
ALTER TABLE "LevyPayment" ADD COLUMN "amountPaid" INTEGER;

-- Backfill: existing paid rows were recorded at the levy's amount.
UPDATE "LevyPayment" AS p
SET "amountPaid" = l."amount"
FROM "Levy" AS l
WHERE p."levyId" = l."id" AND p."paid" = true;
