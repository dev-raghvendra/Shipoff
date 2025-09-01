-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('STATIC', 'DYNAMIC');

-- CreateEnum
CREATE TYPE "DeploymentStatus" AS ENUM ('QUEUED', 'INACTIVE', 'FAILED', 'PRODUCTION', 'BUILDING');

-- CreateEnum
CREATE TYPE "Runtime" AS ENUM ('NODEJS', 'PYTHON', 'PHP');

-- CreateTable
CREATE TABLE "Project" (
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "prodCommand" TEXT DEFAULT 'N/A',
    "buildCommand" TEXT NOT NULL,
    "frameworkId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "outDir" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("projectId")
);

-- CreateTable
CREATE TABLE "GithubInstallation" (
    "githubInstallationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "githubUserName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "GithubInstallation_pkey" PRIMARY KEY ("githubInstallationId")
);

-- CreateTable
CREATE TABLE "Framework" (
    "frameworkId" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "applicationType" "ProjectType" NOT NULL,
    "defaultBuildCommand" TEXT NOT NULL,
    "defaultProdCommand" TEXT DEFAULT 'N/A',
    "runtime" "Runtime" NOT NULL,
    "outDir" TEXT NOT NULL,

    CONSTRAINT "Framework_pkey" PRIMARY KEY ("frameworkId")
);

-- CreateTable
CREATE TABLE "Repository" (
    "repositoryId" TEXT NOT NULL,
    "githubInstallationId" TEXT NOT NULL,
    "githubRepoFullName" TEXT NOT NULL,
    "githubRepoId" TEXT NOT NULL,
    "githubRepoURI" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "branch" TEXT DEFAULT 'main',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("repositoryId")
);

-- CreateTable
CREATE TABLE "Deployment" (
    "deploymentId" TEXT NOT NULL,
    "commitHash" TEXT NOT NULL,
    "status" "DeploymentStatus" DEFAULT 'QUEUED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "commitMessage" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "production" BOOLEAN DEFAULT false,

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("deploymentId")
);

-- CreateTable
CREATE TABLE "EnvironmentVariable" (
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "EnvironmentVariable_pkey" PRIMARY KEY ("projectId","name")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_domain_key" ON "Project"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "GithubInstallation_userId_key" ON "GithubInstallation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Framework_name_key" ON "Framework"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Framework_displayName_key" ON "Framework"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "Repository_githubRepoFullName_key" ON "Repository"("githubRepoFullName");

-- CreateIndex
CREATE UNIQUE INDEX "Repository_githubRepoId_key" ON "Repository"("githubRepoId");

-- CreateIndex
CREATE UNIQUE INDEX "Repository_githubRepoURI_key" ON "Repository"("githubRepoURI");

-- CreateIndex
CREATE UNIQUE INDEX "Repository_projectId_key" ON "Repository"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Deployment_commitHash_key" ON "Deployment"("commitHash");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "Framework"("frameworkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("projectId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_githubInstallationId_fkey" FOREIGN KEY ("githubInstallationId") REFERENCES "GithubInstallation"("githubInstallationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("projectId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("repositoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvironmentVariable" ADD CONSTRAINT "EnvironmentVariable_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("projectId") ON DELETE CASCADE ON UPDATE CASCADE;
