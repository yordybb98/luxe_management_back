-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isDesigner" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTechnician" BOOLEAN NOT NULL DEFAULT false;
