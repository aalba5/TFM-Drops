const prisma = require('../config/database');

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.user.id },
      include: { _count: { select: { habits: true } } },
      orderBy: { name: 'asc' },
    });
    res.json({ categories });
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, color } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        color: color || '#6366f1',
        userId: req.user.id,
      },
    });

    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id);

    const existing = await prisma.category.findFirst({
      where: { id: categoryId, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    const { name, color } = req.body;

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        ...(name !== undefined && { name }),
        ...(color !== undefined && { color }),
      },
    });

    res.json({ category });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id);

    const existing = await prisma.category.findFirst({
      where: { id: categoryId, userId: req.user.id },
      include: { _count: { select: { habits: true } } },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    // Unlink habits from this category before deleting
    await prisma.habit.updateMany({
      where: { categoryId: categoryId },
      data: { categoryId: null },
    });

    await prisma.category.delete({ where: { id: categoryId } });

    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
