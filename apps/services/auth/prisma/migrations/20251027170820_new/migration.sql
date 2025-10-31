-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('READ', 'UPDATE', 'DELETE', 'CREATE', 'TRANSFER_OWNERSHIP', 'SELF_DELETE', 'SELF_UPDATE');

-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('GOOGLE', 'GITHUB', 'EMAIL');

-- CreateEnum
CREATE TYPE "TeamRoleType" AS ENUM ('TEAM_OWNER', 'TEAM_DEVELOPER', 'TEAM_ADMIN', 'TEAM_VIEWER');

-- CreateEnum
CREATE TYPE "ProjectRoleType" AS ENUM ('PROJECT_OWNER', 'PROJECT_DEVELOPER', 'PROJECT_ADMIN', 'PROJECT_VIEWER');

-- CreateEnum
CREATE TYPE "ScopeType" AS ENUM ('PROJECT', 'TEAM', 'DEPLOYMENT', 'TEAM_MEMBER', 'PROJECT_MEMBER', 'TEAM_LINK');

-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatarUri" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "provider" "ProviderType" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Team" (
    "teamId" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "description" TEXT,
    "planType" TEXT NOT NULL DEFAULT 'free',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Team_pkey" PRIMARY KEY ("teamId")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "role" "TeamRoleType" NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("userId","teamId")
);

-- CreateTable
CREATE TABLE "ProjectMember" (
    "userId" TEXT NOT NULL,
    "role" "ProjectRoleType" NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("userId","projectId")
);

-- CreateTable
CREATE TABLE "TeamMemberInvitation" (
    "inviteId" TEXT NOT NULL,
    "role" "TeamRoleType" NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) DEFAULT (now() + interval '7 days'),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "TeamMemberInvitation_pkey" PRIMARY KEY ("inviteId")
);

-- CreateTable
CREATE TABLE "ProjectMemberInvitation" (
    "inviteId" TEXT NOT NULL,
    "role" "ProjectRoleType" NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) DEFAULT (now() + interval '7 days'),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ProjectMemberInvitation_pkey" PRIMARY KEY ("inviteId")
);

-- CreateTable
CREATE TABLE "TeamLink" (
    "teamId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "linkedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamLink_pkey" PRIMARY KEY ("teamId","projectId")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "subscriptionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "SubscriptionType" NOT NULL,
    "freePerksId" TEXT,
    "proPerksId" TEXT,
    "startedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("subscriptionId")
);

-- CreateTable
CREATE TABLE "FreePerks" (
    "perkId" TEXT NOT NULL,
    "staticProjects" INTEGER NOT NULL DEFAULT 4,
    "dynamicProjects" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "FreePerks_pkey" PRIMARY KEY ("perkId")
);

-- CreateTable
CREATE TABLE "ProPerks" (
    "perkId" TEXT NOT NULL,
    "staticProjects" INTEGER NOT NULL DEFAULT 20,
    "dynamicProjects" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "ProPerks_pkey" PRIMARY KEY ("perkId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("teamId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMemberInvitation" ADD CONSTRAINT "TeamMemberInvitation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("teamId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamLink" ADD CONSTRAINT "TeamLink_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("teamId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_freePerksId_fkey" FOREIGN KEY ("freePerksId") REFERENCES "FreePerks"("perkId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_proPerksId_fkey" FOREIGN KEY ("proPerksId") REFERENCES "ProPerks"("perkId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
