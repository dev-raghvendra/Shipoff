-- DropForeignKey
ALTER TABLE "BuildEnvironment" DROP CONSTRAINT "BuildEnvironment_deploymentId_fkey";

-- DropForeignKey
ALTER TABLE "RuntimeEnvironment" DROP CONSTRAINT "RuntimeEnvironment_deploymentId_fkey";

-- AddForeignKey
ALTER TABLE "BuildEnvironment" ADD CONSTRAINT "BuildEnvironment_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "Deployment"("deploymentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RuntimeEnvironment" ADD CONSTRAINT "RuntimeEnvironment_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "Deployment"("deploymentId") ON DELETE CASCADE ON UPDATE CASCADE;
