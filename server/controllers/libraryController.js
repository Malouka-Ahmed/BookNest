const mongoose = require('mongoose');
const UserBook = require('../models/UserBook');
const Book = require('../models/Book');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/library            -> every book on my lists
// GET /api/library?status=reading
exports.getLibrary = async (req, res) => {
  try {
    const filter = { user: req.userId };
    const { status } = req.query;

    if (status) {
      if (!UserBook.STATUSES.includes(status)) {
        return res.status(400).json({ message: `Status must be one of: ${UserBook.STATUSES.join(', ')}` });
      }
      filter.status = status;
    }

    const items = await UserBook.find(filter).populate('book').sort({ updatedAt: -1 });

    // Drop entries whose book was deleted from the catalog
    res.json(items.filter((item) => item.book));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/library/book/:bookId -> is this book on my lists? (used by the Book Details dropdown)
exports.getEntryForBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    if (!isValidId(bookId)) return res.status(400).json({ message: 'Invalid book id' });

    const item = await UserBook.findOne({ user: req.userId, book: bookId });
    res.json(item); // null when the book is not on any list
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/library  { bookId, status }
// If the book is already on a list, its status is updated instead.
exports.addToLibrary = async (req, res) => {
  try {
    const { bookId, status = 'want-to-read' } = req.body;

    if (!bookId || !isValidId(bookId)) return res.status(400).json({ message: 'A valid bookId is required' });
    if (!UserBook.STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${UserBook.STATUSES.join(', ')}` });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    let item = await UserBook.findOne({ user: req.userId, book: bookId });
    const created = !item;

    if (created) item = new UserBook({ user: req.userId, book: bookId });
    item.status = status;
    await item.save();
    await item.populate('book');

    res.status(created ? 201 : 200).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/library/:id  { status }  -> move a book to another list
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid id' });
    if (!UserBook.STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${UserBook.STATUSES.join(', ')}` });
    }

    const item = await UserBook.findOne({ _id: id, user: req.userId });
    if (!item) return res.status(404).json({ message: 'Library entry not found' });

    item.status = status;
    await item.save();
    await item.populate('book');

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/library/:id -> remove a book from my lists
exports.removeFromLibrary = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid id' });

    const item = await UserBook.findOneAndDelete({ _id: id, user: req.userId });
    if (!item) return res.status(404).json({ message: 'Library entry not found' });

    res.json({ message: 'Removed from library', id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
