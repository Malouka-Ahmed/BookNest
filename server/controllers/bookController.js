const mongoose = require('mongoose');
const Book = require('../models/Book');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/books/featured?limit=8 (Home page)
exports.getFeatured = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 8, 24);

    let books = await Book.find({ featured: true })
      .sort({ averageRating: -1 })
      .limit(limit);

    // Fall back to the top-rated books if nothing is marked as featured
    if (books.length === 0) {
      books = await Book.find().sort({ averageRating: -1 }).limit(limit);
    }

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/books?genre=&author=&rating=&search=&page=1&limit=12&sort=
exports.getBooks = async (req, res) => {
  try {
    const { genre, author, rating, search, sort } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 12, 50);

    const filter = {};
    if (genre) filter.genre = new RegExp(`^${escapeRegex(genre)}$`, 'i');
    if (author) filter.author = new RegExp(escapeRegex(author), 'i');
    if (rating) filter.averageRating = { $gte: Number(rating) };
    if (search) {
      const rx = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ title: rx }, { author: rx }];
    }

    const sortMap = {
      rating: { averageRating: -1 },
      newest: { createdAt: -1 },
      title: { title: 1 },
    };

    const [books, total] = await Promise.all([
      Book.find(filter)
        .sort(sortMap[sort] || { title: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Book.countDocuments(filter),
    ]);

    res.json({ books, page, totalPages: Math.ceil(total / limit), total });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/books/meta/filters (fills the genre dropdown)
exports.getFilterOptions = async (req, res) => {
  try {
    const genres = await Book.distinct('genre');
    res.json({ genres: genres.sort() });
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