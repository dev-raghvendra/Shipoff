/*
  Warnings:

  - You are about to drop the column `githubRepoName` on the `Repository` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[githubRepoFullName]` on the table `Repository` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `githubRepoFullName` to the `Repository` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Repository_githubRepoName_key";

-- AlterTable
ALTER TABLE "Repository" DROP COLUMN "githubRepoName",
ADD COLUMN     "githubRepoFullName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Repository_githubRepoFullName_key" ON "Repository"("githubRepoFullName");
