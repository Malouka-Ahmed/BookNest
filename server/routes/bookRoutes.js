const express = require('express');
const router = express.Router();
const {
  getFeatured,
  getBookById,
  getBooks,
  getFilterOptions,
} = require('../controllers/bookController');

// Order matters: specific routes first, '/:id' LAST
router.get('/featured', getFeatured);
router.get('/meta/filters', getFilterOptions);
router.get('/', getBooks);
router.get('/:id', getBookById);

module.exports = router;