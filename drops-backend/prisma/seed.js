const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

function randomBool(probability) {
  return Math.random() < probability;
}

async function main() {
  await prisma.habitEntry.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Salud', color: '#22c55e', icon: '💚' } }),
    prisma.category.create({ data: { name: 'Ejercicio', color: '#3b82f6', icon: '🏃' } }),
    prisma.category.create({ data: { name: 'Estudio', color: '#a855f7', icon: '📚' } }),
    prisma.category.create({ data: { name: 'Bienestar', color: '#f59e0b', icon: '🧘' } }),
    prisma.category.create({ data: { name: 'Productividad', color: '#ef4444', icon: '⚡' } }),
  ]);

  const adminPassword = await bcrypt.hash('Admin1234', 10);
  await prisma.user.create({
    data: { email: 'admin@drops.com', password: adminPassword, name: 'Admin', role: 'admin' },
  });

  const userPassword = await bcrypt.hash('Demo1234', 10);
  const user = await prisma.user.create({
    data: { email: 'demo@drops.com', password: userPassword, name: 'Ana', role: 'user' },
  });

  const habitsData = [
    { name: 'Beber 2L de agua', description: 'Mantenerse hidratada durante el día', color: '#22c55e', categoryId: categories[0].id, rate: 0.82 },
    { name: 'Correr 30 minutos', description: 'Salir a correr por el parque', color: '#3b82f6', categoryId: categories[1].id, rate: 0.60 },
    { name: 'Leer 20 páginas', description: 'Leer antes de dormir', color: '#a855f7', categoryId: categories[2].id, rate: 0.73 },
    { name: 'Meditar 10 minutos', description: 'Meditación guiada por la mañana', color: '#f59e0b', categoryId: categories[3].id, rate: 0.50 },
  ];

  const habits = await Promise.all(
    habitsData.map((h) =>
      prisma.habit.create({
        data: {
          name: h.name,
          description: h.description,
          frequency: 'daily',
          color: h.color,
          userId: user.id,
          categoryId: h.categoryId,
        },
      })
    )
  );

  // Generate 90 days of entries per habit with individual completion rates
  const today = new Date();
  for (let hi = 0; hi < habits.length; hi++) {
    const habit = habits[hi];
    const rate = habitsData[hi].rate;
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      if (randomBool(rate)) {
        await prisma.habitEntry.create({
          data: { date: dateStr, completed: true, habitId: habit.id },
        });
      }
    }
  }

  console.log('Seed completado:');
  console.log(`- ${categories.length} categorías`);
  console.log('- 2 usuarios (admin + demo)');
  console.log(`- ${habits.length} hábitos con 90 días de historial`);
  console.log('Credenciales: admin@drops.com/Admin1234, demo@drops.com/Demo1234');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
