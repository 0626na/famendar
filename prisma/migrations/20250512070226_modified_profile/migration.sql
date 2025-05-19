/*
  Warnings:

  - Made the column `updated_at` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL;
