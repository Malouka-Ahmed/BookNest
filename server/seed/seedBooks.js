// Seed the catalog with books.   Run from /server:   npm run seed
//
// Safe to run more than once: books are matched by ISBN and updated in place,
// so their _id stays the same and users' reading lists keep working.
// Use   npm run seed -- --fresh   to delete every book (and every library entry) first.

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Book = require('../models/Book');
const UserBook = require('../models/UserBook');
const books = require('./books.json');

// Open Library serves covers by ISBN. default=false returns 404 when there is no cover,
// so the client can show its own placeholder instead of a blank image.
const coverFor = (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  if (process.argv.includes('--fresh')) {
    await UserBook.deleteMany({});
    await Book.deleteMany({});
    console.log('Removed existing books and library entries');
  }

  const ops = books.map((b) => ({
    updateOne: {
      filter: { isbn: b.isbn },
      update: { $set: { ...b, coverImage: b.coverImage || coverFor(b.isbn) } },
      upsert: true,
    },
  }));

  const result = await Book.bulkWrite(ops);
  console.log(
    `Seeded ${books.length} books (${result.upsertedCount} new, ${result.modifiedCount} updated). ` +
      `${books.filter((b) => b.featured).length} are featured on the Home page.`
  );
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
