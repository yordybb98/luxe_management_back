-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('ViewClients', 'CreateClients', 'UpdateClients', 'DeleteClients', 'ViewDepartments', 'CreateDepartments', 'UpdateDepartments', 'DeleteDepartments', 'ViewOrders', 'CreateOrders', 'UpdateOrders', 'DeleteOrders', 'ViewProjects', 'CreateProjects', 'UpdateProjects', 'DeleteProjects', 'ViewRoles', 'CreateRoles', 'UpdateRoles', 'DeleteRoles', 'ViewStatus', 'CreateStatus', 'UpdateStatus', 'DeleteStatus', 'ViewUsers', 'CreateUsers', 'UpdateUsers', 'DeleteUsers');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "permissions" "Permission"[],

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
