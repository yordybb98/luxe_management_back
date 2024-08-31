import { Permission, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPermissions: Permission[] = Object.values(Permission);

  let adminRoleExists = await prisma.role.findFirst({
    where: { permissions: { hasEvery: adminPermissions } },
  });

  if (!adminRoleExists) {
    adminRoleExists = await prisma.role.create({
      data: {
        name: 'Admin',
        permissions: adminPermissions,
        description: 'Default admin role',
      },
    });

    console.log('Default admin role created');
  }

  let adminExists = await prisma.user.findFirst({
    where: { role: { name: 'Admin' } },
  });

  if (!adminExists) {
    // Crear un usuario admin por defecto
    const hashedPassword = await bcrypt.hash('admin', 10);

    adminExists = await prisma.user.create({
      data: {
        name: 'Admin',
        username: 'admin',
        email: 'admin@localhost',
        password: hashedPassword,
        roleId: adminRoleExists.id,
      },
    });
    console.log('Default admin user created');
  } else {
    console.log('Admin user already exists');
  }

  console.log('Admin User:', adminExists);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
