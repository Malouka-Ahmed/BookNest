const mongoose = require('mongoose');
const Book = require('../models/Book');

// NOTE for Person 2: this file only has what Home and Book Details need right now.
// Add your list / search / filter handlers here (GET /api/books?search=&genre=...).

// GET /api/books/featured?limit=8 (Home page)
exports.getFeatured = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 8, 24);

    let books = await Book.find({ featured: true }).sort({ rating: -1 }).limit(limit);

    // Fall back to the top-rated books if nothing is marked as featured
    if (books.length === 0) {
      books = await Book.find().sort({ rating: -1 }).limit(limit);
    }

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/books/:id (Book Details page)
exports.getBookById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid book id' });
    }
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
