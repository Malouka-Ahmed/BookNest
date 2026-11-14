import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../api';
import BookCover from '../components/BookCover';
import AddToListDropdown from '../components/AddToListDropdown';
import './BookDetails.css';

// Person 2 owns the book info layout on this page;
// Person 3 owns the "Add to list" dropdown (<AddToListDropdown />).
export default function BookDetails() {
  const { id } = useParams();
  // Remember which id the result belongs to, so navigating to another book shows "Loading" again
  const [result, setResult] = useState({ id: null, book: null, error: '' });

  useEffect(() => {
    let cancelled = false;
    apiFetch(`/api/books/${id}`)
      .then((data) => !cancelled && setResult({ id, book: data, error: '' }))
      .catch((err) => !cancelled && setResult({ id, book: null, error: err.message }));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const book = result.id === id ? result.book : null;
  const error = result.id === id ? result.error : '';

  if (error) {
    return (
      <div className="container">
        <p className="muted">{error}</p>
        <Link to="/browse" className="btn">Back to Browse</Link>
      </div>
    );
  }

  if (!book) {
    return <div className="container"><p className="muted">Loading book…</p></div>;
  }

  return (
    <div className="container">
      <Link to="/browse" className="book-details-back">← Back to Browse</Link>

      <div className="book-details">
        <div className="book-details-cover">
          <BookCover book={book} size="lg" />
        </div>

        <div className="book-details-info">
          <span className="book-details-genre">{book.genre}</span>
          <h1>{book.title}</h1>
          <p className="book-details-author">by {book.author}</p>

          <ul className="book-details-facts">
            {book.rating > 0 && <li><strong>★ {book.rating.toFixed(1)}</strong> rating</li>}
            {book.publishedYear && <li>Published <strong>{book.publishedYear}</strong></li>}
            {book.pages && <li><strong>{book.pages}</strong> pages</li>}
          </ul>

          <AddToListDropdown bookId={book._id} />

          {book.description && <p className="book-details-description">{book.description}</p>}
        </div>
      </div>
    </div>
  );
}
