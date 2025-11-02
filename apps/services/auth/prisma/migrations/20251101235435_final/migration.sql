-- AlterTable
ALTER TABLE "FreePerks" ADD COLUMN     "cpuLimitPercent" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "memoryLimitMB" INTEGER NOT NULL DEFAULT 512;

-- AlterTable
ALTER TABLE "ProPerks" ADD COLUMN     "cpuLimitPercent" INTEGER NOT NULL DEFAULT 90,
ADD COLUMN     "memoryLimitMB" INTEGER NOT NULL DEFAULT 2048;

-- AlterTable
ALTER TABLE "ProjectMemberInvitation" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '7 days');

-- AlterTable
ALTER TABLE "TeamMemberInvitation" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '7 days');
