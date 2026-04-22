const prisma = require('../config/db');

const getHabits = async (req, res, next) => {
  try {
    const habits = await prisma.habit.findMany({
      where: { userId: req.user.id },
      include: {
        category: true,
        entries: {
          orderBy: { date: 'desc' },
          take: 400,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(habits);
  } catch (error) {
    next(error);
  }
};

const getHabit = async (req, res, next) => {
  try {
    const habit = await prisma.habit.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
      include: {
        category: true,
        entries: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!habit) {
      return res.status(404).json({ error: 'Hábito no encontrado' });
    }

    res.json(habit);
  } catch (error) {
    next(error);
  }
};

const createHabit = async (req, res, next) => {
  try {
    const { name, description, frequency, color, categoryId } = req.body;

    const habit = await prisma.habit.create({
      data: {
        name,
        description,
        frequency: frequency || 'daily',
        color: color || '#6366f1',
        userId: req.user.id,
        categoryId: categoryId ? parseInt(categoryId) : null,
      },
      include: { category: true },
    });

    res.status(201).json(habit);
  } catch (error) {
    next(error);
  }
};

const updateHabit = async (req, res, next) => {
  try {
    const { name, description, frequency, color, categoryId } = req.body;

    const existing = await prisma.habit.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Hábito no encontrado' });
    }

    const habit = await prisma.habit.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        description,
        frequency,
        color,
        categoryId: categoryId !== undefined ? (categoryId ? parseInt(categoryId) : null) : undefined,
      },
      include: { category: true },
    });

    res.json(habit);
  } catch (error) {
    next(error);
  }
};

const deleteHabit = async (req, res, next) => {
  try {
    const existing = await prisma.habit.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Hábito no encontrado' });
    }

    await prisma.habit.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'Hábito eliminado' });
  } catch (error) {
    next(error);
  }
};

const toggleEntry = async (req, res, next) => {
  try {
    const habitId = parseInt(req.params.id);
    const { date } = req.body;

    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId: req.user.id },
    });

    if (!habit) {
      return res.status(404).json({ error: 'Hábito no encontrado' });
    }

    const existing = await prisma.habitEntry.findUnique({
      where: { habitId_date: { habitId, date } },
    });

    if (existing) {
      await prisma.habitEntry.delete({
        where: { id: existing.id },
      });
      res.json({ completed: false, date });
    } else {
      const entry = await prisma.habitEntry.create({
        data: { habitId, date, completed: true },
      });
      res.json({ completed: true, date, entry });
    }
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const habitId = parseInt(req.params.id);

    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId: req.user.id },
      include: { entries: true },
    });

    if (!habit) {
      return res.status(404).json({ error: 'Hábito no encontrado' });
    }

    const totalEntries = habit.entries.length;

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    const sortedDates = habit.entries
      .map(e => e.date)
      .sort()
      .reverse();

    for (let i = 0; i < sortedDates.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      const expectedStr = expected.toISOString().split('T')[0];

      if (sortedDates[i] === expectedStr) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Best streak
    let bestStreak = 0;
    let tempStreak = 1;
    const sorted = [...sortedDates].sort();
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);
      const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        tempStreak++;
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak);

    res.json({
      totalEntries,
      currentStreak,
      bestStreak,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHabits, getHabit, createHabit, updateHabit, deleteHabit, toggleEntry, getStats };
