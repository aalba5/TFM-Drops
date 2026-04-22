const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { validateCategory } = require('../validators/category');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', getCategories);
router.post('/', validateCategory, createCategory);
router.put('/:id', validateCategory, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
