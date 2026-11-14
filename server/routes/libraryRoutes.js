const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getLibrary,
  getEntryForBook,
  addToLibrary,
  updateStatus,
  removeFromLibrary,
} = require('../controllers/libraryController');

// Every library route needs a logged-in user
router.use(auth);

router.get('/', getLibrary);
router.get('/book/:bookId', getEntryForBook);
router.post('/', addToLibrary);
router.put('/:id', updateStatus);
router.delete('/:id', removeFromLibrary);

module.exports = router;
