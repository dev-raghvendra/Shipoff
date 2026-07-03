-- AlterTable
ALTER TABLE "ProjectMemberInvitation" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '7 days');

-- AlterTable
ALTER TABLE "TeamMemberInvitation" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '7 days');

-- CreateTable
CREATE TABLE "OAuthClients" (
    "clientId" TEXT NOT NULL,
    "clientName" TEXT,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OAuthClients_pkey" PRIMARY KEY ("clientId")
);
