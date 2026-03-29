const express = require('express');
const { param } = require('express-validator');
const { getUsers, toggleUserActive } = require('../controllers/userController');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// All user management routes require admin
router.use(auth, isAdmin);

router.get('/', getUsers);

router.patch(
  '/:id/toggle-active',
  [param('id').isInt().withMessage('ID inválido')],
  validate,
  toggleUserActive
);

module.exports = router;
