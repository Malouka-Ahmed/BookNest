import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './Navbar.css';

export default function Navbar() {
  const { user, loading, logout, refreshSession, sessionError } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">📚 BookNest</Link>

        <nav className="navbar-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/browse">Browse</NavLink>
          {user && <NavLink to="/library">My Library</NavLink>}
          {user && <NavLink to="/profile">Profile</NavLink>}
        </nav>

        <div className="navbar-auth">
          {loading ? (
            <span role="status">Checking session…</span>
          ) : user ? (
            <>
              <span className="navbar-greeting">Hi, {user.name}</span>
              <button className="btn" type="button" onClick={logout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-accent">Log in</Link>
              <Link to="/register" className="btn">Register</Link>
              {sessionError && (
                <button className="navbar-retry" type="button" onClick={refreshSession}>Retry session</button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}