/*
  Warnings:

  - You are about to drop the column `production` on the `Deployment` table. All the data in the column will be lost.
  - Made the column `status` on table `Deployment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Deployment" DROP COLUMN "production",
ADD COLUMN     "lastDeployedAt" TIMESTAMP(3),
ALTER COLUMN "status" SET NOT NULL;
