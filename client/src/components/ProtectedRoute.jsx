import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading, sessionError, refreshSession } = useAuth();
  const location = useLocation();

  if (loading) return <p className="container" role="status">Checking your session…</p>;
  if (sessionError) {
    return (
      <div className="container" role="alert">
        <p>{sessionError}</p>
        <button className="btn" type="button" onClick={refreshSession}>Try again</button>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
}
