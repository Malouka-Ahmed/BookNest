import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Browse from './pages/Browse';
import BookDetails from './pages/BookDetails';
import MyLibrary from './pages/MyLibrary';
import Profile from './pages/Profile';

function App() {
  return (
    <>
      {/* TEMPORARY nav for testing. You will replace this with a real Navbar component. */}
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
        <Link to="/">Home</Link>
        <Link to="/browse">Browse</Link>
        <Link to="/library">My Library</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/library" element={<MyLibrary />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;