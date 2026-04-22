const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'El registro ya existe' });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Registro no encontrado' });
  }

  res.status(500).json({ error: 'Error interno del servidor' });
};

module.exports = errorHandler;
