const validateHabit = (req, res, next) => {
  const { name } = req.body;
  const errors = [];

  if (!name || name.trim().length < 1) {
    errors.push('El nombre del hábito es requerido');
  }

  if (name && name.length > 100) {
    errors.push('El nombre no puede exceder 100 caracteres');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateEntry = (req, res, next) => {
  const { date } = req.body;
  const errors = [];

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push('Fecha válida requerida (formato YYYY-MM-DD)');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = { validateHabit, validateEntry };
