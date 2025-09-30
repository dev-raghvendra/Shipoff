-- AlterEnum
ALTER TYPE "DeploymentStatus" ADD VALUE 'PROVISIONING';

-- CreateTable
CREATE TABLE "BuildEnvironment" (
    "buildId" TEXT NOT NULL,
    "deploymentId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "BuildEnvironment_pkey" PRIMARY KEY ("buildId")
);

-- CreateTable
CREATE TABLE "RuntimeEnvironment" (
    "runtimeId" TEXT NOT NULL,
    "deploymentId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "RuntimeEnvironment_pkey" PRIMARY KEY ("runtimeId")
);

-- AddForeignKey
ALTER TABLE "BuildEnvironment" ADD CONSTRAINT "BuildEnvironment_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "Deployment"("deploymentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RuntimeEnvironment" ADD CONSTRAINT "RuntimeEnvironment_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "Deployment"("deploymentId") ON DELETE CASCADE ON UPDATE CASCADE;
