const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.habitEntry.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@drops.app',
      password: adminPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('User1234!', 10);
  const user = await prisma.user.create({
    data: {
      email: 'ana@drops.app',
      password: userPassword,
      name: 'Ana',
      role: 'USER',
    },
  });

  // Create categories for the regular user
  const catSalud = await prisma.category.create({
    data: {
      name: 'Salud',
      color: '#10b981',
      userId: user.id,
    },
  });

  const catProductividad = await prisma.category.create({
    data: {
      name: 'Productividad',
      color: '#6366f1',
      userId: user.id,
    },
  });

  const catBienestar = await prisma.category.create({
    data: {
      name: 'Bienestar',
      color: '#f59e0b',
      userId: user.id,
    },
  });

  // Create habits for the regular user
  await prisma.habit.createMany({
    data: [
      {
        name: 'Beber agua',
        description: 'Beber al menos 8 vasos de agua al día',
        type: 'QUANTIFIABLE',
        frequency: 'DAILY',
        target: 8,
        unit: 'vasos',
        color: '#06b6d4',
        icon: 'droplets',
        userId: user.id,
        categoryId: catSalud.id,
      },
      {
        name: 'Meditar',
        description: 'Sesión de meditación diaria',
        type: 'TIME',
        frequency: 'DAILY',
        target: 15,
        unit: 'minutos',
        color: '#8b5cf6',
        icon: 'brain',
        userId: user.id,
        categoryId: catBienestar.id,
      },
      {
        name: 'Leer',
        description: 'Leer al menos 30 minutos',
        type: 'TIME',
        frequency: 'DAILY',
        target: 30,
        unit: 'minutos',
        color: '#f97316',
        icon: 'book-open',
        userId: user.id,
        categoryId: catProductividad.id,
      },
      {
        name: 'Ejercicio',
        description: 'Hacer ejercicio físico',
        type: 'BINARY',
        frequency: 'DAILY',
        target: 1,
        unit: null,
        color: '#ef4444',
        icon: 'dumbbell',
        userId: user.id,
        categoryId: catSalud.id,
      },
      {
        name: 'Estudiar TFM',
        description: 'Avanzar en el trabajo final de máster',
        type: 'TIME',
        frequency: 'DAILY',
        target: 120,
        unit: 'minutos',
        color: '#6366f1',
        icon: 'graduation-cap',
        userId: user.id,
        categoryId: catProductividad.id,
      },
    ],
  });

  console.log('Seed completed successfully');
  console.log('Admin: admin@drops.app / Admin123!');
  console.log('User: ana@drops.app / User1234!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
