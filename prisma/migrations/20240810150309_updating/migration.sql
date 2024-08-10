/*
  Warnings:

  - You are about to drop the `_Assignments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Assignments" DROP CONSTRAINT "_Assignments_A_fkey";

-- DropForeignKey
ALTER TABLE "_Assignments" DROP CONSTRAINT "_Assignments_B_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "projectId" INTEGER;

-- DropTable
DROP TABLE "_Assignments";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
