-- AlterTable
ALTER TABLE "ProjectMemberInvitation" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '7 days');

-- AlterTable
ALTER TABLE "TeamMemberInvitation" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '7 days');
