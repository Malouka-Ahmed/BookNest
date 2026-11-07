const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getSummary, updateMe } = require('../controllers/userController');

router.get('/me/summary', auth, getSummary);
router.put('/me', auth, updateMe);

module.exports = router;