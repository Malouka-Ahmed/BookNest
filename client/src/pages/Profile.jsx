import { useState } from 'react';
import './Profile.css';

// MOCK DATA: replace with a real API call once auth is ready
const mockUser = {
  name: 'Malak',
  email: 'malak@example.com',
  bio: 'I love fantasy and mystery novels.',
  memberSince: '2026-11-01',
  counts: { reading: 2, completed: 8, wantToRead: 5 },
};

export default function Profile() {
  const [user, setUser] = useState(mockUser);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, bio: user.bio });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave(e) {
    e.preventDefault();
    setUser({ ...user, name: form.name, bio: form.bio });
    setEditing(false);
  }

  return (
    <div className="container">
      <div className="card profile-card">
        <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>

        {editing ? (
          <form onSubmit={handleSave} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea id="bio" name="bio" rows="3" value={form.bio} onChange={handleChange} />
            </div>
            <button type="submit" className="btn">Save</button>{' '}
            <button type="button" className="btn btn-danger" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </form>
        ) : (
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p className="muted">{user.email}</p>
            <p>{user.bio}</p>
            <p className="muted">
              Member since {new Date(user.memberSince).toLocaleDateString()}
            </p>
            <button className="btn" onClick={() => setEditing(true)}>Edit profile</button>
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