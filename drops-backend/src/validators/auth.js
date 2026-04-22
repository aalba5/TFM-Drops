const validateRegister = (req, res, next) => {
  const { email, password, name } = req.body;
  const errors = [];

  if (!email || !email.includes('@')) {
    errors.push('Email válido es requerido');
  }

  if (!password || password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }

  if (!name || name.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push('Email es requerido');
  }

  if (!password) {
    errors.push('Contraseña es requerida');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = { validateRegister, validateLogin };
