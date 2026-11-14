import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch, getToken, STATUSES } from '../api';
import './AddToListDropdown.css';

// "Add to list" control for the Book Details page.
// - not on a list yet  -> POST /api/library
// - already on a list  -> PUT /api/library/:id
// - "Remove"           -> DELETE /api/library/:id
export default function AddToListDropdown({ bookId }) {
  const loggedIn = Boolean(getToken());
  const [entry, setEntry] = useState(null); // the UserBook, or null
  const [loading, setLoading] = useState(loggedIn);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loggedIn) return;
    let cancelled = false;
    apiFetch(`/api/library/book/${bookId}`)
      .then((data) => !cancelled && setEntry(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [bookId, loggedIn]);

  async function handleChange(e) {
    const value = e.target.value;
    setError('');
    setMessage('');
    setSaving(true);
    try {
      if (value === 'remove') {
        await apiFetch(`/api/library/${entry._id}`, { method: 'DELETE' });
        setEntry(null);
        setMessage('Removed from your library');
      } else if (entry) {
        setEntry(await apiFetch(`/api/library/${entry._id}`, { method: 'PUT', body: { status: value } }));
        setMessage(`Moved to ${labelFor(value)}`);
      } else {
        setEntry(await apiFetch('/api/library', { method: 'POST', body: { bookId, status: value } }));
        setMessage(`Added to ${labelFor(value)}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!loggedIn) {
    return (
      <p className="add-to-list-login">
        <Link to="/login">Log in</Link> to add this book to your library.
      </p>
    );
  }

  return (
    <div className="add-to-list">
      <label htmlFor="add-to-list-select" className="add-to-list-label">
        {entry ? 'On your shelf' : 'Add to list'}
      </label>
      <select
        id="add-to-list-select"
        className={entry ? 'add-to-list-select is-added' : 'add-to-list-select'}
        value={entry?.status || ''}
        onChange={handleChange}
        disabled={loading || saving}
      >
        {!entry && (
          <option value="" disabled>
            {loading ? 'Loading…' : 'Choose a list…'}
          </option>
        )}
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
        {entry && <option value="remove">Remove from library</option>}
      </select>

      <p className="add-to-list-status" role="status" aria-live="polite">
        {error ? <span className="add-to-list-error">{error}</span> : message}
        {!error && message && entry && (
          <>
            {' · '}
            <Link to={`/library?tab=${entry.status}`}>View in My Library</Link>
          </>
        )}
      </p>
    </div>
  );
}

function labelFor(value) {
  return STATUSES.find((s) => s.value === value)?.label || value;
}
