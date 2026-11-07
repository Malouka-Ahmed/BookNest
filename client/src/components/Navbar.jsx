import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">📚 BookNest</Link>

        <nav className="navbar-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/browse">Browse</NavLink>
          <NavLink to="/library">My Library</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>

        <div className="navbar-auth">
          <Link to="/login" className="btn btn-accent">Login</Link>
          <Link to="/register" className="btn">Register</Link>
        </div>
      </div>
    </header>
  );
}