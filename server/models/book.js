const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  author:      { type: String, required: true, trim: true },
  genre:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  coverImage:  { type: String, default: '' },
  pages:       { type: Number },
  publishedYear: { type: Number },
  // Person 3 (ratings/reviews) can update these when someone rates a book
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  ratingsCount:  { type: Number, default: 0 },
}, { timestamps: true });

bookSchema.index({ title: 'text', author: 'text' });

module.exports = mongoose.model('Book', bookSchema);