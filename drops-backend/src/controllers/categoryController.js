const prisma = require('../config/db');

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { habits: true } },
      },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, color, icon } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        color: color || '#6366f1',
        icon: icon || '📌',
      },
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { name, color, icon } = req.body;

    const category = await prisma.category.update({
      where: { id: parseInt(req.params.id) },
      data: { name, color, icon },
    });

    res.json(category);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await prisma.category.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'Categoría eliminada' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
