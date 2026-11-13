import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Hero from '../components/Hero';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const PLACEHOLDER = '/placeholder-cover.png';

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false; // skip updates if the user navigates away mid-request
    fetch(`${API}/books/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Book not found');
        return r.json();
      })
      .then((data) => {
        if (ignore) return;
        setBook(data);
        setError('');
      })
      .catch((e) => {
        if (!ignore) setError(e.message);
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <>
      {/* If your leader's stub had extra Hero props (subtitle, image), keep them here */}
      <Hero small title={book?.title || 'Book details'} />

      <div className="container">
        <Link to="/browse">← Back to Browse</Link>

        {error && <p>{error}</p>}
        {!book && !error && <p>Loading...</p>}

        {book && (
          <div className="card" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 16 }}>
            <img
              src={book.coverImage || PLACEHOLDER}
              alt={book.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = PLACEHOLDER;
              }}
              style={{ width: 240, borderRadius: 8 }}
            />
            <div style={{ flex: 1, minWidth: 240 }}>
              <h2>{book.title}</h2>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Genre:</strong> {book.genre}</p>
              <p>
                <strong>Rating:</strong>{' '}
                {book.averageRating > 0
                  ? `⭐ ${book.averageRating.toFixed(1)} (${book.ratingsCount} ratings)`
                  : 'No ratings yet'}
              </p>
              {book.pages && <p><strong>Pages:</strong> {book.pages}</p>}
              {book.publishedYear && <p><strong>Published:</strong> {book.publishedYear}</p>}
              <p>{book.description}</p>

              {/* Teammates plug in here: add-to-list buttons, wishlist, reviews */}
            </div>
          </div>
        )}
      </div>
    </>
  );
}