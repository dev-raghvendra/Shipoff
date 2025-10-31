-- DropForeignKey
ALTER TABLE "Deployment" DROP CONSTRAINT "Deployment_repositoryId_fkey";

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("repositoryId") ON DELETE SET NULL ON UPDATE CASCADE;
