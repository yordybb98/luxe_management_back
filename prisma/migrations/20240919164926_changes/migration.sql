/*
  Warnings:

  - The values [ViewClients,CreateClients,UpdateClients,DeleteClients,ViewDepartments,CreateDepartments,UpdateDepartments,DeleteDepartments,ViewProjects,CreateProjects,UpdateProjects,DeleteProjects,ViewStatus,CreateStatus,UpdateStatus,DeleteStatus] on the enum `Permission` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Permission_new" AS ENUM ('ViewOrders', 'CreateOrders', 'UpdateOrders', 'DeleteOrders', 'ViewRoles', 'CreateRoles', 'UpdateRoles', 'DeleteRoles', 'ViewUsers', 'CreateUsers', 'UpdateUsers', 'DeleteUsers');
ALTER TABLE "Role" ALTER COLUMN "permissions" TYPE "Permission_new"[] USING ("permissions"::text::"Permission_new"[]);
ALTER TYPE "Permission" RENAME TO "Permission_old";
ALTER TYPE "Permission_new" RENAME TO "Permission";
DROP TYPE "Permission_old";
COMMIT;
