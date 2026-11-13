import { Link } from 'react-router-dom';

const PLACEHOLDER = '/placeholder-cover.png';

export default function BookCard({ book }) {
  const rating =
    book.averageRating > 0 ? book.averageRating.toFixed(1) : 'No ratings';

  return (
    <div className="card">
      <Link to={`/books/${book._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img
          src={book.coverImage || PLACEHOLDER}
          alt={book.title}
          onError={(e) => {
            e.currentTarget.onerror = null; // avoid an infinite loop if the placeholder is missing too
            e.currentTarget.src = PLACEHOLDER;
          }}
          style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 8 }}
        />
        <h3>{book.title}</h3>
      </Link>
      <p>{book.author}</p>
      <p>
        {book.genre} · ⭐ {rating}
      </p>
    </div>
  );
}