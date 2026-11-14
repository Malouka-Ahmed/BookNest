const mongoose = require('mongoose');

// SHARED SCHEMA (Person 2 + Person 3).
// Person 2 owns this model; the seed script and the library use these fields,
// so agree before renaming or removing any of them.
const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    coverImage: { type: String, default: '' }, // full image URL
    isbn: { type: String, unique: true, sparse: true },
    publishedYear: { type: Number },
    pages: { type: Number },
    averageRating: { type: Number, min: 0, max: 5, default: 0 }, // average rating
    ratingsCount:  { type: Number, default: 0 },
    featured: { type: Boolean, default: false }, // shown on the Home page
  },
  { timestamps: true }
);

bookSchema.index({ title: 'text', author: 'text' });

module.exports = mongoose.model('Book', bookSchema);
