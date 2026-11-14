const express = require('express');
const router = express.Router();
const { getFeatured, getBookById } = require('../controllers/bookController');

// Person 2: add your GET '/' (browse + search + filters) route here.
// Keep '/featured' ABOVE '/:id' or Express will treat "featured" as an id.
router.get('/featured', getFeatured);
router.get('/:id', getBookById);

module.exports = router;
