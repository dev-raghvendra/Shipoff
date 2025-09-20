-- AlterEnum
ALTER TYPE "DeploymentStatus" ADD VALUE 'PROVISIONING';

-- CreateTable
CREATE TABLE "BuildEnviornment" (
    "buildId" TEXT NOT NULL,
    "deploymentId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "BuildEnviornment_pkey" PRIMARY KEY ("buildId")
);

-- CreateTable
CREATE TABLE "RuntimeEnviornment" (
    "runtimeId" TEXT NOT NULL,
    "deploymentId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "RuntimeEnviornment_pkey" PRIMARY KEY ("runtimeId")
);

-- AddForeignKey
ALTER TABLE "BuildEnviornment" ADD CONSTRAINT "BuildEnviornment_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "Deployment"("deploymentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RuntimeEnviornment" ADD CONSTRAINT "RuntimeEnviornment_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "Deployment"("deploymentId") ON DELETE CASCADE ON UPDATE CASCADE;
