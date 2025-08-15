-- DropIndex
DROP INDEX "User_avatarUri_key";

-- DropIndex
DROP INDEX "User_password_key";

-- AlterTable
ALTER TABLE "ProjectMemberInvitation" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '7 days');

-- AlterTable
ALTER TABLE "TeamMemberInvitation" ALTER COLUMN "expiresAt" DROP NOT NULL,
ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '7 days');
