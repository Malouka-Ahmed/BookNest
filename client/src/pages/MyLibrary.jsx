import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiFetch, getToken, STATUSES } from '../api';
import Hero from '../components/Hero';
import BookCard from '../components/BookCard';
import '../components/BookCard.css';
import './MyLibrary.css';

const EMPTY_TEXT = {
  'want-to-read': 'Nothing on your Want to Read list yet.',
  reading: "You're not reading anything right now.",
  completed: "You haven't finished any books yet.",
};

export default function MyLibrary() {
  const loggedIn = Boolean(getToken());
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab = STATUSES.some((s) => s.value === tabParam) ? tabParam : 'want-to-read';

  const [items, setItems] = useState([]); // every UserBook (all three tabs)
  const [loading, setLoading] = useState(loggedIn);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!loggedIn) return;
    apiFetch('/api/library')
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [loggedIn]);

  function selectTab(value) {
    setSearchParams({ tab: value });
  }

  async function changeStatus(item, status) {
    setBusyId(item._id);
    setError('');
    try {
      const updated = await apiFetch(`/api/library/${item._id}`, { method: 'PUT', body: { status } });
      setItems((prev) => prev.map((i) => (i._id === item._id ? updated : i)));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function remove(item) {
    setBusyId(item._id);
    setError('');
    try {
      await apiFetch(`/api/library/${item._id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((i) => i._id !== item._id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  const visible = items.filter((i) => i.status === activeTab);
  const countFor = (status) => items.filter((i) => i.status === status).length;

  return (
    <>
      <Hero small title="My Library" subtitle="Everything you want to read, are reading, and have finished." image="/images/Library%20books.png" />

      <div className="container">
        {!loggedIn ? (
          <div className="card library-empty">
            <h2>Your shelves are waiting</h2>
            <p className="muted">Log in to start building your reading lists.</p>
            <Link to="/login" className="btn btn-accent">Log in</Link>{' '}
            <Link to="/register" className="btn">Create an account</Link>
          </div>
        ) : (
          <>
            <div className="library-tabs" role="tablist" aria-label="Reading lists">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  role="tab"
                  id={`tab-${s.value}`}
                  aria-selected={activeTab === s.value}
                  aria-controls="library-panel"
                  className={activeTab === s.value ? 'library-tab active' : 'library-tab'}
                  onClick={() => selectTab(s.value)}
                >
                  {s.label}
                  <span className="library-tab-count">{loading ? '–' : countFor(s.value)}</span>
                </button>
              ))}
            </div>

            {error && <p className="library-error">{error}</p>}

            <section id="library-panel" role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
              {loading ? (
                <p className="muted">Loading your library…</p>
              ) : visible.length === 0 ? (
                <div className="card library-empty">
                  <p>{EMPTY_TEXT[activeTab]}</p>
                  <Link to="/browse" className="btn btn-accent">Find a book</Link>
                </div>
              ) : (
                <div className="book-grid">
                  {visible.map((item) => (
                    <BookCard key={item._id} book={item.book}>
                      <select
                        aria-label={`Move ${item.book.title} to another list`}
                        className="library-move"
                        value={item.status}
                        disabled={busyId === item._id}
                        onChange={(e) => changeStatus(item, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                      <button
                        className="library-remove"
                        disabled={busyId === item._id}
                        onClick={() => remove(item)}
                      >
                        Remove
                      </button>
                    </BookCard>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}
