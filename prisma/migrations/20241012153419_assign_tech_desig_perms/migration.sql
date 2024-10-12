/*
  Warnings:

  - The values [AsignOrders] on the enum `Permission` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Permission_new" AS ENUM ('ViewOrders', 'CreateOrders', 'UpdateOrders', 'DeleteOrders', 'AssignTechnician', 'AssignDesigner', 'FinishOrders', 'FinishTasks', 'ViewRoles', 'CreateRoles', 'UpdateRoles', 'DeleteRoles', 'ViewUsers', 'CreateUsers', 'UpdateUsers', 'DeleteUsers');
ALTER TABLE "Role" ALTER COLUMN "permissions" TYPE "Permission_new"[] USING ("permissions"::text::"Permission_new"[]);
ALTER TYPE "Permission" RENAME TO "Permission_old";
ALTER TYPE "Permission_new" RENAME TO "Permission";
DROP TYPE "Permission_old";
COMMIT;
