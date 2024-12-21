/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isDesigner` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isTechnician` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'TECHNICIAN', 'DESIGNER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isAdmin",
DROP COLUMN "isDesigner",
DROP COLUMN "isTechnician",
ADD COLUMN     "userType" "UserType";
