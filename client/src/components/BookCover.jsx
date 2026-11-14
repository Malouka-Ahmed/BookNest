import { useState } from 'react';
import './BookCover.css';

// The styled title cover is always rendered underneath; the real cover image fades in on top
// once it loads. A missing, broken, or slow image never leaves an empty box.
export default function BookCover({ book, size = 'md' }) {
  const [status, setStatus] = useState('loading'); // loading | loaded | failed

  return (
    <div className={`book-cover book-cover-${size}`}>
      <div className="book-cover-fallback" aria-hidden={status === 'loaded'}>
        <span className="book-cover-title">{book.title}</span>
        <span className="book-cover-author">{book.author}</span>
      </div>
      {book.coverImage && status !== 'failed' && (
        <img
          src={book.coverImage}
          alt={`Cover of ${book.title}`}
          loading="lazy"
          className={status === 'loaded' ? 'is-loaded' : ''}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('failed')}
        />
      )}
    </div>
  );
}
