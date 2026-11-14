import { Link } from 'react-router-dom';
import BookCover from './BookCover';
import './BookCard.css';

// Cover + title + author, linking to the Book Details page.
// Anything passed as children is shown under the text (e.g. library controls).
export default function BookCard({ book, children }) {
  return (
    <article className="book-card">
      <Link to={`/books/${book._id}`} className="book-card-link">
        <BookCover book={book} />
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">{book.author}</p>
      </Link>
      <div className="book-card-meta">
        <span className="book-card-genre">{book.genre}</span>
        {book.rating > 0 && <span className="book-card-rating">★ {book.rating.toFixed(1)}</span>}
      </div>
      {children && <div className="book-card-extra">{children}</div>}
    </article>
  );
}
