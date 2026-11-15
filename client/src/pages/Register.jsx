import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function validate() {
    const errors = {};
    if (form.name.trim().length < 2 || form.name.trim().length > 80) {
      errors.name = 'Name must be between 2 and 80 characters.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }
    if (form.password.length < 6 || new TextEncoder().encode(form.password).length > 72) {
      errors.password = 'Password must be 6-72 bytes long.';
    }
    if (form.confirmPassword !== form.password) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    setError('');
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate('/', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h1>Create your account</h1>
        {error && <p className="auth-error" role="alert">{error}</p>}

        <div className="form-group">
          <label htmlFor="register-name">Name</label>
          <input
            id="register-name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? 'register-name-error' : undefined}
            required
          />
          {fieldErrors.name && <span className="auth-field-error" id="register-name-error">{fieldErrors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'register-email-error' : undefined}
            required
          />
          {fieldErrors.email && <span className="auth-field-error" id="register-email-error">{fieldErrors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? 'register-password-error' : undefined}
            required
          />
          {fieldErrors.password && <span className="auth-field-error" id="register-password-error">{fieldErrors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="register-confirm-password">Confirm password</label>
          <input
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.confirmPassword)}
            aria-describedby={fieldErrors.confirmPassword ? 'register-confirm-password-error' : undefined}
            required
          />
          {fieldErrors.confirmPassword && (
            <span className="auth-field-error" id="register-confirm-password-error">
              {fieldErrors.confirmPassword}
            </span>
          )}
        </div>

        <button className="btn btn-accent" type="submit" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Register'}
        </button>
        <p className="auth-form-footer">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}