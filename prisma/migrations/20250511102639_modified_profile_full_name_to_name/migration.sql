/*
  Warnings:

  - You are about to drop the column `full_name` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "full_name",
ADD COLUMN     "name" TEXT;
