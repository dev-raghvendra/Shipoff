/*
  Warnings:

  - The primary key for the `EnvironmentVariable` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `key` on the `EnvironmentVariable` table. All the data in the column will be lost.
  - Added the required column `name` to the `EnvironmentVariable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deployment" ALTER COLUMN "repositoryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EnvironmentVariable" DROP CONSTRAINT "EnvironmentVariable_pkey",
DROP COLUMN "key",
ADD COLUMN     "name" TEXT NOT NULL,
ADD CONSTRAINT "EnvironmentVariable_pkey" PRIMARY KEY ("projectId", "name");
