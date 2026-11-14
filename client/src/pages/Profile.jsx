import { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import { useAuth } from '../context/useAuth';
import './Profile.css';

export default function Profile() {
  const { updateUser } = useAuth();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    apiFetch('/api/users/me/summary')
      .then((profile) => {
        if (!active) return;
        setUser(profile);
        setForm({ name: profile.name, bio: profile.bio || '' });
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const updated = await apiFetch('/api/users/me', {
        method: 'PUT',
        body: { name: form.name, bio: form.bio },
      });
      updateUser(updated);
      setUser((current) => ({ ...current, ...updated }));
      setEditing(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="container" role="status">Loading your profile…</p>;
  if (error && !user) return <p className="container" role="alert">{error}</p>;
  if (!user) return null;

  return (
    <div className="container">
      <div className="card profile-card">
        <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>

        {editing ? (
          <form onSubmit={handleSave} className="profile-form">
            {error && <p className="auth-error" role="alert">{error}</p>}
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea id="bio" name="bio" rows="3" value={form.bio} onChange={handleChange} />
            </div>
            <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>{' '}
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                setForm({ name: user.name, bio: user.bio || '' });
                setError('');
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="profile-info">
            {error && <p className="auth-error" role="alert">{error}</p>}
            <h1>{user.name}</h1>
            <p className="muted">{user.email}</p>
            <p>{user.bio}</p>
            <p className="muted">
              Member since {new Date(user.memberSince).toLocaleDateString()}
            </p>
            <button
              className="btn"
              onClick={() => {
                setForm({ name: user.name, bio: user.bio || '' });
                setEditing(true);
              }}
            >
              Edit profile
            </button>
          </div>
        )}
      </div>

      <div className="profile-stats">
        <div className="card stat">
          <h2>{user.counts.reading}</h2>
          <p>Reading</p>
        </div>
        <div className="card stat">
          <h2>{user.counts.completed}</h2>
          <p>Completed</p>
        </div>
        <div className="card stat">
          <h2>{user.counts.wantToRead}</h2>
          <p>Want to Read</p>
        </div>
      </div>
    </div>
  );
}