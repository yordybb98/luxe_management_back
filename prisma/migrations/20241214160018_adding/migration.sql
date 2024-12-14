/*
  Warnings:

  - Added the required column `source` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SUCESS', 'ERROR', 'INFO', 'WARNING');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "source" TEXT NOT NULL,
ADD COLUMN     "type" "NotificationType" NOT NULL,
ALTER COLUMN "message" SET DATA TYPE TEXT;
