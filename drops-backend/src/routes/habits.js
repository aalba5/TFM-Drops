const express = require('express');
const { body, param } = require('express-validator');
const { getHabits, getHabit, createHabit, updateHabit, deleteHabit } = require('../controllers/habitController');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');

const router = express.Router();

// All habit routes require authentication
router.use(auth);

router.get('/', getHabits);

router.get(
  '/:id',
  [param('id').isInt().withMessage('ID inválido')],
  validate,
  getHabit
);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('type')
      .optional()
      .isIn(['BINARY', 'QUANTIFIABLE', 'TIME'])
      .withMessage('Tipo inválido'),
    body('frequency')
      .optional()
      .isIn(['DAILY', 'WEEKLY'])
      .withMessage('Frecuencia inválida'),
    body('target')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('El objetivo debe ser un número positivo'),
    body('color')
      .optional()
      .matches(/^#[0-9A-Fa-f]{6}$/)
      .withMessage('Color inválido (formato hex)'),
  ],
  validate,
  createHabit
);

router.put(
  '/:id',
  [
    param('id').isInt().withMessage('ID inválido'),
    body('name').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('type')
      .optional()
      .isIn(['BINARY', 'QUANTIFIABLE', 'TIME'])
      .withMessage('Tipo inválido'),
    body('frequency')
      .optional()
      .isIn(['DAILY', 'WEEKLY'])
      .withMessage('Frecuencia inválida'),
  ],
  validate,
  updateHabit
);

router.delete(
  '/:id',
  [param('id').isInt().withMessage('ID inválido')],
  validate,
  deleteHabit
);

module.exports = router;
