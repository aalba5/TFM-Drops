const express = require('express');
const router = express.Router();
const { getHabits, getHabit, createHabit, updateHabit, deleteHabit, toggleEntry, getStats } = require('../controllers/habitController');
const { validateHabit, validateEntry } = require('../validators/habit');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', getHabits);
router.get('/:id', getHabit);
router.post('/', validateHabit, createHabit);
router.put('/:id', validateHabit, updateHabit);
router.delete('/:id', deleteHabit);
router.post('/:id/toggle', validateEntry, toggleEntry);
router.get('/:id/stats', getStats);

module.exports = router;
