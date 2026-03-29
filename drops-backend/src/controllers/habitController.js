const prisma = require('../config/database');

const getHabits = async (req, res, next) => {
  try {
    const habits = await prisma.habit.findMany({
      where: { userId: req.user.id },
      include: { category: { select: { id: true, name: true, color: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ habits });
  } catch (err) {
    next(err);
  }
};

const getHabit = async (req, res, next) => {
  try {
    const habit = await prisma.habit.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
      include: {
        category: { select: { id: true, name: true, color: true } },
        entries: { orderBy: { date: 'desc' }, take: 30 },
      },
    });

    if (!habit) {
      return res.status(404).json({ error: 'Hábito no encontrado' });
    }

    res.json({ habit });
  } catch (err) {
    next(err);
  }
};

const createHabit = async (req, res, next) => {
  try {
    const { name, description, type, frequency, target, unit, color, icon, categoryId } = req.body;

    const habit = await prisma.habit.create({
      data: {
        name,
        description,
        type: type || 'BINARY',
        frequency: frequency || 'DAILY',
        target: target ? parseFloat(target) : 1,
        unit,
        color: color || '#6366f1',
        icon: icon || 'circle-check',
        categoryId: categoryId ? parseInt(categoryId) : null,
        userId: req.user.id,
      },
      include: { category: { select: { id: true, name: true, color: true } } },
    });

    res.status(201).json({ habit });
  } catch (err) {
    next(err);
  }
};

const updateHabit = async (req, res, next) => {
  try {
    const habitId = parseInt(req.params.id);

    // Verify ownership
    const existing = await prisma.habit.findFirst({
      where: { id: habitId, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Hábito no encontrado' });
    }

    const { name, description, type, frequency, target, unit, color, icon, categoryId, isActive } = req.body;

    const habit = await prisma.habit.update({
      where: { id: habitId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(type !== undefined && { type }),
        ...(frequency !== undefined && { frequency }),
        ...(target !== undefined && { target: parseFloat(target) }),
        ...(unit !== undefined && { unit }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
        ...(categoryId !== undefined && { categoryId: categoryId ? parseInt(categoryId) : null }),
        ...(isActive !== undefined && { isActive }),
      },
      include: { category: { select: { id: true, name: true, color: true } } },
    });

    res.json({ habit });
  } catch (err) {
    next(err);
  }
};

const deleteHabit = async (req, res, next) => {
  try {
    const habitId = parseInt(req.params.id);

    const existing = await prisma.habit.findFirst({
      where: { id: habitId, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Hábito no encontrado' });
    }

    // Soft delete: archive instead of removing
    await prisma.habit.update({
      where: { id: habitId },
      data: { isActive: false },
    });

    res.json({ message: 'Hábito archivado correctamente' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getHabits, getHabit, createHabit, updateHabit, deleteHabit };
