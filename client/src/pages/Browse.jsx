import { useEffect, useRef, useState } from 'react';
import Hero from '../components/Hero';
import BookCard from '../components/BookCard';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const EMPTY = { search: '', genre: '', author: '', rating: '' };

export default function Browse() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState(EMPTY);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(0); // ignores responses from outdated requests

  // Fill the genre dropdown once
  useEffect(() => {
    fetch(`${API}/books/meta/filters`)
      .then((r) => r.json())
      .then((d) => setGenres(d.genres || []))
      .catch(() => {});
  }, []);

  // Refetch (debounced) whenever filters change, starting from page 1
  useEffect(() => {
    const t = setTimeout(() => load(1, true), 300);
    return () => clearTimeout(t);
  }, [filters]);

  async function load(pageToLoad, replace = false) {
    const myRequest = ++requestId.current;
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: pageToLoad, limit: 12 });
      Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
      const res = await fetch(`${API}/books?${params}`);
      if (!res.ok) throw new Error('Failed to load books');
      const data = await res.json();
      if (myRequest !== requestId.current) return; // a newer request replaced this one
      setBooks((prev) => (replace ? data.books : [...prev, ...data.books]));
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (e) {
      if (myRequest === requestId.current) setError(e.message);
    } finally {
      if (myRequest === requestId.current) setLoading(false);
    }
  }

  const update = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <>
      <Hero
        small
        title="Browse books"
        subtitle="Search by title, genre, author, or rating."
        image="/images/browse.jpg"
      />

      <div className="container">
        <div className="form-group">
          <input
            name="search"
            placeholder="Search title or author..."
            value={filters.search}
            onChange={update}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <select name="genre" value={filters.genre} onChange={update}>
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <input
            name="author"
            placeholder="Author"
            value={filters.author}
            onChange={update}
          />

          <select name="rating" value={filters.rating} onChange={update}>
            <option value="">Any rating</option>
            {[4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r}+ stars</option>
            ))}
          </select>

          <button className="btn" onClick={() => setFilters(EMPTY)}>
            Clear
          </button>
        </div>

        {error && <p>{error}</p>}
        {!loading && !error && books.length === 0 && <p>No books found.</p>}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 16,
            marginTop: 20,
          }}
        >
          {books.map((b) => (
            <BookCard key={b._id} book={b} />
          ))}
        </div>

        {loading && <p>Loading...</p>}
        {page < totalPages && !loading && (
          <button className="btn" style={{ marginTop: 20 }} onClick={() => load(page + 1)}>
            Load more
          </button>
        )}
      </div>
    </>
  );
}