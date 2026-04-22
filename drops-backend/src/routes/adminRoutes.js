const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, getDashboard } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.use(auth, admin);

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/dashboard', getDashboard);

module.exports = router;
