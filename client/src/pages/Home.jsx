import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch, getToken } from '../api';
import Hero from '../components/Hero';
import VideoSection from '../components/VideoSection';
import BookCard from '../components/BookCard';
import '../components/BookCard.css';
import './Home.css';

export default function Home() {
  const loggedIn = Boolean(getToken());
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/api/books/featured?limit=10')
      .then(setBooks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Hero
        title="Discover your next favorite book"
        subtitle="Track what you read, rate it, and set your yearly reading goals."
        image="/images/hero.jpg"
      >
        <Link to="/browse" className="btn btn-accent">Browse books</Link>
        {loggedIn ? (
          <Link to="/library" className="btn">My Library</Link>
        ) : (
          <Link to="/register" className="btn">Join BookNest</Link>
        )}
      </Hero>

      <div className="container">
        <section className="home-section">
          <div className="home-section-header">
            <h2>Featured books</h2>
            <Link to="/browse" className="home-see-all">See all books →</Link>
          </div>

          {loading ? (
            <div className="book-grid" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="home-skeleton" />
              ))}
            </div>
          ) : error ? (
            <p className="muted">Couldn't load featured books right now. Is the server running?</p>
          ) : books.length === 0 ? (
            <p className="muted">No books yet. Run <code>npm run seed</code> in the server folder.</p>
          ) : (
            <div className="book-grid">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </section>

        <section className="home-steps">
          <div className="card">
            <span className="home-step-num">1</span>
            <h3>Find a book</h3>
            <p className="muted">Browse the catalog by title, author, or genre.</p>
          </div>
          <div className="card">
            <span className="home-step-num">2</span>
            <h3>Add it to a list</h3>
            <p className="muted">Want to Read, Currently Reading, or Completed.</p>
          </div>
          <div className="card">
            <span className="home-step-num">3</span>
            <h3>Track your progress</h3>
            <p className="muted">Move books between lists as you read them.</p>
          </div>
        </section>

        <VideoSection videoId="o8BByD_8wuY" />
      </div>
    </>
  );
}
