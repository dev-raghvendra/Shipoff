/*
  Warnings:

  - A unique constraint covering the columns `[projectId,githubRepoId]` on the table `Repository` will be added. If there are existing duplicate values, this will fail.
  - Made the column `repositoryId` on table `Deployment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Deployment" DROP CONSTRAINT "Deployment_repositoryId_fkey";

-- DropForeignKey
ALTER TABLE "Repository" DROP CONSTRAINT "Repository_githubInstallationId_fkey";

-- DropIndex
DROP INDEX "Repository_githubRepoFullName_key";

-- DropIndex
DROP INDEX "Repository_githubRepoId_key";

-- DropIndex
DROP INDEX "Repository_githubRepoURI_key";

-- DropIndex
DROP INDEX "Repository_projectId_key";

-- AlterTable
ALTER TABLE "Deployment" ALTER COLUMN "repositoryId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "isConnected" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Repository_projectId_githubRepoId_key" ON "Repository"("projectId", "githubRepoId");

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_githubInstallationId_fkey" FOREIGN KEY ("githubInstallationId") REFERENCES "GithubInstallation"("githubInstallationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("repositoryId") ON DELETE CASCADE ON UPDATE CASCADE;
