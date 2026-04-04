import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const admins = [
    { email: 'jskjageer@gmail.com', password: 'Jsk@786', name: 'JSK Jageer' },
    { email: 'kalimdon07@gmail.com', password: 'Kalim@786', name: 'Kalim' }
  ];

  for (const admin of admins) {
    const passwordHash = await bcrypt.hash(admin.password, 10);
    await prisma.user.upsert({
      where: { email: admin.email },
      update: { passwordHash, role: 'ADMIN', name: admin.name },
      create: { email: admin.email, passwordHash, role: 'ADMIN', name: admin.name }
    });
  }
  console.log('Admins seeded directly into SQLite Database!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
