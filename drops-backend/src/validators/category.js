const validateCategory = (req, res, next) => {
  const { name } = req.body;
  const errors = [];

  if (!name || name.trim().length < 1) {
    errors.push('El nombre de la categoría es requerido');
  }

  if (name && name.length > 50) {
    errors.push('El nombre no puede exceder 50 caracteres');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = { validateCategory };
