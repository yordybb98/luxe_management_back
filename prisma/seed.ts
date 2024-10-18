import { Permission, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askForPassword() {
  return new Promise((resolve) => {
    rl.stdoutMuted = true; // Mute the output for password
    rl.question('Enter your password: ', (password) => {
      rl.stdoutMuted = false; // Unmute for next question
      console.log('\n');
      resolve(password);
    });

    // Mute the output while typing
    rl._writeToOutput = function (string) {
      if (rl.stdoutMuted) {
        // Don't print anything to the console
        rl.output.write('\u001b[2K\u001b[200D'); // Clear the line
      } else {
        rl.output.write(string);
      }
    };
  });
}

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
    console.log('--------------------');
    console.log('Default admin role created');
  }

  let designerRoleExists = await prisma.role.findFirst({
    where: { name: 'Designer' },
  });

  if (!designerRoleExists) {
    designerRoleExists = await prisma.role.create({
      data: {
        name: 'Designer',
        permissions: [],
        description: 'Default Designer role',
      },
    });

    console.log('--------------------');
    console.log('Default Designer role created');
  }

  let technicianRoleExists = await prisma.role.findFirst({
    where: { name: 'Technician' },
  });

  if (!technicianRoleExists) {
    technicianRoleExists = await prisma.role.create({
      data: {
        name: 'Technician',
        permissions: [],
        description: 'Default Technician role',
      },
    });

    console.log('--------------------');
    console.log('Default Technician role created');
  }

  let adminExists = await prisma.user.findFirst({
    where: { role: { name: 'Admin' } },
  });

  if (!adminExists) {
    // Crear un usuario admin por defecto

    //Askign for password
    console.log("Creating 'admin' user ...");
    const password = (await askForPassword()) as string;
    const hashedPassword = await bcrypt.hash(password, 10);

    adminExists = await prisma.user.create({
      data: {
        name: 'Admin',
        username: 'admin',
        email: 'admin@localhost',
        password: hashedPassword,
        roleId: adminRoleExists.id,
      },
    });
    console.log('--------------------');
    console.log('Default admin user created');
  } else {
    console.log('--------------------');
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
