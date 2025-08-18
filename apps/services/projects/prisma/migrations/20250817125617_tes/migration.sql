/*
  Warnings:

  - You are about to drop the column `productionCommand` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "productionCommand",
ADD COLUMN     "prodCommand" TEXT DEFAULT '';
