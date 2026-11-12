// Run from the server folder:
//   node seed.js          -> adds books only if the collection is empty
//   node seed.js --reset  -> deletes ALL books, then re-adds them
require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Book');

const cover = (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

const books = [
  // Classics
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classics', pages: 180, publishedYear: 1925, averageRating: 4.0, ratingsCount: 120, coverImage: cover('9780743273565'),
    description: 'Jay Gatsby chases a lost love through the glittering excess of 1920s Long Island.' },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Classics', pages: 281, publishedYear: 1960, averageRating: 4.8, ratingsCount: 310, coverImage: cover('9780061120084'),
    description: 'Scout Finch watches her father defend a Black man falsely accused in a small Alabama town.' },
  { title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Classics', pages: 432, publishedYear: 1813, averageRating: 4.6, ratingsCount: 280, coverImage: cover('9780141439518'),
    description: 'Elizabeth Bennet and Mr. Darcy navigate pride, class, and first impressions.' },
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Classics', pages: 234, publishedYear: 1951, averageRating: 3.5, ratingsCount: 95, coverImage: cover('9780316769488'),
    description: 'Holden Caulfield wanders New York after being expelled from prep school.' },

  // Dystopian
  { title: '1984', author: 'George Orwell', genre: 'Dystopian', pages: 328, publishedYear: 1949, averageRating: 4.7, ratingsCount: 400, coverImage: cover('9780451524935'),
    description: 'Winston Smith rebels against a totalitarian regime that watches and rewrites everything.' },
  { title: 'Brave New World', author: 'Aldous Huxley', genre: 'Dystopian', pages: 288, publishedYear: 1932, averageRating: 4.1, ratingsCount: 150, coverImage: cover('9780060850524'),
    description: 'A future society engineered for comfort and conformity, and the man who refuses it.' },
  { title: 'Fahrenheit 451', author: 'Ray Bradbury', genre: 'Dystopian', pages: 249, publishedYear: 1953, averageRating: 4.2, ratingsCount: 170, coverImage: cover('9781451673319'),
    description: 'In a world where books are burned, fireman Guy Montag begins to question his job.' },
  { title: 'The Hunger Games', author: 'Suzanne Collins', genre: 'Dystopian', pages: 374, publishedYear: 2008, averageRating: 4.4, ratingsCount: 350, coverImage: cover('9780439023528'),
    description: 'Katniss Everdeen volunteers to fight in a televised battle to the death.' },

  // Fantasy
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', pages: 310, publishedYear: 1937, averageRating: 4.7, ratingsCount: 330, coverImage: cover('9780547928227'),
    description: 'Bilbo Baggins is swept into a quest to reclaim a dwarven treasure from a dragon.' },
  { title: "Harry Potter and the Sorcerer's Stone", author: 'J.K. Rowling', genre: 'Fantasy', pages: 309, publishedYear: 1997, averageRating: 4.9, ratingsCount: 500, coverImage: cover('9780590353427'),
    description: 'An orphan discovers he is a wizard and begins his first year at Hogwarts.' },
  { title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fantasy', pages: 208, publishedYear: 1988, averageRating: 3.9, ratingsCount: 210, coverImage: cover('9780062315007'),
    description: 'A shepherd boy travels from Spain to Egypt in search of treasure and his personal legend.' },

  // Science Fiction
  { title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction', pages: 612, publishedYear: 1965, averageRating: 4.6, ratingsCount: 260, coverImage: cover('9780441172719'),
    description: 'Paul Atreides faces politics, prophecy, and war on the desert planet Arrakis.' },
  { title: 'The Martian', author: 'Andy Weir', genre: 'Science Fiction', pages: 369, publishedYear: 2011, averageRating: 4.5, ratingsCount: 240, coverImage: cover('9780553418026'),
    description: 'Stranded on Mars, astronaut Mark Watney must science his way to survival.' },

  // Mystery & Thriller
  { title: 'Gone Girl', author: 'Gillian Flynn', genre: 'Mystery', pages: 422, publishedYear: 2012, averageRating: 4.0, ratingsCount: 190, coverImage: cover('9780307588371'),
    description: 'On their fifth anniversary, Amy disappears and her husband becomes the prime suspect.' },
  { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', genre: 'Mystery', pages: 465, publishedYear: 2005, averageRating: 4.2, ratingsCount: 175, coverImage: cover('9780307454546'),
    description: 'A journalist and a hacker investigate a decades-old disappearance in a wealthy Swedish family.' },
  { title: 'The Da Vinci Code', author: 'Dan Brown', genre: 'Mystery', pages: 454, publishedYear: 2003, averageRating: 3.6, ratingsCount: 220, coverImage: cover('9780307474278'),
    description: 'A symbologist races to decode clues hidden in famous art and a centuries-old secret.' },

  // Non-Fiction
  { title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'Non-Fiction', pages: 443, publishedYear: 2011, averageRating: 4.5, ratingsCount: 290, coverImage: cover('9780062316110'),
    description: 'A sweeping history of humankind, from the Stone Age to the present.' },
  { title: 'Atomic Habits', author: 'James Clear', genre: 'Non-Fiction', pages: 320, publishedYear: 2018, averageRating: 4.8, ratingsCount: 360, coverImage: cover('9780735211292'),
    description: 'A practical system for building good habits and breaking bad ones.' },
  { title: 'Educated', author: 'Tara Westover', genre: 'Non-Fiction', pages: 352, publishedYear: 2018, averageRating: 4.7, ratingsCount: 230, coverImage: cover('9780399590504'),
    description: 'A memoir of growing up in an isolated survivalist family and fighting for an education.' },
  { title: 'Becoming', author: 'Michelle Obama', genre: 'Non-Fiction', pages: 448, publishedYear: 2018, averageRating: 4.6, ratingsCount: 205, coverImage: cover('9781524763138'),
    description: 'The former First Lady reflects on her childhood, career, and years in the White House.' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await Book.countDocuments();
    const reset = process.argv.includes('--reset');

    if (existing > 0 && !reset) {
      console.log(`Books collection already has ${existing} books. Nothing added.`);
      console.log('Use "node seed.js --reset" to wipe and re-seed.');
      return;
    }

    if (reset) {
      await Book.deleteMany({});
      console.log('Existing books deleted.');
    }

    const inserted = await Book.insertMany(books);
    console.log(`Seeded ${inserted.length} books.`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();