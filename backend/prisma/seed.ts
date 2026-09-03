import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

import * as bcrypt from 'bcrypt';
import 'dotenv/config';

export async function seed() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    const adminEmail = process.env.ADMIN_EMAIL!;
    const adminPassword = process.env.ADMIN_PASSWORD!;
    const adminName = process.env.ADMIN_NAME!;

    console.log('looking for existing admin');
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log('Admin already exists, skipping seeding.');
      return;
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    console.log('seeding admin as user');
    await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Admin seeded successfully');
  } finally {
    await prisma.$disconnect();
  }
}
