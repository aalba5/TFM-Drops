const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err.message);

  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Ya existe un registro con esos datos',
      field: err.meta?.target,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : err.message,
  });
};

module.exports = errorHandler;
