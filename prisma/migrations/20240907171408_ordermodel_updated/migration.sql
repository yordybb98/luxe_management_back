/*
  Warnings:

  - You are about to drop the column `address` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "address",
DROP COLUMN "phone",
ADD COLUMN     "clientId" INTEGER;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
