-- DropForeignKey
ALTER TABLE "Repository" DROP CONSTRAINT "Repository_githubInstallationId_fkey";

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_githubInstallationId_fkey" FOREIGN KEY ("githubInstallationId") REFERENCES "GithubInstallation"("githubInstallationId") ON DELETE CASCADE ON UPDATE CASCADE;
