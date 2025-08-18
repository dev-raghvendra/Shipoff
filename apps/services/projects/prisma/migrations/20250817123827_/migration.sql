/*
  Warnings:

  - You are about to drop the column `defaultBuildCmd` on the `Framework` table. All the data in the column will be lost.
  - You are about to drop the column `defaultProdCmd` on the `Framework` table. All the data in the column will be lost.
  - Added the required column `defaultBuildCommand` to the `Framework` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Framework" DROP COLUMN "defaultBuildCmd",
DROP COLUMN "defaultProdCmd",
ADD COLUMN     "defaultBuildCommand" TEXT NOT NULL,
ADD COLUMN     "defaultProdCommand" TEXT DEFAULT '';
