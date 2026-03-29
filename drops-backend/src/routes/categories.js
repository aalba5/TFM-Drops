const express = require('express');
const { body, param } = require('express-validator');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');

const router = express.Router();

router.use(auth);

router.get('/', getCategories);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('color')
      .optional()
      .matches(/^#[0-9A-Fa-f]{6}$/)
      .withMessage('Color inválido (formato hex)'),
  ],
  validate,
  createCategory
);

router.put(
  '/:id',
  [
    param('id').isInt().withMessage('ID inválido'),
    body('name').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('color')
      .optional()
      .matches(/^#[0-9A-Fa-f]{6}$/)
      .withMessage('Color inválido'),
  ],
  validate,
  updateCategory
);

router.delete(
  '/:id',
  [param('id').isInt().withMessage('ID inválido')],
  validate,
  deleteCategory
);

module.exports = router;
