const prisma = require('../config/db');

const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: { select: { habits: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);

    if (userId === req.user.id) {
      return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
    }

    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const [userCount, habitCount, entryCount, categoryCount] = await Promise.all([
      prisma.user.count(),
      prisma.habit.count(),
      prisma.habitEntry.count(),
      prisma.category.count(),
    ]);

    res.json({ userCount, habitCount, entryCount, categoryCount });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, deleteUser, getDashboard };
